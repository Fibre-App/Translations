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
  }
};
