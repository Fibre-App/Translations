import { Translations } from "../../../../../types/translations";

export const translations: Translations = {
  title: "Identities",
  add: "Add",
  useDeviceFlow: "Use Device Flow",
  revoke: "Revoke",
  github: {
    title: "GitHub",
    cannotFind: {
      title: "Not Found!",
      message: "Cannot find the added GitHub account"
    },
    cannotInsert: {
      title: "Not Save!",
      message: "Cannot save the added GitHub account"
    },
    inserted: {
      title: "Added!",
      message: "Added the new GitHub account"
    },
    updated: {
      title: "Updated!",
      message: "Updated a GitHub account"
    },
    revoked: {
      title: "Revoked!",
      message: {
        value: "Revoked access to the GitHub account, ${username}",
        args: ["username"]
      }
    }
  },
  gitlab: {
    title: "GitLab"
  },
  bitbucket: {
    title: "BitBucket (Atlassian)"
  }
};
