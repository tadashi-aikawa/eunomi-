import { IncomingWebhook } from '@slack/webhook';

const WEBHOOK_URL = 'TODO';

export async function send(message: string) {
  const webhook = new IncomingWebhook(WEBHOOK_URL, {
    username: 'Eunomiā',
    icon_emoji: ':eunomia',
  });
  await webhook.send(message);
}
