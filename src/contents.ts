import * as slack from './clients/slack';
import {
  findEntryClient,
  findEntryTitle,
  findTimerButtonElement,
  findTimerDivElement,
  isCounting,
  findCurrentEntryTime,
  findDeleteEntryButtonElement,
  findTimerContainerElement,
  findEntryProject,
} from './clients/togglUi';
import { div } from './utils/dom';
import { getSlackIncomingWebhookUrl, getJiraBrowserUrl } from './utils/storage';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

const trimBracketContents = (text: string): string => text.replace(/\(.+\)/, '');

const toClientLabel = (): string => {
  const entry = findEntryClient();
  return entry ? `\`👥${trimBracketContents(entry)}\` > ` : '';
};

const toProjectLabel = (): string => {
  const entry = findEntryProject();
  return entry ? `\`📂${trimBracketContents(entry)}\`` : '';
};

const toTimeLabel = (): string => `\`⏱${findCurrentEntryTime()}\``;

const appendJiraLink = (text: string, jiraBrowserUrl: string): string =>
  jiraBrowserUrl ? text.replace(/^([^-]+-[0-9]+) /, `<${jiraBrowserUrl}/$1|$1> `) : text;

const decorate = async (text: string): Promise<string> => `${appendJiraLink(text, await getJiraBrowserUrl())}`;

/**
 * DeleteEntryButtonが出現したら一度だけイベントをセットする
 */
function registerDeleteEntryButtonObserver() {
  const deleteEntryButtonObserver = new MutationObserver(() => {
    const deleteEntryButton = findDeleteEntryButtonElement();
    if (!deleteEntryButton) {
      return;
    }

    deleteEntryButton.addEventListener('click', async () => {
      const url = await getSlackIncomingWebhookUrl();
      slack.send(url, `:tio: :fukidashi1: 無かったことにします`);
    });

    deleteEntryButtonObserver.disconnect();
  });
  deleteEntryButtonObserver.observe(findTimerContainerElement(), { childList: true, subtree: true });
}

function init(e) {
  const timerDiv = findTimerDivElement();
  if (!timerDiv) {
    return;
  }
  const timerButton = findTimerButtonElement();

  const startButton = div(
    `<i class="fas fa-play-circle fa-3x ebutton ebutton-start" id="eumonia-resume-button"></i>`,
    'togowl-button-div',
  );
  startButton.addEventListener('click', () => timerButton.click());
  timerDiv.appendChild(startButton);

  const resumeButton = div(
    `<i class="fas fa-pause-circle fa-3x ebutton ebutton-resume" id="eumonia-resume-button"></i>`,
    'togowl-button-div',
  );
  resumeButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(
      url,
      `　:zzz_kirby:\`中断\` ${toTimeLabel()}  ${await decorate(
        findEntryTitle(),
      )}    ${toClientLabel()}${toProjectLabel()}`,
    );
    timerButton.click();
  });
  timerDiv.appendChild(resumeButton);

  const doneButton = div(
    `<i class="fas fa-check-circle fa-3x ebutton ebutton-done" id="eumonia-done-button"></i>`,
    'togowl-button-div',
  );
  doneButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(
      url,
      `　:renne:\`完了\` ${toTimeLabel()}  ${await decorate(
        findEntryTitle(),
      )}    ${toClientLabel()}${toProjectLabel()}`,
    );
    timerButton.click();
  });
  timerDiv.appendChild(doneButton);

  initObserver.disconnect();

  /**
   * カウント開始/停止の状態で、必ず必要な設定をする
   */
  const setByState = () => {
    if (isCounting()) {
      startButton.setAttribute('style', 'display: none;');
      resumeButton.setAttribute('style', 'display: visible;');
      doneButton.setAttribute('style', 'display: visible;');
      registerDeleteEntryButtonObserver();
    } else {
      startButton.setAttribute('style', 'display: visible;');
      resumeButton.setAttribute('style', 'display: none;');
      doneButton.setAttribute('style', 'display: none;');
    }
  };

  /**
   * カウント開始/停止の状態変わり目
   */
  const onStatusUpdated = async () => {
    if (isCounting()) {
      const url = await getSlackIncomingWebhookUrl();
      slack.send(url, `:tio:\`開始\`  ${await decorate(findEntryTitle())}    ${toClientLabel()}${toProjectLabel()}`);
    }
    setByState();
  };

  timerButton.setAttribute('style', 'display: none;');
  setByState();

  // Observerがつく前に変更があると開幕通知がいっがあるとため最後
  const timeButtonObserver = new MutationObserver(onStatusUpdated);
  timeButtonObserver.observe(findTimerButtonElement(), { attributes: true });
}

const initObserver = new MutationObserver(init);
initObserver.observe(document.body, { childList: true });
