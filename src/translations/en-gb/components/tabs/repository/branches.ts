import { Translations } from "../../../../../types/translations";

export const translations: Translations = {
  title: "Local branches",
  branchContextMenu: {
    checkout: {
      value: "Checkout ${branch}",
      args: ["branch"]
    },
    rename: {
      value: "Rename ${branch}",
      args: ["branch"]
    },
    delete: {
      value: "Delete ${branch}",
      args: ["branch"]
    },
    focus: {
      value: "Focus ${branch}",
      args: ["branch"]
    },
    addToFocus: {
      value: "Add ${branch} to focus",
      args: ["branch"]
    },
    unfocus: {
      value: "Remove ${branch} from focus",
      args: ["branch"]
    }
  },
  renameDialog: {
    title: {
      value: "Rename ${branch}",
      args: ["branch"]
    },
    message: {
      value: "What would you like ${branch} to be called?",
      args: ["branch"]
    }
  },
  unableToCheckOutToast: {
    title: "Error",
    message: {
      value: "Unable to checkout the branch: ${branch}",
      args: ["branch"]
    }
  },
  unableToRenameToast: {
    title: "Error",
    message: {
      value: "Unable to rename the branch: ${branch}",
      args: ["branch"]
    }
  },
  unableToDeleteToast: {
    title: "Error",
    message: {
      value: "Unable to delete the branch: ${branch}",
      args: ["branch"]
    }
  }
};
