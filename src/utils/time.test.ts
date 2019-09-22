import { toJapanese, toSeconds } from './time';

describe.each`
  timeStr       | expected
  ${'00:00:01'} | ${10}
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
