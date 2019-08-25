interface Options {
  slackIncomingWebhookUrl: string;
}
const DEFAULT_OPTIONS: Options = {
  slackIncomingWebhookUrl: '',
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
