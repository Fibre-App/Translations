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
    }
  },
  gitlab: {
    title: "GitLab"
  },
  bitbucket: {
    title: "BitBucket (Atlassian)"
  },
  uiblockDialog: {
    title: "Waiting",
    message: {
      value: "Waiting for you to log into ${service} via your browser",
      args: ["service"]
    }
  },
  revokedToast: {
    title: "Revoked!",
    message: {
      value: "Revoked access to the ${platform} account, ${username}",
      args: ["platform", "username"]
    }
  }
};
