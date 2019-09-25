import { find } from './utils/dom';
import {
  setSlackIncomingWebhookUrl,
  getSlackIncomingWebhookUrl,
  setJiraBrowserUrl,
  getJiraBrowserUrl,
  setTogglApiToken,
  setTogglWorkspaceId,
  getTogglApiToken,
  getTogglWorkspaceId,
} from './utils/storage';

const saveButton = find('save');
const slackIncomingWebhookInput = find<HTMLInputElement>('slack-incoming-webhook-url');
const togglApiTokenInput = find<HTMLInputElement>('toggl-api-token');
const togglWorkspaceIdInput = find<HTMLInputElement>('toggl-workspace-id');
const jiraBrowserUrlInput = find<HTMLInputElement>('jira-browser-url');

async function saveOptions() {
  await setSlackIncomingWebhookUrl(slackIncomingWebhookInput.value);
  await setJiraBrowserUrl(jiraBrowserUrlInput.value);
  await setTogglApiToken(togglApiTokenInput.value);
  await setTogglWorkspaceId(Number(togglWorkspaceIdInput.value));
}

async function restoreOptions() {
  slackIncomingWebhookInput.value = await getSlackIncomingWebhookUrl();
  jiraBrowserUrlInput.value = await getJiraBrowserUrl();
  togglApiTokenInput.value = await getTogglApiToken();
  togglWorkspaceIdInput.value = String(await getTogglWorkspaceId());
}

saveButton.addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
