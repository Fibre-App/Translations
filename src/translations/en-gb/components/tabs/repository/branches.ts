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
  }
};
