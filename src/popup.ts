import _ from 'lodash';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import * as slack from './clients/slack';
import { fetchDailyReport, ClientReport } from './clients/toggl';
import { find } from './utils/dom';
import { getSlackIncomingWebhookUrl, getTogglApiToken, getTogglWorkspaceId } from './utils/storage';
import { trimBracketContents } from './utils/string';

dayjs.locale('ja');

const toMessage = (reports: ClientReport[], title: string): string =>
  `
  :togowl: *${title}* :togowl:

${_(reports)
  .map(r =>
    `　👥 \`${trimBracketContents(r.client)}\` \`⏱${r.timeAsJapanese}\`
${r.projects.map(x => `　　　\`📂${trimBracketContents(x.projectName)}\` \`⏱${x.timeAsJapanese}\``).join('\n')}
    `.trimRight(),
  )
  .join('\n')}
  `;

async function sendReport(date: dayjs.Dayjs) {
  const message = toMessage(
    await fetchDailyReport(await getTogglApiToken(), await getTogglWorkspaceId(), date.format('YYYY-MM-DD')),
    `${date.format('YYYY年MM月DD日 dddd')} のレポート`,
  );

  slack.send(await getSlackIncomingWebhookUrl(), message);
}

function main() {
  find('send-daily-report-button').addEventListener('click', async () => {
    await sendReport(dayjs());
    window.close();
  });
  find('send-yesterday-report-button').addEventListener('click', async () => {
    sendReport(dayjs().add(-1, 'day'));
    window.close();
  });
}

window.onload = main;
