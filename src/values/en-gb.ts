// Generated

import { interpolate } from "../translation-utils";
import { ILanguage } from "./language.interface";
import { IComponentsTabsRepositoryBranches } from "./section.interface";

// Sections

export const _componentsTabsRepositoryBranches: IComponentsTabsRepositoryBranches = {
  title: "Local branches",
  branchContextMenu: {
    checkout(branch: string): string {
      return interpolate("Checkout ${branch}", {
        branch
      });
    }
  }
};

// Language

export const engb: ILanguage = {
  metadata: {
    shortcode: "en-gb",
    name: "English (UK)"
  },
  "components-tabs-repository-branches": _componentsTabsRepositoryBranches
};

export default engb;
