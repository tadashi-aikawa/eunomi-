import { pick } from '../utils/dom';
import { toSeconds } from '../utils/time';

// タイトル
const findTitleElement = (): HTMLTitleElement => pick('html > head > title');

// 実行中エントリのタイトル
const TIME_ENTRY_TITLE_SELECTOR = '.PopdownV2__outside > div > form > input';
export const findEntryTitleElement = (): HTMLInputElement => pick(TIME_ENTRY_TITLE_SELECTOR);
export const findEntryTitle = (): string => findEntryTitleElement().getAttribute('value');

// 実行中エントリのプロジェクト名
const TIME_ENTRY_PROJECT_SELECTOR = '.TimerFormProject__projectName';
export const findEntryProjectElement = (): Element => pick(TIME_ENTRY_PROJECT_SELECTOR);
export const findEntryProject = (): string | null => {
  const elm = findEntryProjectElement();
  return elm ? elm.textContent : null;
};

// 実行中エントリのクライアント名
const TIME_ENTRY_CLIENT_SELECTOR = '.TimerFormProject__client';
export const findEntryClientElement = (): Element => pick(TIME_ENTRY_CLIENT_SELECTOR);
export const findEntryClient = (): string | null => {
  const elm = findEntryClientElement();
  return elm ? elm.textContent : null;
};

// 実行中タイマー
const findTimeDurationElement = (): HTMLSpanElement => pick('.time-format-utils__duration');
export const findCurrentEntryTime = (): string => findTimeDurationElement().textContent;
export const findCurrentEntrySeconds = (): number => toSeconds(findTimeDurationElement().textContent);
// return findTitleElement().textContent.match(/^([^-]+) - .+/)[1];

// 開始/終了ボタン
const TIMER_BUTTON_SELECTOR = 'div[data-dom-element-id="timer-button"]';
export const findTimerButtonElement = (): HTMLButtonElement => pick(TIMER_BUTTON_SELECTOR);
export const isCounting = (): boolean => findTimerButtonElement().getAttribute('title') !== 'Start time entry';

// 削除ボタン
const DELETE_ENTRY_BUTTON_SELECTOR = '.Delete__button';
export const findDeleteEntryButtonElement = (): HTMLButtonElement => pick(DELETE_ENTRY_BUTTON_SELECTOR);

// タイマーボタンがある領域
// const TIMER_DIV_SELECTOR = '.css-y6rqg9';
const TIMER_DIV_SELECTOR = '.TimerFormProject__container + div + div + div';
export const findTimerDivElement = (): HTMLDivElement => pick(TIMER_DIV_SELECTOR);

// タイマーコンテンツほぼ全体
const TIMER_CONTAINER_SELECTOR = '.TimerContainer__timerContainer';
export const findTimerContainerElement = (): HTMLDivElement => pick(TIMER_CONTAINER_SELECTOR);
