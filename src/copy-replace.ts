import path from "path";
import fs from "fs";
import rename from "./rename";
console.log(process.arch);
export default async function copyReplace({
  source,
  destination,
  replace,
}: {
  source: string;
  destination: string;
  replace: Array<{ from: string; to: string }>;
}) {
  const sourceStats = fs.promises.stat(source);
  const sourceName = path.basename(source);
  const newNem = rename(sourceName, replace);
  const newDestination = path.join(destination, newNem);
  if ((await sourceStats).isDirectory()) {
    console.log("directory", source, newDestination);
    if (!fs.existsSync(newDestination)) {
      await fs.promises.mkdir(newDestination);
    }
    const elements = await fs.promises.readdir(source);
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      await copyReplace({
        source: path.join(source, element),
        destination: newDestination,
        replace,
      });
    }
  } else {
    console.log("file", source, newDestination);
    const content = await fs.promises.readFile(source, 'utf8');
    await fs.promises.writeFile(newDestination, rename(content, replace));
  }
}
