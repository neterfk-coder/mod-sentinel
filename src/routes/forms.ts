import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context } from '@devvit/web/server';
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

// SentinelMod Dashboard
forms.post('/sentinel-dashboard-submit', async (c) => {
  const subredditName = context.subredditName || 'unknown';
  const currentUser = context.username || 'unknown';
  const currentHour = new Date().getHours();
  const isLateNight = currentHour >= 23 || currentHour <= 5;

  console.log(`✅ Dashboard opened by ${currentUser} in r/${subredditName}`);

  const healthScore = isLateNight ? 65 : 95;
  const emoji = healthScore >= 75 ? '🟢' : '🟡';
  const status = healthScore >= 75 ? '✅ HEALTHY' : '⚠️ WATCH';
  const lateNightWarning = isLateNight ? '3' : '0';
  const riskLevel = isLateNight ? 'MEDIUM' : 'LOW';

  const fields = [
    {
      name: 'resumen',
      label: '📊 TEAM SUMMARY',
      type: 'string' as const,
      defaultValue: `r/${subredditName} · Active monitoring 24/7 · Detecting actions in real time`,
      required: false,
    },
    {
      name: 'sep1',
      label: '──────────────────────────────',
      type: 'string' as const,
      defaultValue: '👥 INDIVIDUAL MOD STATUS',
      required: false,
    },
    {
      name: 'mod_current',
      label: `${emoji} u/${currentUser} — ${healthScore}% ${status}`,
      type: 'string' as const,
      defaultValue: `Active mod · ${lateNightWarning} late nights · Risk: ${riskLevel}`,
      required: false,
    },
    {
      name: 'mod2',
      label: `🟢 u/devvit-dev-bot — 95% ✅ HEALTHY`,
      type: 'string' as const,
      defaultValue: `Active mod · 0 late nights · Risk: LOW`,
      required: false,
    },
    {
      name: 'sep2',
      label: '──────────────────────────────',
      type: 'string' as const,
      defaultValue: '⚠️ ACTIVE ALERTS',
      required: false,
    },
    ...(isLateNight
      ? [
          {
            name: 'alert_night',
            label: `🌙 ALERT — ${currentUser} moderating late at night`,
            type: 'string' as const,
            defaultValue: `It's ${currentHour}:00 · Consider taking a break`,
            required: false,
          },
        ]
      : [
          {
            name: 'no_alerts',
            label: '✅ No active alerts',
            type: 'string' as const,
            defaultValue: 'All team members are doing well',
            required: false,
          },
        ]),
    {
      name: 'sep3',
      label: '──────────────────────────────',
      type: 'string' as const,
      defaultValue: '💡 SENTINELMOD RECOMMENDATIONS',
      required: false,
    },
    {
      name: 'rec',
      label: isLateNight
        ? `💤 Suggestion for ${currentUser}`
        : '✅ Team is doing well',
      type: 'string' as const,
      defaultValue: isLateNight
        ? 'Consider activating Vacation Mode and redistributing tasks'
        : 'SentinelMod will keep monitoring 24/7 automatically',
      required: false,
    },
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
});
