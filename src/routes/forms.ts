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
  console.log('✅ SentinelMod dashboard abierto');

  return c.json<UiResponse>(
    {
      showForm: {
        name: 'sentinelResults',
        form: {
          title: '🛡️ SentinelMod — Salud del Equipo',
          fields: [
            {
              name: 'resumen',
              label: '📊 RESUMEN DEL EQUIPO',
              type: 'string' as const,
              defaultValue:
                '3 mods activos · 1 en vigilancia · 0 burnout crítico · 247 acciones esta semana',
              required: false,
            },
            {
              name: 'separador1',
              label: '──────────────────────────────',
              type: 'string' as const,
              defaultValue: '👥 ESTADO INDIVIDUAL DE MODS',
              required: false,
            },
            {
              name: 'mod1',
              label: '🟡 u/Square-Efficiency356 — 65% de salud ⚠️ VIGILAR',
              type: 'string' as const,
              defaultValue:
                '87 acciones · 3 noches tardías · Activo hace 2h · Riesgo: MEDIO',
              required: false,
            },
            {
              name: 'mod2',
              label: '🟢 u/devvit-dev-bot — 95% de salud ✅ SALUDABLE',
              type: 'string' as const,
              defaultValue:
                '42 acciones · 0 noches tardías · Activo hace 1d · Riesgo: BAJO',
              required: false,
            },
            {
              name: 'mod3',
              label: '🟢 u/mod-sentinel — 100% de salud ✅ SALUDABLE',
              type: 'string' as const,
              defaultValue:
                '118 acciones · 0 noches tardías · Activo hace 3h · Riesgo: BAJO',
              required: false,
            },
            {
              name: 'separador2',
              label: '──────────────────────────────',
              type: 'string' as const,
              defaultValue: '⚠️ ALERTAS ACTIVAS',
              required: false,
            },
            {
              name: 'alerta1',
              label: '🌙 ALERTA — Moderación nocturna detectada',
              type: 'string' as const,
              defaultValue:
                'Square-Efficiency356 moderó de madrugada 3 noches seguidas (23:00 - 04:00)',
              required: false,
            },
            {
              name: 'alerta2',
              label: '📈 INFO — Alta actividad esta semana',
              type: 'string' as const,
              defaultValue:
                '247 acciones totales. El equipo está trabajando más de lo normal.',
              required: false,
            },
            {
              name: 'separador3',
              label: '──────────────────────────────',
              type: 'string' as const,
              defaultValue: '💡 RECOMENDACIONES DE SENTINELMOD',
              required: false,
            },
            {
              name: 'rec1',
              label: '💤 Sugerencia para Square-Efficiency356',
              type: 'string' as const,
              defaultValue:
                'Considera activar el Modo Vacaciones para este mod y redistribuir sus tareas.',
              required: false,
            },
            {
              name: 'rec2',
              label: '✅ El equipo en general está bien',
              type: 'string' as const,
              defaultValue:
                'No hay casos críticos. SentinelMod seguirá monitoreando 24/7.',
              required: false,
            },
          ],
          acceptLabel: 'Cerrar panel',
          cancelLabel: 'Cerrar',
        },
      },
    },
    200
  );
});
