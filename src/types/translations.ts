export type Translations = {
  [key: string]: Translation | Translations;
};

export type StringTranslation = string;
export type ArgTranslation = {
  value: string;
  args?: string[];
};
export type Translation = StringTranslation | ArgTranslation;

export function isStringTranslation(value: Translation | Translations): value is StringTranslation {
  return typeof value === "string";
}

export function isArgTranslation(value: Translation | Translations): value is ArgTranslation {
  if (typeof value === "string") {
    return false;
  }

  if (!value.value) {
    return false;
  }

  if (!!value.args && !Array.isArray(value.args)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (key !== "value" && key !== "args") {
      return false;
    }
  }

  return true;
}
