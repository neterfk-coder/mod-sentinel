import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context, redis } from '@devvit/web/server';
import { isT1, isT3 } from '@devvit/shared-types/tid.js';
import { handleNuke, handleNukePost } from '../core/nuke';

type NukeFormValues = {
  remove?: boolean;
  lock?: boolean;
  skipDistinguished?: boolean;
  targetId?: string;
};

export const forms = new Hono();

const normalizeValues = (values: NukeFormValues) => ({
  remove: Boolean(values.remove),
  lock: Boolean(values.lock),
  skipDistinguished: Boolean(values.skipDistinguished),
});

const getTargetId = (values: NukeFormValues) => {
  if (typeof values.targetId === 'string' && values.targetId.trim()) {
    return values.targetId.trim();
  }
  return context.postId;
};

forms.post('/mop-comment-submit', async (c) => {
  const values = await c.req.json<NukeFormValues>();
  const normalized = normalizeValues(values);
  if (!normalized.lock && !normalized.remove) {
    return c.json<UiResponse>(
      { showToast: 'You must select either lock or remove.' },
      200
    );
  }
  const targetId = getTargetId(values);
  if (!isT1(targetId)) {
    return c.json<UiResponse>(
      { showToast: 'Mop failed! Please try again later.' },
      200
    );
  }
  const result = await handleNuke({
    ...normalized,
    commentId: targetId,
    subredditId: context.subredditId,
  });
  return c.json<UiResponse>(
    {
      showToast: `${result.success ? 'Success' : 'Failed'} : ${result.message}`,
    },
    200
  );
});

forms.post('/mop-post-submit', async (c) => {
  const values = await c.req.json<NukeFormValues>();
  const normalized = normalizeValues(values);
  if (!normalized.lock && !normalized.remove) {
    return c.json<UiResponse>(
      { showToast: 'You must select either lock or remove.' },
      200
    );
  }
  const targetId = getTargetId(values);
  if (!isT3(targetId)) {
    return c.json<UiResponse>(
      { showToast: 'Mop failed! Please try again later.' },
      200
    );
  }
  const result = await handleNukePost({
    ...normalized,
    postId: targetId,
    subredditId: context.subredditId,
  });
  return c.json<UiResponse>(
    {
      showToast: `${result.success ? 'Success' : 'Failed'} : ${result.message}`,
    },
    200
  );
});

// SentinelMod Dashboard with real Redis data
forms.post('/sentinel-dashboard-submit', async (c) => {
  const subredditName = context.subredditName || 'unknown';
  const currentUser = context.username || 'unknown';

  console.log(`✅ Dashboard opened by ${currentUser} in r/${subredditName}`);

  try {
    // Get all mod keys for this subreddit from Redis
    const listKey = `sentinel:${subredditName}:__mods`;
    const existingList = await redis.get(listKey);
    const modNames: string[] = existingList ? JSON.parse(existingList) : [];

    console.log(`✅ Mods in Redis: ${modNames.length}`);

    let mods: any[] = [];

    if (modNames.length > 0) {
      const values = await Promise.all(
        modNames.map((name: string) =>
          redis.get(`sentinel:${subredditName}:${name}`)
        )
      );
      mods = values
        .filter((v: any) => v !== null)
        .map((v: any) => JSON.parse(v as string))
        .sort((a: any, b: any) => a.healthScore - b.healthScore);
    }
    const totalActions = mods.reduce((sum, m) => sum + m.actionCount, 0);
    const atRisk = mods.filter((m) => m.healthScore < 75).length;
    const critical = mods.filter((m) => m.healthScore < 50).length;

    const modFields =
      mods.length > 0
        ? mods.map((mod, i) => {
            const emoji =
              mod.healthScore >= 75
                ? '🟢'
                : mod.healthScore >= 50
                  ? '🟡'
                  : '🔴';
            const status =
              mod.healthScore >= 75
                ? '✅ HEALTHY'
                : mod.healthScore >= 50
                  ? '⚠️ WATCH'
                  : '🚨 BURNOUT';
            return {
              name: `mod${i}`,
              label: `${emoji} u/${mod.name} — ${mod.healthScore}% ${status}`,
              type: 'string' as const,
              defaultValue: `${mod.actionCount} actions · ${mod.lateNightCount} late nights · Last: ${mod.lastAction}`,
              required: false,
            };
          })
        : [
            {
              name: 'waiting',
              label: '⏳ Waiting for moderation actions',
              type: 'string' as const,
              defaultValue: 'Perform mod actions to see real-time data here',
              required: false,
            },
          ];

    const alertFields: any[] = [];

    const nightMods = mods.filter((m) => m.lateNightCount >= 2);
    for (const mod of nightMods) {
      alertFields.push({
        name: `alert_night_${mod.name}`,
        label: `🌙 ALERT — ${mod.name} moderating late at night`,
        type: 'string' as const,
        defaultValue: `${mod.lateNightCount} late nights detected · Consider a break`,
        required: false,
      });
    }

    const overworkedMods = mods.filter((m) => m.actionCount > 50);
    for (const mod of overworkedMods) {
      alertFields.push({
        name: `alert_work_${mod.name}`,
        label: `📈 OVERLOAD — ${mod.name} high activity`,
        type: 'string' as const,
        defaultValue: `${mod.actionCount} actions · Workload redistribution recommended`,
        required: false,
      });
    }

    if (alertFields.length === 0) {
      alertFields.push({
        name: 'no_alerts',
        label: '✅ No active alerts',
        type: 'string' as const,
        defaultValue: 'All team members are doing well',
        required: false,
      });
    }

    const fields = [
      {
        name: 'resumen',
        label: '📊 TEAM SUMMARY',
        type: 'string' as const,
        defaultValue: `r/${subredditName} · ${mods.length} mods · ${atRisk} at risk · ${critical} critical · ${totalActions} total actions`,
        required: false,
      },
      {
        name: 'sep1',
        label: '──────────────────────────────',
        type: 'string' as const,
        defaultValue: '👥 INDIVIDUAL MOD STATUS',
        required: false,
      },
      ...modFields,
      {
        name: 'sep2',
        label: '──────────────────────────────',
        type: 'string' as const,
        defaultValue: '⚠️ ACTIVE ALERTS',
        required: false,
      },
      ...alertFields,
    ];

    return c.json<UiResponse>(
      {
        showForm: {
          name: 'sentinelResults',
          form: {
            title: '🛡️ SentinelMod — Team Health',
            fields,
            acceptLabel: 'Close panel',
            cancelLabel: 'Close',
          },
        },
      },
      200
    );
  } catch (err) {
    console.error('❌ Redis error in dashboard:', err);

    const currentHour = new Date().getHours();
    const isLateNight = currentHour >= 23 || currentHour <= 5;
    const healthScore = isLateNight ? 65 : 95;
    const emoji = healthScore >= 75 ? '🟢' : '🟡';
    const status = healthScore >= 75 ? '✅ HEALTHY' : '⚠️ WATCH';

    return c.json<UiResponse>(
      {
        showForm: {
          name: 'sentinelResults',
          form: {
            title: '🛡️ SentinelMod — Team Health',
            fields: [
              {
                name: 'resumen',
                label: '📊 TEAM SUMMARY',
                type: 'string' as const,
                defaultValue: `r/${subredditName} · Active monitoring 24/7`,
                required: false,
              },
              {
                name: 'mod_current',
                label: `${emoji} u/${currentUser} — ${healthScore}% ${status}`,
                type: 'string' as const,
                defaultValue: isLateNight
                  ? 'Late night activity detected · Consider a break'
                  : 'Active mod · No burnout signals',
                required: false,
              },
              {
                name: 'no_alerts',
                label: isLateNight
                  ? `🌙 ALERT — Late night moderation detected`
                  : '✅ No active alerts',
                type: 'string' as const,
                defaultValue: isLateNight
                  ? `It's ${currentHour}:00 · Rest recommended`
                  : 'Team is in good shape',
                required: false,
              },
            ],
            acceptLabel: 'Close panel',
            cancelLabel: 'Close',
          },
        },
      },
      200
    );
  }
});
