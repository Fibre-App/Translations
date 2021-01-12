// ********************************
//
// ********************************

import { ILanguageMetadata } from "../types/language-metadata.interface";
import * as Sections from "./section.interface";

// Language

export interface ILanguage {
  metadata: ILanguageMetadata;
  "components-tabs-repository-branches": Sections.IComponentsTabsRepositoryBranches;
}
