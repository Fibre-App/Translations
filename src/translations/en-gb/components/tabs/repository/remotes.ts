import { Translations } from "../../../../../types/translations";

export const translations: Translations = {
  title: "Remotes",
  branchContextMenu: {
    fetch: {
      value: "Fetch ${branch}",
      args: ["branch"]
    }
  },
  unableToFetchToast: {
    title: "Unable to fetch",
    message: {
      value: "Unable to fetch from a remote for the repository ${repository}",
      args: ["repository"]
    }
  },
  fetchSuccessfulToast: {
    title: "Fetched!",
    message: {
      value: "Successfully fetched ${name}",
      args: ["name"]
    }
  }
};
