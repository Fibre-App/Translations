// ********************************
//
// ********************************

import { interpolate } from "../translation-utils";
import { ILanguage } from "./language.interface";
import * as Sections from "./section.interface";
import * as enus from "./en-us";

// Sections

// Language

export const enca: ILanguage = {
  metadata: {
    shortcode: "en-ca",
    name: "English (CA)"
  },
  "components-tabs-repository-branches": enus._componentsTabsRepositoryBranches
};

export default enca;
