import joypixels from 'emoji-toolkit';

export const trimBracketContents = (text: string): string => text.replace(/\(.+\)/, '');
export const trimBracketTime = (text: string): string =>
  text.replace(/ *\([0-9]{1,2}:[0-9]{2}-?([0-9]{1,2}:[0-9]{2})?\) */, '');
export const trimPrefixEmoji = (text: string): string => text.replace(/^ *:[^:]+: */, '');

export const toEmojiString: (text: string) => string = joypixels.shortnameToImage;
