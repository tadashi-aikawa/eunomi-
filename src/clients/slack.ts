import { IncomingWebhook } from '@slack/webhook';

export async function send(webhookUrl: string, message: string) {
  const webhook = new IncomingWebhook(webhookUrl, {
    username: 'Eunomiā',
    icon_emoji: ':eunomia',
  });
  await webhook.send(message);
}
