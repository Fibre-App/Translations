import { Translations } from "../../../../../types/translations";

export const translations: Translations = {
  displayStrategies: {
    script: {
      title: "Script Repositories"
    },
    recent: {
      title: "Recent Repositories"
    },
    favourites: {
      title: "Favourites"
    }
  },
  row: {
    markAsFavourite: "Mark as favourite",
    unmarkAsFavourite: "Unark as favourite",
    markAsScript: "Mark as script",
    unmarkAsScript: "Unark as script"
  },
  table: {
    repositoryCount: {
      value: "${number} Repositories",
      args: ["number"]
    },
    repositorySelection: {
      value: "Selected ${selected}/${outOf} repositories",
      args: ["selected", "outOf"]
    }
  },
  repositoryContextMenu: {
    openSelected: {
      value: "Open Selected (${number})",
      args: ["number"]
    },
    open: {
      value: "Open ${name}",
      args: ["name"]
    },
    removeSelected: {
      value: "Remove Selected (${number})",
      args: ["number"]
    },
    remove: {
      value: "Remove ${name}",
      args: ["name"]
    }
  }
};
