import yaml from 'js-yaml';

interface Options {
  slackIncomingWebhookUrl: string;
  jiraBrowserUrl: string;
  todoistApiToken: string;
  togglApiToken: string;
  togglWorkspaceId: string;
  prefixMapping: string;
}
const DEFAULT_OPTIONS: Options = {
  slackIncomingWebhookUrl: '',
  jiraBrowserUrl: '',
  todoistApiToken: '',
  togglApiToken: '',
  togglWorkspaceId: '',
  prefixMapping: '',
};

export interface PrefixMapping {
  client: { [clentId: string]: string };
  project: { [projectId: string]: string };
}

function setExtensionStorage<T>(key: keyof Options, value: T): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(true);
    });
  });
}

function getExtensionStorage(key: keyof Options): Promise<Options[keyof Options]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_OPTIONS, (options: Options) => {
      resolve(options[key]);
    });
  });
}

export const getSlackIncomingWebhookUrl = (): Promise<string> => getExtensionStorage('slackIncomingWebhookUrl');
export const setSlackIncomingWebhookUrl = (value: string): Promise<boolean> =>
  setExtensionStorage('slackIncomingWebhookUrl', value);

export const getJiraBrowserUrl = (): Promise<string> => getExtensionStorage('jiraBrowserUrl');
export const setJiraBrowserUrl = (value: string): Promise<boolean> => setExtensionStorage('jiraBrowserUrl', value);

export const getTodoistApiToken = (): Promise<string> => getExtensionStorage('todoistApiToken');
export const setTodoistApiToken = (value: string): Promise<boolean> => setExtensionStorage('todoistApiToken', value);

export const getTogglApiToken = (): Promise<string> => getExtensionStorage('togglApiToken');
export const setTogglApiToken = (value: string): Promise<boolean> => setExtensionStorage('togglApiToken', value);

export const getTogglWorkspaceId = (): Promise<number> => getExtensionStorage('togglWorkspaceId').then(Number);
export const setTogglWorkspaceId = (value: number): Promise<boolean> =>
  setExtensionStorage('togglWorkspaceId', String(value));

export const getPrefixMapping = (): Promise<string> => getExtensionStorage('prefixMapping');
export const setPrefixMapping = (value: string): Promise<boolean> => setExtensionStorage('prefixMapping', value);
export const parsePrefixMapping = (): Promise<PrefixMapping> =>
  getExtensionStorage('prefixMapping').then(yaml.safeLoad);
