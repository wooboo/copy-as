import path from "path";
import fs from "fs";
import rename from "./rename";
import ignorer from "ignore";
export default async function copyReplace({
  source,
  destination,
  replace,
  ignore,
  noPreserveCase,
}: {
  source: string;
  destination: string;
  replace: Array<{ from: string; to: string }>;
  ignore: string[];
  noPreserveCase: boolean;
}) {
  const sourceStats = await fs.promises.stat(source);
  const sourceName = path.basename(source);
  const newNem = rename(sourceName, replace, noPreserveCase);
  const newDestination = path.join(destination, newNem);
  const ig = ignorer().add(ignore);
  if (sourceStats.isDirectory()) {
    console.log("directory", source, newDestination);
    if (!fs.existsSync(newDestination)) {
      await fs.promises.mkdir(newDestination);
    }
    const elements = await fs.promises.readdir(source);
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      const sourcePath = path.join(source, element);
      if(ig.ignores(element)){
        continue;
      }
      await copyReplace({
        source: sourcePath,
        destination: newDestination,
        replace,
        ignore,
        noPreserveCase,
      });
    }
  } else {
    console.log("file", source, newDestination);
    const content = await fs.promises.readFile(source, "utf8");
    await fs.promises.writeFile(newDestination, rename(content, replace, noPreserveCase));
  }
}
