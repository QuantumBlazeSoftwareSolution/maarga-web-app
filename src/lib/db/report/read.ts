import { and, desc, eq } from 'drizzle-orm';
import { db } from '..';
import { Report, reportsTable } from '../schema/reports';

export async function getStationLastConfirmedReport(
  stationId: string,
): Promise<Report> {
  try {
    const report = await db
      .select()
      .from(reportsTable)
      .where(
        and(
          eq(reportsTable.stationId, stationId),
          eq(reportsTable.status, 'approved'),
        ),
      )
      .orderBy(desc(reportsTable.createdAt))
      .limit(1);

    return report[0];
  } catch (error) {
    return {} as Report;
  }
}
