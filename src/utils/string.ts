export const trimBracketContents = (text: string): string => text.replace(/\(.+\)/, '');
export const trimBracketTime = (text: string): string =>
  text.replace(/ *\([0-9]{1,2}:[0-9]{2}-?([0-9]{1,2}:[0-9]{2})?\) */, '');
