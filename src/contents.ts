import * as slack from './clients/slack';
import {
  findEntryClient,
  findTimerButtonElement,
  findTimerDivElement,
  isCounting,
  findCurrentEntryTime,
  findDeleteEntryButtonElement,
  findTimerContainerElement,
  findEntryProject,
  findEntryTitleElement,
  findEntryTitle,
} from './clients/togglUi';
import { div } from './utils/dom';
import { getSlackIncomingWebhookUrl, getJiraBrowserUrl } from './utils/storage';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';

class Notifier {
  static async notify(
    builder: (title: string, client: string, project: string, time: string) => string,
  ): Promise<void> {
    this.notifyToSlack(builder(await this.decorate(this.title()), this.client(), this.project(), this.time()));
  }

  private static trimBracketContents = (text: string): string => text.replace(/\(.+\)/, '');

  private static title = (): string => {
    return findEntryTitle();
  };
  private static client = (): string => {
    const client = findEntryClient();
    return client ? `\`👥${Notifier.trimBracketContents(client)}\` > ` : '';
  };
  private static project = (): string => {
    const project = findEntryProject();
    return project ? `\`📂${Notifier.trimBracketContents(project)}\`` : '';
  };
  private static time = (): string => `\`⏱${findCurrentEntryTime()}\``;

  private static decorate = async (text: string): Promise<string> =>
    `${Notifier.appendJiraLink(text, await getJiraBrowserUrl())}`;

  private static async notifyToSlack(message: string) {
    slack.send(await getSlackIncomingWebhookUrl(), message);
  }
  private static appendJiraLink(text: string, jiraBrowserUrl: string): string {
    return jiraBrowserUrl ? text.replace(/^([^-]+-[0-9]+) /, `<${jiraBrowserUrl}/$1|$1> `) : text;
  }
}

class TimerContents {
  // timer: string;
  // title: string;
  // client: string;
  // project: string;

  timerDiv: HTMLDivElement;

  // TogglのSTART/STOPボタン. Togowlでは不可視
  togglTimerButton: HTMLButtonElement;
  togglDeleteButton: HTMLButtonElement;
  togglTitleInput: HTMLInputElement;

  startButton: HTMLDivElement;
  pauseButton: HTMLDivElement;
  interruptButton: HTMLDivElement;
  doneButton: HTMLDivElement;
  deleteButton: HTMLDivElement;

  timerButtonObserver: MutationObserver;
  titleInputObserver: MutationObserver;

  /**
   * インスタンス生成の準備ができているかどうか
   */
  static readyToCreate(): boolean {
    return !!findTimerDivElement();
  }

  static create(): TimerContents {
    const ins = new TimerContents();

    ins.timerDiv = findTimerDivElement();

    ins.togglTimerButton = findTimerButtonElement();
    ins.togglTitleInput = findEntryTitleElement();

    ins.startButton = this.createStartButton();
    ins.pauseButton = this.createPauseButton();
    ins.interruptButton = this.createInterruptButton();
    ins.doneButton = this.createDoneButton();
    ins.deleteButton = this.createDeleteButton();

    ins.initLayout();

    ins.togglTimerButton.setAttribute('style', 'display: none;');

    return ins;
  }

  private initLayout() {
    this.timerDiv.appendChild(this.startButton);
    this.timerDiv.appendChild(this.pauseButton);
    this.timerDiv.appendChild(this.interruptButton);
    this.timerDiv.appendChild(this.doneButton);
    this.timerDiv.appendChild(this.deleteButton);
  }

  updateVisibility() {
    if (isCounting()) {
      this.startButton.setAttribute('style', 'display: none;');
      this.pauseButton.setAttribute('style', 'display: visible;');
      this.interruptButton.setAttribute('style', 'display: visible;');
      this.doneButton.setAttribute('style', 'display: visible;');
      this.deleteButton.setAttribute('style', 'display: visible;');
    } else {
      this.startButton.setAttribute('style', 'display: visible;');
      this.pauseButton.setAttribute('style', 'display: none;');
      this.interruptButton.setAttribute('style', 'display: none;');
      this.doneButton.setAttribute('style', 'display: none;');
      this.deleteButton.setAttribute('style', 'display: none;');
    }
  }

  // TODO:
  // updateEnablity() {
  //   if (this.isTitleEmpty()) {
  //     this.pauseButton.setAttribute('style', 'disable: true;');
  //     this.interruptButton.setAttribute('style', 'disable: true;');
  //     this.doneButton.setAttribute('style', 'disable: true;');
  //   } else {
  //     this.pauseButton.setAttribute('style', 'disable: false;');
  //     this.interruptButton.setAttribute('style', 'disable: false;');
  //     this.doneButton.setAttribute('style', 'disable: false;');
  //   }
  // }

  isTitleEmpty(): boolean {
    return !this.togglTitleInput.getAttribute('value');
  }

  deleteEntry() {
    findDeleteEntryButtonElement().click();
  }

  setOnClickStartButtonListener(callback: (self: this) => void): this {
    if (this.startButton) {
      this.startButton.addEventListener('click', () => callback(this));
    }
    return this;
  }

  setOnClickPauseButtonListener(callback: (self: this) => void): this {
    if (this.pauseButton) {
      this.pauseButton.addEventListener('click', () => callback(this));
    }
    return this;
  }

  setOnClickInterruptButtonListener(callback: (self: this) => void): this {
    if (this.interruptButton) {
      this.interruptButton.addEventListener('click', () => callback(this));
    }
    return this;
  }

  setOnClickDoneButtonListener(callback: (self: this) => void): this {
    if (this.doneButton) {
      this.doneButton.addEventListener('click', () => callback(this));
    }
    return this;
  }

  setOnClickDeleteButtonListener(callback: (self: this) => void): this {
    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', () => callback(this));
    }
    return this;
  }

  setUpdateStatusListener(callback: (self: this) => void): this {
    this.timerButtonObserver = new MutationObserver(() => callback(this));
    this.timerButtonObserver.observe(findTimerButtonElement(), { attributes: true });
    return this;
  }

  setUpdateTitleListener(callback: (self: this) => void): this {
    this.titleInputObserver = new MutationObserver(() => callback(this));
    this.titleInputObserver.observe(this.togglTitleInput, { attributes: true });
    return this;
  }

  private static createStartButton(): HTMLDivElement {
    return div(`<i class="fas fa-play-circle fa-3x ebutton ebutton-start"></i>`, 'togowl-button-div');
  }

  private static createPauseButton(): HTMLDivElement {
    return div(`<i class="fas fa-pause-circle fa-3x ebutton ebutton-pause"></i>`, 'togowl-button-div');
  }

  private static createInterruptButton(): HTMLDivElement {
    return div(`<i class="fas fa-exclamation-circle fa-3x ebutton ebutton-interrupt"></i>`, 'togowl-button-div');
  }
  private static createDoneButton(): HTMLDivElement {
    return div(`<i class="fas fa-check-circle fa-3x ebutton ebutton-done"></i>`, 'togowl-button-div');
  }
  private static createDeleteButton(): HTMLDivElement {
    return div(`<i class="fas fa-trash fa-2x ebutton ebutton-delete"></i>`, 'togowl-button-div');
  }
}

/**
 * 初期化処理
 * @param e
 */
function init(e) {
  if (!TimerContents.readyToCreate()) {
    return;
  }
  initObserver.disconnect();

  const contents = TimerContents.create()
    .setOnClickStartButtonListener(s => s.togglTimerButton.click())
    .setOnClickPauseButtonListener(async s => {
      await Notifier.notify(
        (title, client, project, time) => `:zzz_kirby: \`中断\` ${time}  ${title}    ${client}${project}`,
      );
      s.togglTimerButton.click();
    })
    .setOnClickInterruptButtonListener(async s => {
      await Notifier.notify((title, client, project, time) => `:denwaneko: \`割込発生\`:fukidashi3::doushite:`);

      s.togglTimerButton.click();

      await Notifier.notify(
        (title, client, project, time) => `　:genbaneko: \`強制中断\` ${time}  ${title}    ${client}${project}`,
      );

      setTimeout(() => s.togglTimerButton.click(), 1000);
    })
    .setOnClickDoneButtonListener(async s => {
      await Notifier.notify(
        (title, client, project, time) => `:renne: \`完了\` ${time}  ${title}    ${client}${project}`,
      );
      s.togglTimerButton.click();
    })
    .setOnClickDeleteButtonListener(async s => {
      await Notifier.notify(
        (title, client, project, time) =>
          `:hyakutake_satori: \`やっぱナシで\` ${time}  ${title}    ${client}${project}`,
      );
      s.deleteEntry();
    })
    .setUpdateStatusListener(async s => {
      s.updateVisibility();
      if (isCounting() && !s.isTitleEmpty()) {
        await Notifier.notify((title, client, project, time) => `:tio2: \`開始\`  ${title}    ${client}${project}`);
      }
    })
    .setUpdateTitleListener(async s => {
      // TODO:
      // s.updateEnablity();
    });

  contents.updateVisibility();
}

const initObserver = new MutationObserver(init);
initObserver.observe(document.body, { childList: true });
