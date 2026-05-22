import { Hono } from 'hono';
import type { OnAppInstallRequest, TriggerResponse } from '@devvit/web/shared';
import { sentinelData } from './globalState';

export const triggers = new Hono();

triggers.post('/on-app-install', async (c) => {
  const input = await c.req.json<OnAppInstallRequest>();
  console.log('🛡️ SentinelMod instalado en r/' + input.subreddit?.name);
  return c.json<TriggerResponse>({ status: 'success' }, 200);
});

triggers.post('/on-mod-action', async (c) => {
  const body = await c.req.json();

  const modName = body.moderator?.name || 'unknown';
  const actionType = body.action || 'unknown';
  const subreddit = body.subreddit?.name || 'unknown';
  const timestamp = new Date().toISOString();
  const hour = new Date().getHours();
  const isLateNight = hour >= 23 || hour <= 5;

  console.log(`🚨 Acción: ${modName} → ${actionType} en r/${subreddit}`);

  const key = `${subreddit}:${modName}`;

  if (!sentinelData[key]) {
    sentinelData[key] = {
      name: modName,
      actionCount: 0,
      lateNightCount: 0,
      lastActive: timestamp,
      lastAction: actionType,
      healthScore: 100,
    };
  }

  sentinelData[key].actionCount += 1;
  sentinelData[key].lastActive = timestamp;
  sentinelData[key].lastAction = actionType;

  if (isLateNight) {
    sentinelData[key].lateNightCount += 1;
    console.log(`🌙 Alerta nocturna: ${modName}`);
  }

  const lateNightPenalty = sentinelData[key].lateNightCount * 10;
  const overworkPenalty = sentinelData[key].actionCount > 50 ? 20 : 0;
  sentinelData[key].healthScore = Math.max(
    0,
    100 - lateNightPenalty - overworkPenalty
  );

  console.log(
    `💾 ${modName} - Acciones: ${sentinelData[key].actionCount} - Salud: ${sentinelData[key].healthScore}%`
  );
  console.log(`🗂️ Total mods en memoria: ${Object.keys(sentinelData).length}`);

  return c.json<TriggerResponse>({ status: 'success' }, 200);
});
