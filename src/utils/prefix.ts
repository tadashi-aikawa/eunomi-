import { PrefixMapping, parsePrefixMapping, EventPrefix } from './storage';

let prefixMapping: PrefixMapping = { event: {}, client: {}, project: {} } as PrefixMapping;
(async function() {
  prefixMapping = await parsePrefixMapping();
})();

export const getEventPrefix = (): EventPrefix => ({
  start: prefixMapping.event?.start ?? ':hourglass_flowing_sand:',
  done: prefixMapping.event?.done ?? ':heavy_check_mark:',
  pause: prefixMapping.event?.pause ?? ':no_entry:',
  interrupt: prefixMapping.event?.interrupt ?? ':astonished:',
  force_stop: prefixMapping.event?.force_stop ?? ':sob:',
  delete: prefixMapping.event?.delete ?? ':wastebasket:',
});

export const getClientPrefix = (clientName: string, defaultPrefix: string): string => {
  return prefixMapping.client?.[clientName] ?? defaultPrefix;
};

export const getProjectPrefix = (projectName: string, defaultPrefix: string): string => {
  return prefixMapping.project?.[projectName] ?? defaultPrefix;
};
