if (!(global as any).__sentinelData) {
  (global as any).__sentinelData = {};
}

export const sentinelData: Record<
  string,
  {
    name: string;
    actionCount: number;
    lateNightCount: number;
    lastActive: string;
    lastAction: string;
    healthScore: number;
  }
> = (global as any).__sentinelData;
