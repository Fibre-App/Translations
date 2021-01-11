// Generated

import * as engb from "./en-gb";
import { ILanguage } from "./language.interface";
import { IComponentsTabsRepositoryBranches } from "./section.interface";

// Sections

export const _componentsTabsRepositoryBranches: IComponentsTabsRepositoryBranches = {
  title: "Local branches",
  branchContextMenu: {
    checkout: engb._componentsTabsRepositoryBranches.branchContextMenu.checkout
  }
};

// Language

export const enus: ILanguage = {
  metadata: {
    shortcode: "en-us",
    name: "English (US)"
  },
  "components-tabs-repository-branches": _componentsTabsRepositoryBranches
};

export default enus;
