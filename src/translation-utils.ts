import * as fs from "fs";
import path from "path";

export const translationsFolder: string = path.join(__dirname, "../../translations");

export type readdirAsyncType = (
  path: fs.PathLike,
  options: { encoding?: string; withFileTypes: true }
) => Promise<fs.Dirent[] | string[]>;
export type statAsyncType = (path: fs.PathLike) => Promise<fs.Stats>;
export type readFileAsyncType = (path: string, options: { encoding: string; flag?: string }) => Promise<string>;
export type joinType = (...paths: string[]) => string;

export class TranslationUtils {
  constructor(
    private readonly _translationsFolder: string,
    private readonly _readdirAsync: readdirAsyncType,
    private readonly _statAsync: statAsyncType,
    private readonly _readFileAsync: readFileAsyncType,
    private readonly _join: joinType
  ) {}

  public async getTranslationFilePaths(): Promise<string[]> {
    const allFiles: fs.Dirent[] | string[] = await this._readdirAsync(this._translationsFolder, {
      withFileTypes: true
    });

    if (!allFiles || allFiles.length === 0) {
      return [];
    }

    if (this.isDirentArray(allFiles)) {
      return allFiles.map(f => f.name);
    }

    return allFiles;
  }

  public async getTranslationFile(name: string): Promise<string | undefined> {
    const filePath: string = this._join(this._translationsFolder, name);

    if (!(await this.doesFileExist(filePath))) {
      return undefined;
    }

    return this._readFileAsync(filePath, { encoding: "UTF-8" });
  }

  private async doesFileExist(location: string): Promise<boolean> {
    try {
      const stats: fs.Stats = await this._statAsync(location);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  private isDirentArray(result: fs.Dirent[] | string[]): result is fs.Dirent[] {
    return (result[0] as fs.Dirent).name !== undefined;
  }
}
