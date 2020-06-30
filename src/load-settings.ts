import fs from "fs";
import path from "path";

export default async function loadSettings<T>(
  directory: string,
  fileName: string,
  parse: (s: string) => T,
  merge: (s1: T, s2: T) => T
): Promise<T> {
  let settings;
  const parentDirectory = path.dirname(directory);
  const parsedPath = path.parse(parentDirectory);

  if (parsedPath.dir !== parsedPath.root) {
    settings = await loadSettings(parentDirectory, fileName, parse, merge);
  } else {
    settings = parse("");
  }

  const settingsFile = path.join(directory, fileName);
  if (fs.existsSync(settingsFile)) {
    const fileContent = await fs.promises.readFile(settingsFile, "utf-8");
    settings = merge(settings, parse(fileContent));
  }

  return settings;
}
