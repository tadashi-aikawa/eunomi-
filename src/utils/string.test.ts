import { toEmojiString, trimBracketTime } from './string';

describe.each`
  str                            | expected
  ${'hoge (9:00)'}               | ${'hoge'}
  ${'hoge(9:00)'}                | ${'hoge'}
  ${'hoge (13:35)'}              | ${'hoge'}
  ${'hoge (huga) (13:35)'}       | ${'hoge (huga)'}
  ${'hoge (huga)(13:35)'}        | ${'hoge (huga)'}
  ${'hoge(huga)(13:35)'}         | ${'hoge(huga)'}
  ${'hoge (9:00-)'}              | ${'hoge'}
  ${'hoge (13:35-)'}             | ${'hoge'}
  ${'hoge (huga) (13:35-)'}      | ${'hoge (huga)'}
  ${'hoge (9:00-10:00)'}         | ${'hoge'}
  ${'hoge (13:35-14:30)'}        | ${'hoge'}
  ${'hoge (huga) (13:35-14:30)'} | ${'hoge (huga)'}
`('trimBracketTime', ({ str, expected }) => {
  test(`${str} -> ${expected}`, () => expect(trimBracketTime(str)).toBe(expected));
});

describe.each`
  str                    | expectedPattern
  ${':smile: good :+1:'} | ${/<img .+smile.+\/> good <img .+thumbsup.+\/>/}
`('toEmojiString', ({ str, expectedPattern }: { str: string; expectedPattern: string }) => {
  test(`toEmojiString(${str}) match ${expectedPattern}`, () => {
    expect(toEmojiString(str)).toMatch(expectedPattern);
  });
});
