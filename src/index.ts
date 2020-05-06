import { promisify } from "util";
import * as fs from "fs";
import path from "path";

const translationsFolder: string = path.join(__dirname, "../../translations");

type readdirAsyncType = (path: fs.PathLike, options: { encoding?: string; withFileTypes: true; }) => Promise<fs.Dirent[]>;
const readdirAsync: readdirAsyncType = promisify(fs.readdir);
const statAsync: (path: fs.PathLike) => Promise<fs.Stats> = promisify(fs.stat);
const readFileAsync: (path: string, options: { encoding: string; flag?: string; }) => Promise<string> = promisify(fs.readFile);

export async function getTranslationFilePaths(): Promise<string[]> {
  const allFiles: fs.Dirent[] | string[] = await readdirAsync(translationsFolder, { withFileTypes: true });

  if (!allFiles || allFiles.length === 0) {
    return [];
  }

  if (isDirentArray(allFiles)) {
    return allFiles.map(f => f.name);
  }

  return allFiles;
}

export async function getTranslationFile(name: string): Promise<string | undefined> {
  const filePath: string = path.join(translationsFolder, name);

  if (!doesFileExist(filePath)) {
    return undefined;
  }

  return readFileAsync(filePath, { encoding: "UTF-8" });
}

async function doesFileExist(location: string): Promise<boolean> {
  try {
    const stats: fs.Stats = await statAsync(location);
    return stats.isFile();
  } catch {
    return false;
  }
}

function isDirentArray(result: fs.Dirent[] | string[]): result is fs.Dirent[] {
  return (result[0] as fs.Dirent).name !== undefined;
}
