import * as slack from './clients/slack';
import {
  findEntryClient,
  findEntryTitle,
  findTimerButtonElement,
  findTimerDivElement,
  isCounting,
  findCurrentEntryTime,
} from './clients/togglUi';
import { div } from './utils/dom';
import { getSlackIncomingWebhookUrl } from './utils/storage';

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

  const setButtonsVisibility = () => {
    if (isCounting()) {
      startButton.setAttribute('style', 'display: none;');
      resumeButton.setAttribute('style', 'display: visible;');
      doneButton.setAttribute('style', 'display: visible;');
    } else {
      startButton.setAttribute('style', 'display: visible;');
      resumeButton.setAttribute('style', 'display: none;');
      doneButton.setAttribute('style', 'display: none;');
    }
  };

  const onStatusUpdated = async () => {
    if (isCounting()) {
      const url = await getSlackIncomingWebhookUrl();
      slack.send(url, `:tio: ${findEntryTitle()} \`🔖${findEntryClient() || ''}\``);
    }
    setButtonsVisibility();
  };

  timerButton.setAttribute('style', 'display: none;');
  setButtonsVisibility();

  // Observerがつく前に変更があると開幕通知がいっがあるとため最後
  const timeButtonObserver = new MutationObserver(onStatusUpdated);
  timeButtonObserver.observe(findTimerButtonElement(), { attributes: true });
}

const initObserver = new MutationObserver(init);
initObserver.observe(document.body, { childList: true });
