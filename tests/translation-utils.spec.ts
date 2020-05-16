import { IMock, Mock, It, Times } from "typemoq";
import { TranslationUtils, readdirAsyncType, statAsyncType, readFileAsyncType, joinType } from "../src/translation-utils";
import * as fs from "fs";
import { assert } from "chai";

describe("TranslationUtils", () => {

	let subject: TranslationUtils;

	let translationsFolder: string;
	let readdirAsync: IMock<readdirAsyncType>;
	let statAsync: IMock<statAsyncType>;
	let readFileAsync: IMock<readFileAsyncType>;
	let join: IMock<joinType>;

	beforeEach(() => {
		subject = undefined as unknown as TranslationUtils;

		translationsFolder = undefined as unknown as string;
		readdirAsync = Mock.ofType<readdirAsyncType>();
		statAsync = Mock.ofType<statAsyncType>();
		readFileAsync = Mock.ofType<readFileAsyncType>();
		join = Mock.ofType<joinType>();
	});

	describe("getTranslationFilePaths", () => {
		it("should read the given translations folder", async () => {
			const translationFolder: string = "This is the translations folder";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([], translationFolder);
			given_subject_isInstantiated();

			await subject.getTranslationFilePaths();

			readdirAsync.verify(r => r(translationFolder, It.isAny()), Times.once());
		});

		it("should return an empty array if the translation folder reading returns undefined", async () => {
			const translationFolder: string = "This is the translations folder";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath(undefined as unknown as string[], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result.length, 0);
		});

		it("should return an empty array if the translation folder reading returns an empty array", async () => {
			const translationFolder: string = "This is the translations folder";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result.length, 0);
		});

		it("should return an array equal in length to the translation folder readings if they are Dirents", async () => {
			const translationFolder: string = "This is the translations folder";
			const name1: string = "This is a name";
			const name2: string = "This is also a name";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([
				{ name: name1 },
				{ name: name2 }
			] as fs.Dirent[], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result.length, 2);
		});

		it("should return the names of the translation folder readings if they are Dirents", async () => {
			const translationFolder: string = "This is the translations folder";
			const name1: string = "This is a name";
			const name2: string = "This is also a name";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([
				{ name: name1 },
				{ name: name2 }
			] as fs.Dirent[], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result[0], name1);
			assert.equal(result[1], name2);
		});

		it("should return an array equal in length to the translation folder readings if they are strings", async () => {
			const translationFolder: string = "This is the translations folder";
			const name1: string = "This is a name";
			const name2: string = "This is also a name";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([
				name1,
				name2 ], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result.length, 2);
		});

		it("should return the names of the translation folder readings if they are strings", async () => {
			const translationFolder: string = "This is the translations folder";
			const name1: string = "This is a name";
			const name2: string = "This is also a name";

			given_translationsFolder_equals(translationFolder);
			given_readdirAsync_returnsWhenGivenPath([
				name1,
				name2 ], translationFolder);
			given_subject_isInstantiated();

			const result: string[] = await subject.getTranslationFilePaths();

			assert.equal(result[0], name1);
			assert.equal(result[1], name2);
		});
	});

	describe("getTranslationFile", () => {
		it("should join the translation folder and the given file name", async () => {
			const translationFolder: string = "This is the translations folder";
			const fileName: string = "This is the file name";
			const filePath: string = "This is the full file path";

			given_translationsFolder_equals(translationFolder);
			given_join_returns_WhenGiven(filePath, [ translationFolder, fileName ]);
			given_readFileAsync_returnsWhenGivenPath("anything", filePath);

			given_subject_isInstantiated();

			await subject.getTranslationFile(fileName);

			join.verify(j => j(translationFolder, fileName), Times.once());
		});

		it("should return undefined if the given file does not exist", async () => {
			const translationFolder: string = "This is the translations folder";
			const fileName: string = "This is the file name";
			const filePath: string = "This is the full file path";

			given_translationsFolder_equals(translationFolder);
			given_join_returns_WhenGiven(filePath, [ translationFolder, fileName ]);
			given_statAsync_returnsWhenGiven(undefined as unknown as fs.Stats, filePath);
			given_readFileAsync_returnsWhenGivenPath("anything", filePath);

			given_subject_isInstantiated();

			const result: string | undefined = await subject.getTranslationFile(fileName);

			assert.isUndefined(result);
		});

		it("should return undefined if the given file exists but is actually not a file", async () => {
			const translationFolder: string = "This is the translations folder";
			const fileName: string = "This is the file name";
			const filePath: string = "This is the full file path";

			given_translationsFolder_equals(translationFolder);
			given_join_returns_WhenGiven(filePath, [ translationFolder, fileName ]);
			given_statAsync_returnsWhenGiven({
				isFile: () => false
			} as fs.Stats, filePath);
			given_readFileAsync_returnsWhenGivenPath("anything", filePath);

			given_subject_isInstantiated();

			const result: string | undefined = await subject.getTranslationFile(fileName);

			assert.isUndefined(result);
		});

		it("should return content if it does exist", async () => {
			const translationFolder: string = "This is the translations folder";
			const fileName: string = "This is the file name";
			const filePath: string = "This is the full file path";
			const fileConent: string = "This is the content of the file";

			given_translationsFolder_equals(translationFolder);
			given_join_returns_WhenGiven(filePath, [ translationFolder, fileName ]);
			given_statAsync_returnsWhenGiven({
				isFile: () => true
			} as fs.Stats, filePath);
			given_readFileAsync_returnsWhenGivenPath(fileConent, filePath);

			given_subject_isInstantiated();

			const result: string | undefined = await subject.getTranslationFile(fileName);

			assert.isDefined(result);
		});

		it("should return the content of the file if it does exist", async () => {
			const translationFolder: string = "This is the translations folder";
			const fileName: string = "This is the file name";
			const filePath: string = "This is the full file path";
			const fileConent: string = "This is the content of the file";

			given_translationsFolder_equals(translationFolder);
			given_join_returns_WhenGiven(filePath, [ translationFolder, fileName ]);
			given_statAsync_returnsWhenGiven({
				isFile: () => true
			} as fs.Stats, filePath);
			given_readFileAsync_returnsWhenGivenPath(fileConent, filePath);

			given_subject_isInstantiated();

			const result: string | undefined = await subject.getTranslationFile(fileName);

			assert.equal(result, fileConent);
		});
	});

	function given_subject_isInstantiated(): void {
		subject = new TranslationUtils(translationsFolder as string, readdirAsync.object, statAsync.object, readFileAsync.object, join.object);
	}

	function given_translationsFolder_equals(equals: string): void {
		translationsFolder = equals;
	}

	function given_join_returns_WhenGiven(returns: string, whenGiven: string[]): void {
		join
			.setup(j => j(...whenGiven))
			.returns(() => returns);
	}

	function given_statAsync_returnsWhenGiven(returns: fs.Stats, whenGiven: string): void {
		statAsync
			.setup(s => s(whenGiven))
			.returns(async () => returns);
	}

	function given_readFileAsync_returnsWhenGivenPath(returns: string, whenGivenPath: string): void {
		readFileAsync
			.setup(r => r(whenGivenPath, It.isAny()))
			.returns(async () => returns);
	}

	function given_readdirAsync_returnsWhenGivenPath(returns: fs.Dirent[] | string[], whenGivenPath: string): void {
		readdirAsync
			.setup(r => r(whenGivenPath, It.isAny()))
			.returns(async () => returns);
	}
});
