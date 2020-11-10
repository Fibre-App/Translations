import * as FS from "fs";
import * as Path from "path";

export class TranslationUtils {
  private readonly translationsFolder: string;

  constructor(private readonly fs: typeof FS, private readonly path: typeof Path) {
    this.translationsFolder = path.join(__dirname, "../translations");
  }

  public async getTranslationFilePaths(): Promise<string[]> {
    const allFiles: FS.Dirent[] | string[] = await this.readdirAsync(this.translationsFolder);

    if (!allFiles || allFiles.length === 0) {
      return [];
    }

    if (this.isDirentArray(allFiles)) {
      return allFiles.map(f => f.name);
    }

    return allFiles;
  }

  public async getTranslationFile(name: string): Promise<string | undefined> {
    const filePath: string = this.path.join(this.translationsFolder, name);

    if (!(await this.doesFileExist(filePath))) {
      return undefined;
    }

    return this.readFileAsync(filePath);
  }

  private readdirAsync(folder: string): Promise<FS.Dirent[] | string[]> {
    return new Promise<FS.Dirent[] | string[]>((resolve, reject) => {
      this.fs.readdir(folder, { withFileTypes: true }, (err, files) => {
        if (!!err) {
          reject(err);
          return;
        }
        resolve(files);
      });
    });
  }

  private doesFileExist(location: string): Promise<boolean> {
    return new Promise((resolve, _) => {
      this.fs.stat(location, (err, stats) => {
        if (!!err) {
          resolve(false);
          return;
        }
        resolve(stats.isFile());
      });
    });
  }

  private readFileAsync(location: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.fs.readFile(location, { encoding: "utf8" }, (err, data) => {
        if (!!err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }

  private isDirentArray(result: FS.Dirent[] | string[]): result is FS.Dirent[] {
    return (result[0] as FS.Dirent).name !== undefined;
  }
}
