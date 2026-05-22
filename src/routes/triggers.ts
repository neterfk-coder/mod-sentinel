import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  const input = await c.req.json<OnAppInstallRequest>();
  console.log('🛡️ SentinelMod installed on r/' + input.subreddit?.name);
  return c.json<TriggerResponse>({ status: 'success' }, 200);
});

triggers.post('/on-mod-action', async (c) => {
  const body = await c.req.json();
  const modName = body.moderator?.name || 'unknown';
  const actionType = body.action || 'unknown';
  const subreddit = body.subreddit?.name || 'unknown';
  const hour = new Date().getHours();
  const isLateNight = hour >= 23 || hour <= 5;

  console.log(
    `🚨 Action detected: ${modName} → ${actionType} in r/${subreddit}`
  );

  if (isLateNight) {
    console.log(`🌙 Late night alert: ${modName} is moderating at ${hour}:00`);
  }

  return c.json<TriggerResponse>({ status: 'success' }, 200);
});
