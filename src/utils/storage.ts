interface Options {
  slackIncomingWebhookUrl: string;
  jiraBrowserUrl: string;
}
const DEFAULT_OPTIONS: Options = {
  slackIncomingWebhookUrl: '',
  jiraBrowserUrl: '',
};

/**
 * Set slack incoming webhook URL to local storage
 * @param slackIncomingWebhookUrl
 * @return isSuccess
 */
export async function setSlackIncomingWebhookUrl(slackIncomingWebhookUrl: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ slackIncomingWebhookUrl }, () => {
      resolve(true);
    });
  });
}

/**
 * Get slack incoming webhook URL from local storage
 * @return Incoming webhook URL
 */
export async function getSlackIncomingWebhookUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_OPTIONS, (options: Options) => {
      resolve(options.slackIncomingWebhookUrl);
    });
  });
}

/**
 * Set Jira browser URL to local storage
 * @param jiraBrowserUrl
 * @return isSuccess
 */
export async function setJiraBrowserUrl(jiraBrowserUrl: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ jiraBrowserUrl }, () => {
      resolve(true);
    });
  });
}

/**
 * Get Jira browser URL from local storage
 * @return Jira browser URL
 */
export async function getJiraBrowserUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_OPTIONS, (options: Options) => {
      resolve(options.jiraBrowserUrl);
    });
  });
}
