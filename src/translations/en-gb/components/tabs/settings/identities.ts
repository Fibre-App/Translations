import { Translations } from "../../../../../types/translations";

export const translations: Translations = {
  title: "Identities",
  add: "Add",
  useDeviceFlow: "Use Device Flow",
  revoke: "Revoke",

  github: {
    title: "GitHub"
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
  addedToast: {
    cannotFind: {
      title: "Not Found!",
      message: {
        value: "Could not find the added ${service} account",
        args: ["service"]
      }
    },
    cannotInsert: {
      title: "Not Save!",
      message: {
        value: "Could not save the added ${service} account",
        args: ["service"]
      }
    },
    inserted: {
      title: "Added!",
      message: {
        value: "Added the new ${service} account",
        args: ["service"]
      }
    },
    updated: {
      title: "Updated!",
      message: {
        value: "Updated a ${service} account",
        args: ["service"]
      }
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
