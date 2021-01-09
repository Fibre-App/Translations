export type Translations = {
  [key: string]: Translation | Translations;
};

export type StringTranslation = string;
export type ArgTranslation = {
  value: string;
  args?: string[];
};
type Translation = StringTranslation | ArgTranslation;
