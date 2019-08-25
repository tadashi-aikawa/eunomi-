import { find } from './utils/dom';
import { setSlackIncomingWebhookUrl, getSlackIncomingWebhookUrl } from './utils/storage';

const saveButton = find('save');
const slackIncomingWebhookInput = find<HTMLInputElement>('slack-incoming-webhook-token');

async function saveOptions() {
  const isSuccess = await setSlackIncomingWebhookUrl(slackIncomingWebhookInput.value);
}

async function restoreOptions() {
  const url = await getSlackIncomingWebhookUrl();
  slackIncomingWebhookInput.value = url;
}

saveButton.addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
