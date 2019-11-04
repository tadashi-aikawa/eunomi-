export const debug = (message: string, obj?: unknown) => {
  console.debug(`${new Date()}: ${message}`);
  if (obj) {
    console.debug(obj);
  }
};
