import { IMock, Mock, It, Times } from "typemoq";
import { TranslationUtils } from "../src/translation-utils";
import * as FS from "fs";
import * as Path from "path";
import { assert } from "console";

type ReadDirOptions = { encoding?: string | null; withFileTypes: true };

describe("TranslationUtils", () => {
  let subject: TranslationUtils;

  let fs: IMock<typeof FS>;
  let path: IMock<typeof Path>;

  beforeEach(() => {
    subject = undefined as any;

    fs = Mock.ofType<typeof FS>();
    path = Mock.ofType<typeof Path>();
  });

  describe("constructor", () => {
    it("should set the translations folder to the current dir + ../../translations", async () => {
      const translationFolder: string = "./the/translations/folder";

      given_path_join_returnsWhenGiven(translationFolder, It.isAnyString(), "../../translations");
      given_subject_isInstantiated();

      path.verify(p => p.join(It.isAnyString(), "../../translations"), Times.once());
    });
  });

  describe("getTranslationFilePaths", () => {
    it("should read in all the files from the translations folder", async () => {
      const translationFolder: string = "./the/translations/folder";

      given_path_join_returnsWhenGiven(translationFolder, It.isAnyString(), "../../translations");
      given_fs_readDir_resolvesWhenGiven([], translationFolder);
      given_subject_isInstantiated();

      await subject.getTranslationFilePaths();

      fs.verify(f => f.readdir(translationFolder, It.isAny(), It.isAny()), Times.once());
    });

    it("should read in all the files from the translations folder with file types", async () => {
      const translationFolder: string = "./the/translations/folder";

      given_path_join_returnsWhenGiven(translationFolder, It.isAnyString(), "../../translations");
      given_fs_readDir_resolvesWhenGiven([], translationFolder);
      given_subject_isInstantiated();

      await subject.getTranslationFilePaths();

      fs.verify(
        f =>
          f.readdir(
            It.isAny(),
            It.is<ReadDirOptions>(i => i.withFileTypes === true),
            It.isAny()
          ),
        Times.once()
      );
    });

    it("should return an empty array if fs reads in the files as undefined", async () => {
      const translationFolder: string = "./the/translations/folder";

      given_path_join_returnsWhenGiven(translationFolder, It.isAnyString(), "../../translations");
      given_fs_readDir_resolvesWhenGiven(undefined as any, translationFolder);
      given_subject_isInstantiated();

      const result: string[] = await subject.getTranslationFilePaths();

      // Assert
    });
  });

  function given_subject_isInstantiated(): void {
    subject = new TranslationUtils(fs.object, path.object);
  }

  function given_path_join_returnsWhenGiven(returns: string, ...whenGiven: string[]): void {
    path.setup(p => p.join(...whenGiven)).returns(() => returns);
  }

  function given_fs_readDir_resolvesWhenGiven(resolves: FS.Dirent[] | string[], whenGiven: string): void {
    fs.setup(f => f.readdir(whenGiven, It.isAny(), It.isAny())).callback((_, __, callback) =>
      callback(undefined, resolves)
    );
  }
});
