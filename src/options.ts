import { find } from './utils/dom';
import {
  setSlackIncomingWebhookUrl,
  getSlackIncomingWebhookUrl,
  setJiraBrowserUrl,
  getJiraBrowserUrl,
} from './utils/storage';

const saveButton = find('save');
const slackIncomingWebhookInput = find<HTMLInputElement>('slack-incoming-webhook-url');
const jiraBrowserUrlInput = find<HTMLInputElement>('jira-browser-url');

async function saveOptions() {
  await setSlackIncomingWebhookUrl(slackIncomingWebhookInput.value);
  await setJiraBrowserUrl(jiraBrowserUrlInput.value);
}

async function restoreOptions() {
  slackIncomingWebhookInput.value = await getSlackIncomingWebhookUrl();
  jiraBrowserUrlInput.value = await getJiraBrowserUrl();
}

saveButton.addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
