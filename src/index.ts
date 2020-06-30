import minimist from "minimist";
import inquirer from "inquirer";
import inquirerFuzzyPath from "inquirer-fuzzy-path";
import path from "path";
import copyReplace from "./copy-replace";
import loadSettings from "./load-settings";
import fs from "fs";
inquirer.registerPrompt("fuzzypath", inquirerFuzzyPath);

export async function cli(argv: string[]) {
  const args = minimist(argv, {
    string: ["replace", "source", "destination", "ignore"],
    alias: { replace: "r", source: "s", destination: "d", ignore: "i" },
  });

  args.source = args._[0] || args.source;
  args.destination = args._[1] || args.destination;

  const answers = await inquirer.prompt([
    ...insertIf(!args.source, {
      type: "fuzzypath",
      excludePath: (nodePath: string) =>
        nodePath.startsWith("node_modules") || nodePath.startsWith(".git"),
      name: "source",
      itemType: "any",
    }),
    ...insertIf(!args.destination, {
      type: "fuzzypath",
      excludePath: (nodePath: string) =>
        nodePath.startsWith("node_modules") || nodePath.startsWith(".git"),
      name: "destination",
      itemType: "directory",
    }),
    ...insertIf(!args.replace, {
      type: "input",
      name: "replace",
      message: "replace pattern",
    }),
  ]);
  const ignore =
    (typeof args.ignore === "string"
      ? [args.ignore]
      : (args.ignore as string[])) || [];
  console.log(args.ignore);
  const params = { ...args, ...answers };
  const replace = (
    (typeof params.replace === "string"
      ? [params.replace]
      : (params.replace as string[])) || []
  )
    .map((o: string) => o.split("/"))
    .map((o: string[]) => ({ from: o[0], to: o[1] }));

  const source = path.resolve(params.source);
  const destination = path.resolve(params.destination);

  const sourceStat = await fs.promises.stat(source);
  const sourceDir = sourceStat.isDirectory() ? source : path.dirname(source);

  const ignores = await loadSettings<string[]>(
    sourceDir,
    ".cpasignore",
    (s) =>
      s
        .split(/\r\n|\n|\r/)
        .map((o) => o.trim())
        .filter((o) => o)
        .filter((o) => !o.startsWith("#")),
    (s1, s2) => [...s1, ...s2]
  );

  await copyReplace({
    source: source,
    destination: destination,
    replace: replace,
    ignore: [...ignores, ...ignore],
  });
}

function insertIf<T>(condition: any, ...elements: T[]) {
  return condition ? elements : [];
}
