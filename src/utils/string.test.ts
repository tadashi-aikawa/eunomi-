import { trimBracketTime } from './string';

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
