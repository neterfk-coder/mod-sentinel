import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  const input = await c.req.json<OnAppInstallRequest>();
  console.log('SentinelMod instalado en r/' + input.subreddit?.name);
  return c.json<TriggerResponse>({ status: 'success' }, 200);
});

triggers.post('/on-mod-action', async (c) => {
  const body = await c.req.json();
  const modName = body.moderator?.name || 'unknown';
  const actionType = body.action || 'unknown';
  const subreddit = body.subreddit?.name || 'unknown';
  console.log(
    `🚨 SentinelMod: ${modName} hizo ${actionType} en r/${subreddit}`
  );
  return c.json<TriggerResponse>({ status: 'success' }, 200);
});
