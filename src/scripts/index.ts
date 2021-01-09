import * as FS from "fs";
import * as Path from "path";

const projDir: string = Path.join(__dirname, "../../");
const srcDir: string = Path.join(projDir, "../src");
const valuesDir: string = Path.join(projDir, "./values");

async function delFolder(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    FS.rmdir(path, { recursive: true }, e => (!!e ? reject(e) : resolve()))
  );
}

async function createFolder(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    FS.mkdir(path, { recursive: true }, e => (!!e ? reject(e) : resolve()))
  );
}

async function run(): Promise<void> {
  await delFolder(valuesDir);
  await createFolder(valuesDir);
}

async function buildLangage(shortcode: string): Promise<void> {}

(async () => await run())();
