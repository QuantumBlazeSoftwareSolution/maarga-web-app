'use server';

import { db } from '../';
import { Station, stationTable } from '../schema/station';

export async function getStations(): Promise<Station[]> {
  try {
    const stations = await db.select().from(stationTable);
    return stations;
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}
