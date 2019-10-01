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
  setPrefixMapping,
  getPrefixMapping,
} from './utils/storage';

const saveButton = find('save');

const slackIncomingWebhookInput = find<HTMLInputElement>('slack-incoming-webhook-url');
const togglApiTokenInput = find<HTMLInputElement>('toggl-api-token');
const togglWorkspaceIdInput = find<HTMLInputElement>('toggl-workspace-id');
const jiraBrowserUrlInput = find<HTMLInputElement>('jira-browser-url');
const prefixMappingArea = find<HTMLTextAreaElement>('prefix-mapping');

async function saveOptions() {
  await setSlackIncomingWebhookUrl(slackIncomingWebhookInput.value);
  await setTogglApiToken(togglApiTokenInput.value);
  await setTogglWorkspaceId(Number(togglWorkspaceIdInput.value));
  await setJiraBrowserUrl(jiraBrowserUrlInput.value);
  await setPrefixMapping(prefixMappingArea.value);
}

async function restoreOptions() {
  slackIncomingWebhookInput.value = await getSlackIncomingWebhookUrl();
  togglApiTokenInput.value = await getTogglApiToken();
  togglWorkspaceIdInput.value = String(await getTogglWorkspaceId());
  jiraBrowserUrlInput.value = await getJiraBrowserUrl();
  prefixMappingArea.value = await getPrefixMapping();
}

saveButton.addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);
