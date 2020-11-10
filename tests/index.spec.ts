import glob from "glob";
import { promisify } from "util";
import { validate, ValidatorResult } from "jsonschema";
import { join } from "path";
import { readFile } from "fs";

const globAsync: (pattern: string, options?: glob.IOptions) => Promise<string[]> = promisify(glob);
const readFileAsync: (file: string) => Promise<string> = (file: string) => {
  return new Promise<string>((resolve, _) =>
    readFile(file, { encoding: "utf8" }, (err, data) => (err ? fail() : resolve(data)))
  );
};

describe("The translation files", () => {
  let jsonFiles: Map<string, string>;
  let schema: any;

  beforeEach(() => {
    jsonFiles = undefined as any;
    schema = undefined;
  });

  it("Are valid json", async () => {
    await given_jsonFiles_isLoadedIn();
    await given_schema_isLoadedIn();

    for (const [key, value] of jsonFiles) {
      let instance: any;

      try {
        instance = JSON.parse(value);
      } catch {
        fail(key + " Is not valid json");
      }

      const result: ValidatorResult = validate(instance, schema);

      expect(result.valid).toBe(true);
    }
  });

  async function given_jsonFiles_isLoadedIn(): Promise<void> {
    jsonFiles = new Map<string, string>();

    const fileNames: string[] = await globAsync("./translations/**/*.json", {});

    for (const fileName of fileNames) {
      jsonFiles.set(fileName, (await readFileAsync(fileName)).toString());
    }
  }

  async function given_schema_isLoadedIn(): Promise<void> {
    const path: string = join(__dirname, "../translation-schema.json");
    schema = JSON.parse((await readFileAsync(path)).toString());
  }
});
