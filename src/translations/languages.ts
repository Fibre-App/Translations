import { Languages } from "../types/language.interface";

export type Shortcode = "en-gb" | "en-us" | "en-ca";

export const languages: Languages<Shortcode> = {
  "en-gb": {
    name: "English (UK)",
    // tslint:disable-next-line: no-non-null-assertion
    extends: undefined! // Base Language
  },
  "en-ca": {
    name: "English (CA)",
    extends: "en-us"
  },
  "en-us": {
    name: "English (US)",
    extends: "en-gb"
  }
};
