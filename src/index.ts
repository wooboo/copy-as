import minimist from "minimist";
import inquirer from "inquirer";
import inquirerFuzzyPath from "inquirer-fuzzy-path";
import path from "path";
import copyReplace from "./copy-replace";
import { REPLServer } from 'repl';
inquirer.registerPrompt("fuzzypath", inquirerFuzzyPath);

export async function cli(argv: string[]) {
  const args = minimist(argv, {
    string: ["replace", "source", "destination"],
    alias: { replace: "r", source: "s", destination: "d" },
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
  ]);
  const params = { ...args, ...answers };
  const replace = (typeof params.replace === "string"
    ? [params.replace]
    : params.replace as string[]
  )
    .map((o:string) => o.split("/"))
    .map((o:string[]) => ({ from: o[0], to: o[1] }));
  await copyReplace({
    source: path.resolve(params.source),
    destination: path.resolve(params.destination),
    replace: replace
  });
}

function insertIf<T>(condition: any, ...elements: T[]) {
  return condition ? elements : [];
}
