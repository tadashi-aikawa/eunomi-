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

const decorate = async (text: string): Promise<string> => `${appendJiraLink(text, await getJiraBrowserUrl())}`;

const toClientLabel = (): string => {
  const entry = findEntryClient();
  return entry ? `\`👥${trimBracketContents(entry)}\` > ` : '';
};
const toProjectLabel = (): string => {
  const entry = findEntryProject();
  return entry ? `\`📂${trimBracketContents(entry)}\`` : '';
};
const toEntryTitle = async (): Promise<string> => await decorate(findEntryTitle());
const toTimeLabel = (): string => `\`⏱${findCurrentEntryTime()}\``;

const appendJiraLink = (text: string, jiraBrowserUrl: string): string =>
  jiraBrowserUrl ? text.replace(/^([^-]+-[0-9]+) /, `<${jiraBrowserUrl}/$1|$1> `) : text;

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
      slack.send(url, `:tio2: \`取消\` ${await toEntryTitle()}    ${toClientLabel()}${toProjectLabel()}`);
    });

    deleteEntryButtonObserver.disconnect();
  });
  deleteEntryButtonObserver.observe(findTimerContainerElement(), { childList: true, subtree: true });
}

/**
 * 初期化処理
 * @param e
 */
function init(e) {
  console.log('init');
  const timerDiv = findTimerDivElement();
  if (!timerDiv) {
    return;
  }
  const timerButton = findTimerButtonElement();

  const startButton = div(`<i class="fas fa-play-circle fa-3x ebutton ebutton-start"></i>`, 'togowl-button-div');
  startButton.addEventListener('click', () => timerButton.click());
  timerDiv.appendChild(startButton);

  const pauseButton = div(`<i class="fas fa-pause-circle fa-3x ebutton ebutton-pause"></i>`, 'togowl-button-div');
  pauseButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(
      url,
      `:zzz_kirby:\`中断\` ${toTimeLabel()}  ${await toEntryTitle()}    ${toClientLabel()}${toProjectLabel()}`,
    );
    timerButton.click();
  });
  timerDiv.appendChild(pauseButton);

  const interruptButton = div(
    `<i class="fas fa-exclamation-circle fa-3x ebutton ebutton-interrupt"></i>`,
    'togowl-button-div',
  );
  interruptButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    await slack.send(url, `:denwaneko:\`割込発生\`:fukidashi3::doushite:`);
    await slack.send(
      url,
      `　:genbaneko:\`強制中断\` ${toTimeLabel()}  ${await toEntryTitle()}    ${toClientLabel()}${toProjectLabel()}`,
    );
    timerButton.click();
    silentIfStartCount = true;
    await setTimeout(async () => {
      timerButton.click();
      await slack.send(url, `　:genbaneko::fukidashi3:現場は急ぎ対応中！ 報告は後で:yoshi:`);
    }, 2000);
  });
  timerDiv.appendChild(interruptButton);

  const doneButton = div(`<i class="fas fa-check-circle fa-3x ebutton ebutton-done"></i>`, 'togowl-button-div');
  doneButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(
      url,
      `:renne:\`完了\` ${toTimeLabel()}  ${await toEntryTitle()}    ${toClientLabel()}${toProjectLabel()}`,
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
      pauseButton.setAttribute('style', 'display: visible;');
      interruptButton.setAttribute('style', 'display: visible;');
      doneButton.setAttribute('style', 'display: visible;');
      registerDeleteEntryButtonObserver();
    } else {
      startButton.setAttribute('style', 'display: visible;');
      pauseButton.setAttribute('style', 'display: none;');
      interruptButton.setAttribute('style', 'display: none;');
      doneButton.setAttribute('style', 'display: none;');
    }
  };

  // カウント開始時に通知をしないフラグ
  let silentIfStartCount = false;

  /**
   * カウント開始/停止の状態変わり目
   */
  const onStatusUpdated = async () => {
    if (isCounting()) {
      if (!silentIfStartCount) {
        const url = await getSlackIncomingWebhookUrl();
        slack.send(url, `:tio:\`開始\`  ${await toEntryTitle()}    ${toClientLabel()}${toProjectLabel()}`);
      }
      silentIfStartCount = false;
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
