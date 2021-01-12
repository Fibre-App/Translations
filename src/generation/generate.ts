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

let baseLanguageFullTranslations: Translation | Translations;

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
    baseLanguageFullTranslations = translations;
  }

  sectionDetails = loadObject(
    sectionDetails,
    translations,
    "",
    0,
    !parent ? undefined : baseLanguageFullTranslations,
    parent
  );

  return sectionDetails;
}

function loadObject(
  sectionDetails: SectionDetails,
  value: Translation | Translations,
  key: string,
  indentLevel: number,
  engbTranslations: Translation | Translations | undefined,
  parent: Shortcode | undefined
): SectionDetails {
  const indent: string = "  ".repeat(indentLevel);

  if (!value) {
    const parentShortcodeNoDash: string = parent?.split("-").join("") ?? "";
    sectionDetails.text += `${indent}${key}: ${parentShortcodeNoDash}.${sectionDetails.varName}.${key},\n`;
    return sectionDetails;
  }

  if (isStringTranslation(value)) {
    if (key.length === 0) {
      reportError("Found a top-level string value");
    }
    sectionDetails.text += `${indent}${key}: "${value}",\n`;
    sectionDetails.interfaceText += `${indent}${key}: StringTranslation;\n`;
    return sectionDetails;
  }

  if (isArgTranslation(value)) {
    validateArgTranslation(value);

    const parameters: string = value.args?.map(v => `${v}: string`).join(", ") ?? "";
    const args: string = value.args?.join(", ") ?? "";

    sectionDetails.text += `${indent}${key}: (${parameters}) => interpolate("${value.value}", { ${args} }),\n`;
    sectionDetails.interfaceText += `${indent}${key}: (${parameters}) => string;\n`;
    return sectionDetails;
  }

  if (!!key && key.length > 0) {
    sectionDetails.text += `${indent}${key}: {\n`;
    sectionDetails.interfaceText += `${indent}${key}: {\n`;
  }

  const keys: string[] = Object.keys(engbTranslations ?? value);
  for (const childKey of keys) {
    const childEngbTranslations: Translations = !!engbTranslations
      ? ((engbTranslations as any)[childKey] as Translations)
      : ((value as any)[childKey] as Translations);

    sectionDetails = loadObject(
      sectionDetails,
      (value as any)[childKey] as Translations,
      childKey,
      indentLevel + 1,
      childEngbTranslations,
      parent
    );
  }

  if (!!key && key.length > 0) {
    sectionDetails.text += `${indent}},\n`;
    sectionDetails.interfaceText += `${indent}};\n`;
  }

  return sectionDetails;
}

function validateArgTranslation(translation: ArgTranslation): void {
  const valuesToInterpolate: string[] =
    translation.value.match(interpolationRegex)?.map(m => m.substr(2, m.length - 3)) ?? [];

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

(async () => await run())();
