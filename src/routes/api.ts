import { Hono } from 'hono';
import { reddit } from '@devvit/web/server';

export const api = new Hono();

api.get('/mod-stats', async (c) => {
  try {
    const subreddit = await reddit.getCurrentSubreddit();

    // Obtener moderadores reales
    const modListing = await subreddit.getModerators();
    const mods = await modListing.all();

    const modList = mods.map((mod: any) => {
      const name = mod.username || mod.name || 'unknown';
      return {
        name,
        actionCount: 0,
        lateNightCount: 0,
        healthScore: 100,
        burnoutRisk: 'low',
      };
    });

    return c.json({ mods: modList });
  } catch (err) {
    console.error('Error obteniendo stats:', err);
    return c.json({ mods: [], totalActions: 0 });
  }
});
