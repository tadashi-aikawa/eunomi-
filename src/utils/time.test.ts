import { toJapanese, toSeconds, toJapaneseFromSecond } from './time';

describe.each`
  timeStr       | expected
  ${'00:00:01'} | ${1}
  ${'00:00:59'} | ${59}
  ${'00:01:00'} | ${60}
  ${'00:01:01'} | ${61}
  ${'00:59:59'} | ${3599}
  ${'01:00:00'} | ${3600}
  ${'01:01:01'} | ${3661}
`('toSeconds', ({ timeStr, expected }) => {
  test(`${timeStr} -> ${expected}`, () => expect(toSeconds(timeStr)).toBe(expected));
});

describe.each`
  timeStr       | expected
  ${'00:00:01'} | ${'1秒'}
  ${'00:00:59'} | ${'59秒'}
  ${'00:01:00'} | ${'1分'}
  ${'00:01:01'} | ${'1分'}
  ${'00:59:59'} | ${'59分'}
  ${'01:00:00'} | ${'1時間'}
  ${'01:01:01'} | ${'1時間1分'}
`('toJapanese', ({ timeStr, expected }) => {
  test(`${timeStr} -> ${expected}`, () => expect(toJapanese(timeStr)).toBe(expected));
});

describe.each`
  seconds | expected
  ${1}    | ${'1秒'}
  ${59}   | ${'59秒'}
  ${60}   | ${'1分'}
  ${61}   | ${'1分'}
  ${3599} | ${'59分'}
  ${3600} | ${'1時間'}
  ${3661} | ${'1時間1分'}
`('toJapaneseFromSecond', ({ seconds, expected }) => {
  test(`${seconds} -> ${expected}`, () => expect(toJapaneseFromSecond(seconds)).toBe(expected));
});
