// tslint:disable no-null-keyword
import { mocked } from "ts-jest/utils";
import { MockedObject } from "ts-jest/dist/utils/testing";
import { TranslationUtils } from "../src/translation-utils";
import * as FS from "fs";
import * as Path from "path";

jest.mock("fs");
jest.mock("path");

const mockedPath: MockedObject<typeof Path> = mocked(Path);
const mockedFS: MockedObject<typeof FS> = mocked(FS);

type ReadDirOptions = { encoding?: string | null; withFileTypes: true };

describe("TranslationUtils", () => {
  let subject: TranslationUtils;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should set the translations folder to the current dir + ../../translations", async () => {
      const translationFolder: string = "./the/translations/folder";
      mockedPath.join.mockReset();

      mockedPath.join.mockReturnValue(translationFolder);

      subject = new TranslationUtils(FS, Path);

      expect(mockedPath.join).toHaveBeenCalledTimes(1);
      expect(mockedPath.join).toHaveBeenCalledWith(expect.anything(), "../translations");
    });
  });

  describe("getTranslationFilePaths", () => {
    const translationFolder: string = "./the/translations/folder";

    beforeEach(() => {
      mockedPath.join.mockReturnValue(translationFolder);
      subject = new TranslationUtils(FS, Path);
    });

    it("should read in all the files from the translations folder", async () => {
      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, []));

      subject = new TranslationUtils(FS, Path);
      await subject.getTranslationFilePaths();

      expect(mockedFS.readdir).toHaveBeenCalledTimes(1);
      expect(mockedFS.readdir).toHaveBeenCalledWith(translationFolder, expect.anything(), expect.anything());
    });

    it("should read in all the files from the translations folder with file types", async () => {
      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, []));

      await subject.getTranslationFilePaths();

      expect(mockedFS.readdir).toHaveBeenCalledTimes(1);
      expect(mockedFS.readdir).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining<ReadDirOptions>({
          withFileTypes: true
        }),
        expect.anything()
      );
    });

    it("should return an empty array if fs reads in the files as undefined", async () => {
      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, undefined as any));

      const result: string[] = await subject.getTranslationFilePaths();

      expect(result).toEqual([]);
    });

    it("should return an empty array if fs reads in the files as null", async () => {
      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, null as any));

      const result: string[] = await subject.getTranslationFilePaths();

      expect(result).toEqual([]);
    });

    it("should return an empty array if fs reads in the files as an empty array", async () => {
      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, []));

      const result: string[] = await subject.getTranslationFilePaths();

      expect(result).toEqual([]);
    });

    it("should return the fs readdir result if it is a string array", async () => {
      const fileNames: string[] = ["file #1", "file #2"];

      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, fileNames as any));

      const result: string[] = await subject.getTranslationFilePaths();

      expect(result).toEqual(fileNames);
    });

    it("should return only the file names from the fs readdir result if it is a Dirent array", async () => {
      const fileNames: FS.Dirent[] = [{ name: "file #1" }, { name: "file #2" }] as FS.Dirent[];

      mocked(FS.readdir).mockImplementation((_, __, callback) => callback(null, fileNames));

      const result: string[] = await subject.getTranslationFilePaths();

      expect(result).toEqual(["file #1", "file #2"]);
    });
  });

  describe("getTranslationFile", () => {
    const translationFolder: string = "./the/translations/folder";

    beforeEach(() => {
      mockedPath.join.mockReturnValue(translationFolder);
      subject = new TranslationUtils(FS, Path);
    });

    it("should check to see if the file exists", async () => {
      const fullFilePath: string = "full/file/path";
      const fileStats: FS.Stats = {
        isFile: () => false
      } as FS.Stats;

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) => callback(null, fileStats));

      await subject.getTranslationFile("path");

      expect(mockedFS.stat).toBeCalledTimes(1);
      expect(mockedFS.stat).toHaveBeenCalledWith(fullFilePath, expect.anything(), expect.anything());
    });

    it("should return undefined if the file does not exist", async () => {
      const fullFilePath: string = "full/file/path";

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) =>
        callback({ name: "name", message: "message" }, undefined as any)
      );

      const result: string | undefined = await subject.getTranslationFile("path");

      expect(result).toBeUndefined();
    });

    it("should return undefined if the file is not a file", async () => {
      const fullFilePath: string = "full/file/path";
      const fileStats: FS.Stats = {
        isFile: () => false
      } as FS.Stats;

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) => callback(null, fileStats));

      const result: string | undefined = await subject.getTranslationFile("path");

      expect(result).toBeUndefined();
    });

    it("should read the file if the file exists", async () => {
      const fullFilePath: string = "full/file/path";
      const fileStats: FS.Stats = {
        isFile: () => true
      } as FS.Stats;
      const fileContent: string = "This is the content of the file";

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) => callback(null, fileStats));
      // The mess on this next line is due to a known limitation of typescript and
      // a 'problem' with fs.readFile - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
      // tslint:disable-next-line: ban-types
      mockedFS.readFile.mockImplementation(((_: any, __: any, callback: Function) =>
        callback(null, fileContent as any)) as any);

      await subject.getTranslationFile("path");

      expect(mockedFS.readFile).toBeCalledTimes(1);
      expect(mockedFS.readFile).toHaveBeenCalledWith(fullFilePath, expect.anything(), expect.anything());
    });

    it("should read the file as utf-8 if the file exists", async () => {
      const fullFilePath: string = "full/file/path";
      const fileStats: FS.Stats = {
        isFile: () => true
      } as FS.Stats;
      const fileContent: string = "This is the content of the file";

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) => callback(null, fileStats));
      // The mess on this next line is due to a known limitation of typescript and
      // a 'problem' with fs.readFile - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
      // tslint:disable-next-line: ban-types
      mockedFS.readFile.mockImplementation(((_: any, __: any, callback: Function) =>
        callback(null, fileContent as any)) as any);

      await subject.getTranslationFile("path");

      expect(mockedFS.readFile).toBeCalledTimes(1);
      expect(mockedFS.readFile).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          encoding: "UTF-8"
        }),
        expect.anything()
      );
    });

    it("should return the file content", async () => {
      const fullFilePath: string = "full/file/path";
      const fileStats: FS.Stats = {
        isFile: () => true
      } as FS.Stats;
      const fileContent: string = "This is the content of the file";

      mockedPath.join.mockReturnValue(fullFilePath);
      mockedFS.stat.mockImplementation((_, callback) => callback(null, fileStats));
      // The mess on this next line is due to a known limitation of typescript and
      // a 'problem' with fs.readFile - https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34889
      // tslint:disable-next-line: ban-types
      mockedFS.readFile.mockImplementation(((_: any, __: any, callback: Function) =>
        callback(null, fileContent as any)) as any);

      const result: string | undefined = await subject.getTranslationFile("path");

      expect(result).toBe(fileContent);
    });
  });
});
