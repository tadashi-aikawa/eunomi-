import yaml from 'js-yaml';

interface Storage {
  slackIncomingWebhookUrl: string;
  jiraBrowserUrl: string;
  todoistApiToken: string;
  todoistIgnoreProjectIds: string;
  togglApiToken: string;
  togglWorkspaceId: string;
  prefixMapping: string;

  currentTodoistTaskId: string;
  currentTodoistTaskName: string;
}
const DEFAULT_STORAGE: Storage = {
  slackIncomingWebhookUrl: '',
  jiraBrowserUrl: '',
  todoistApiToken: '',
  todoistIgnoreProjectIds: '',
  togglApiToken: '',
  togglWorkspaceId: '',
  prefixMapping: '',

  currentTodoistTaskId: '-1',
  currentTodoistTaskName: '',
};

export interface PrefixMapping {
  client: { [clentId: string]: string };
  project: { [projectId: string]: string };
}

function setExtensionStorage<T>(key: keyof Storage, value: T): Promise<boolean> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve(true);
    });
  });
}

function getExtensionStorage(key: keyof Storage): Promise<Storage[keyof Storage]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_STORAGE, (storage: Storage) => {
      resolve(storage[key]);
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

export const getTodoistIgnoreProjectIds = (): Promise<number[]> =>
  getExtensionStorage('todoistIgnoreProjectIds').then(x =>
    x
      .split(',')
      .filter(x => x)
      .map(Number),
  );
export const setTodoistIgnoreProjectIds = (value: number[]): Promise<boolean> =>
  setExtensionStorage('todoistIgnoreProjectIds', value.map(String).join(','));

export const getTogglApiToken = (): Promise<string> => getExtensionStorage('togglApiToken');
export const setTogglApiToken = (value: string): Promise<boolean> => setExtensionStorage('togglApiToken', value);

export const getTogglWorkspaceId = (): Promise<number> => getExtensionStorage('togglWorkspaceId').then(Number);
export const setTogglWorkspaceId = (value: number): Promise<boolean> =>
  setExtensionStorage('togglWorkspaceId', String(value));

export const getCurrentTodoistTaskId = (): Promise<number> => getExtensionStorage('currentTodoistTaskId').then(Number);
export const setCurrentTodoistTaskId = (value: number): Promise<boolean> =>
  setExtensionStorage('currentTodoistTaskId', String(value));

export const getCurrentTodoistTaskName = (): Promise<string> => getExtensionStorage('currentTodoistTaskName');
export const setCurrentTodoistTaskName = (value: string): Promise<boolean> =>
  setExtensionStorage('currentTodoistTaskName', value);

export const getPrefixMapping = (): Promise<string> => getExtensionStorage('prefixMapping');
export const setPrefixMapping = (value: string): Promise<boolean> => setExtensionStorage('prefixMapping', value);
export const parsePrefixMapping = (): Promise<PrefixMapping> =>
  getExtensionStorage('prefixMapping').then(yaml.safeLoad);
