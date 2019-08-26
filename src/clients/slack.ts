import { IncomingWebhook } from '@slack/webhook';

export async function send(webhookUrl: string, message: string) {
  const webhook = new IncomingWebhook(webhookUrl, {
    username: 'Togowl',
    icon_emoji: ':togowl:',
  });
  await webhook.send(message);
}
