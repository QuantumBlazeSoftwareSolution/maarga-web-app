import { db } from '..';
import {
  NewStationReport,
  newStationReportsTable,
} from '../schema/new-station-reports';

export async function createNewStationReport(data: {
  userId: string;
  latitude: string;
  longitude: string;
}): Promise<NewStationReport> {
  const [newStationReport] = await db
    .insert(newStationReportsTable)
    .values(data)
    .returning();
  return newStationReport;
}
