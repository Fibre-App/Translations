import * as Path from "path";
import { interpolationRegex } from "../translation-utils";
import { languages, Shortcode } from "../translations/languages";
import {
  ArgTranslation,
  isArgTranslation,
  isStringTranslation,
  Translation,
  Translations
} from "../types/translations";
import { childFiles, childFolders, createFolder, delFolder, folderExists } from "./file-utils";
import { Language } from "./language";
import { logDoneSection, reportError, logInfo, logSection } from "./log";
import { SectionDetails } from "./section-details";

const projDir: string = Path.join(__dirname, "../../");
const srcDir: string = Path.join(projDir, "./src");
const translationsDir: string = Path.join(srcDir, "./translations");
const valuesDir: string = Path.join(srcDir, "./values");

const baseLanguageFullTranslations: Map<string, Translation | Translations> = new Map<
  string,
  Translation | Translations
>();

async function run(): Promise<void> {
  logSection("Cleaning values folder");
  await delFolder(valuesDir);
  await createFolder(valuesDir);
  logDoneSection();

  const foundLanguageNames: Set<string> = new Set<string>();

  for (const shortcode of Object.keys(languages) as Shortcode[]) {
    const language: Language = new Language(
      shortcode,
      languages[shortcode].name,
      languages[shortcode].extends
    );

    if (foundLanguageNames.has(language.name)) {
      reportError(
        `Language ${shortcode} needs a distinct name, but ${language.name} has already been used.`
      );
    }
    foundLanguageNames.add(language.name);

    if (!language.parentShortcode && shortcode !== "en-gb") {
      reportError(`Language ${shortcode}, ${language.name} needs to extend another language`);
    }

    await loadLanguage(language);
  }

  logSection("Transpiling translations");
}

async function loadLanguage(language: Language): Promise<void> {
  logSection(
    `Loading ${language.shortcode}, ${language.name}, which extends ${
      language.parentShortcode ?? "nothing"
    }`
  );

  let sections: SectionDetails[] = [];

  if (await folderExists(language.basePath)) {
    sections = await loadLanguageFolder(
      language.basePath,
      new SectionDetails(),
      language.parentShortcode
    );
  }

  for (const section of sections) {
    language.addSectionDetails(section);
  }

  await language.writeFilesToDisk();

  logDoneSection();
}

async function loadLanguageFolder(
  parentPath: string,
  sectionDetails: SectionDetails,
  parent: Shortcode | undefined
): Promise<SectionDetails[]> {
  const childSectionDetails: SectionDetails[] = [];

  const folders: string[] = await childFolders(parentPath);
  for (const folder of folders) {
    const folderPath: string = Path.join(parentPath, folder);
    const newSectionDetails: SectionDetails = sectionDetails.copy();
    newSectionDetails.add(folder);

    childSectionDetails.push(...(await loadLanguageFolder(folderPath, newSectionDetails, parent)));
  }

  const files: string[] = await childFiles(parentPath);
  for (const file of files) {
    const filePath: string = Path.join(parentPath, file);
    const fileNameWithoutExtension: string = Path.parse(file).name;
    const newSectionDetails: SectionDetails = sectionDetails.copy();
    newSectionDetails.add(fileNameWithoutExtension);

    childSectionDetails.push(await loadLanguageFile(filePath, newSectionDetails, parent));
  }

  return childSectionDetails;
}

async function loadLanguageFile(
  path: string,
  sectionDetails: SectionDetails,
  parent: Shortcode | undefined
): Promise<SectionDetails> {
  logInfo(`Loading file ${Path.relative(translationsDir, path)}`);

  const loadedModule: any = await import(path);
  const translations: Translations = loadedModule.translations;

  if (!translations) {
    reportError(`No translations found in the file ${path}`);
  }

  if (!parent) {
    baseLanguageFullTranslations.set(sectionDetails.key, translations);
  }

  sectionDetails = loadObject(
    sectionDetails,
    translations,
    [],
    0,
    !parent ? undefined : baseLanguageFullTranslations.get(sectionDetails.key),
    parent
  );

  return sectionDetails;
}

function loadObject(
  sectionDetails: SectionDetails,
  value: Translation | Translations,
  keys: string[],
  indentLevel: number,
  engbTranslations: Translation | Translations | undefined,
  parent: Shortcode | undefined
): SectionDetails {
  const indent: string = "  ".repeat(indentLevel);
  const newestKey: string = keys[keys?.length - 1] ?? "";

  if (!value) {
    const parentShortcodeNoDash: string = parent?.split("-").join("") ?? "";
    const keyString: string = keys.join(".");
    sectionDetails.text += `\n${indent}${newestKey}: ${parentShortcodeNoDash}["${sectionDetails.key}"].${keyString},`;
    return sectionDetails;
  }

  if (isStringTranslation(value)) {
    if (newestKey.length === 0) {
      reportError("Found a top-level string value");
    }
    sectionDetails.text += `\n${indent}${newestKey}: "${value}",`;
    sectionDetails.interfaceText += `${indent}${newestKey}: StringTranslation;\n`;
    return sectionDetails;
  }

  if (isArgTranslation(value)) {
    validateArgTranslation(value);

    const parameters: string = value.args?.map(v => `${v}: string`).join(", ") ?? "";
    const args: string = value.args?.join(", ") ?? "";

    sectionDetails.text += `\n${indent}${newestKey}: (${parameters}) => interpolate("${value.value}", { ${args} }),`;
    sectionDetails.interfaceText += `${indent}${newestKey}: (${parameters}) => string;\n`;
    return sectionDetails;
  }

  if (!!newestKey && newestKey.length > 0) {
    sectionDetails.text += `\n${indent}${newestKey}: {`;
    sectionDetails.interfaceText += `${indent}${newestKey}: {\n`;
  }

  const translationKeys: string[] = Object.keys(engbTranslations ?? value);
  const invalidKeys: string[] = Object.keys(value).filter(k => !translationKeys.includes(k));

  if (invalidKeys.length > 0) {
    reportError("Found invalid key(s): " + invalidKeys.join(", "));
  }

  for (const translationKey of translationKeys) {
    const childEngbTranslations: Translations = !!engbTranslations
      ? ((engbTranslations as any)[translationKey] as Translations)
      : ((value as any)[translationKey] as Translations);

    sectionDetails = loadObject(
      sectionDetails,
      (value as any)[translationKey] as Translations,
      [...keys, translationKey],
      indentLevel + 1,
      childEngbTranslations,
      parent
    );
  }

  if (!!keys && keys.length > 0) {
    sectionDetails.text += `\n${indent}},`;
    sectionDetails.interfaceText += `${indent}};\n`;
  }

  return sectionDetails;
}

function validateArgTranslation(translation: ArgTranslation): void {
  const valuesToInterpolate: string[] =
    translation.value.match(interpolationRegex)?.map(m => m.substr(2, m.length - 3)) ?? [];

  const duplicates: string[] = valuesToInterpolate.filter(filterDuplicates);

  if (duplicates.length > 0) {
    reportError(`Duplicate translation args found: ${duplicates.map(v => `"${v}"`).join(", ")}`);
  }

  if (valuesToInterpolate.length > 0 && !translation.args) {
    reportError(
      `No translation args were given for "${
        translation.value
      }" but interpolation variables were found: ${valuesToInterpolate
        .map(v => `"${v}"`)
        .join(", ")}`
    );
  }

  const args: string[] = translation.args ?? [];

  for (const value of valuesToInterpolate) {
    if (value === "") {
      reportError(
        `The translation "${translation.value}" contains an empty interpolation variable ("\${}")`
      );
    }

    if (!args.includes(value)) {
      reportError(
        `The translation "${translation.value}" requires a value for ${value} but it was not declared as an argument`
      );
    }
  }
}

function filterDuplicates<T>(value: T, index: number, array: T[]): boolean {
  return array.indexOf(value) !== index;
}

(async () => await run())();
