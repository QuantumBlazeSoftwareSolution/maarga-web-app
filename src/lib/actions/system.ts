'use server';

import os from 'os';

/**
 * Calculates real-time CPU usage by comparing ticks across a 100ms interval.
 */
async function getCpuUsage(): Promise<number> {
  const start = os.cpus();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const end = os.cpus();

  let totalDiff = 0;
  let idleDiff = 0;

  for (let i = 0; i < start.length; i++) {
    const s = start[i].times;
    const e = end[i].times;

    const sTotal = s.user + s.nice + s.sys + s.idle + s.irq;
    const eTotal = e.user + e.nice + e.sys + e.idle + e.irq;

    totalDiff += eTotal - sTotal;
    idleDiff += e.idle - s.idle;
  }

  const usage = 1 - idleDiff / totalDiff;
  return Math.round(usage * 100);
}

export async function getSystemStats() {
  try {
    const cpuPromise = getCpuUsage();

    // Memory calculation
    const totalMem = os.totalmem(); // in bytes
    const freeMem = os.freemem(); // in bytes
    const totalGB = (totalMem / 1024 ** 3).toFixed(1);
    const usedGB = ((totalMem - freeMem) / 1024 ** 3).toFixed(1);
    const memPercentage = Math.round(((totalMem - freeMem) / totalMem) * 100);

    const cpuUsage = await cpuPromise;

    // Mock DB queries for the dashboard visuals (jitter around 1.2k)
    const dbQueries = (1.1 + Math.random() * 0.3).toFixed(1);

    return {
      success: true,
      stats: {
        cpu: cpuUsage,
        memory: memPercentage,
        totalGB,
        usedGB,
        load: Math.round((cpuUsage + memPercentage) / 2),
      },
    };
  } catch (error) {
    console.error('System stats error:', error);
    return { success: false, error: 'Failed to fetch system stats' };
  }
}
