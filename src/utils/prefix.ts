import { PrefixMapping, parsePrefixMapping } from './storage';

let prefixMapping: PrefixMapping = { client: {}, project: {} } as PrefixMapping;
(async function() {
  prefixMapping = await parsePrefixMapping();
})();

export const getClientPrefix = (clientName: string, defaultPrefix: string): string => {
  return prefixMapping.client?.[clientName] ?? defaultPrefix;
};

export const getProjectPrefix = (projectName: string, defaultPrefix: string): string => {
  return prefixMapping.project?.[projectName] ?? defaultPrefix;
};
