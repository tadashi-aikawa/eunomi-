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
} from './clients/togglUi';
import { div } from './utils/dom';
import { getSlackIncomingWebhookUrl } from './utils/storage';

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
    `<button id="eumonia-start-button" class="eunomia-button eunomia-button-start">▶</button>`,
    'eunomia-button-div',
  );
  startButton.addEventListener('click', () => timerButton.click());
  timerDiv.appendChild(startButton);

  const resumeButton = div(
    `<button id="eumonia-resume-button" class="eunomia-button eunomia-button-resume">||</</button>`,
    'eunomia-button-div',
  );
  resumeButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(url, `:zzz_kirby: ${findEntryTitle()} \`⏰${findCurrentEntryTime()}\` \`🔖${findEntryClient() || ''}\``);
    timerButton.click();
  });
  timerDiv.appendChild(resumeButton);

  const doneButton = div(
    `<button id="eumonia-done-button" class="eunomia-button eunomia-button-done">✔</button>`,
    'eunomia-button-div',
  );
  doneButton.addEventListener('click', async () => {
    const url = await getSlackIncomingWebhookUrl();
    slack.send(url, `:completed: ${findEntryTitle()} \`⏰${findCurrentEntryTime()}\` \`🔖${findEntryClient() || ''}\``);
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
      slack.send(url, `:tio: ${findEntryTitle()} \`🔖${findEntryClient() || ''}\``);
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
