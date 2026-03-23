import { and, desc, eq, gte, inArray } from 'drizzle-orm';
import { db } from '..';
import { Report, reportsTable } from '../schema/reports';
import { stationTable } from '../schema/station';
import { usersTable } from '../schema/users';
import { reportItemsTable } from '../schema/reports-items';
import { itemsTable } from '../schema/items';

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

export async function getAllReportsWithDetails() {
  try {
    // 1. Fetch main reports joined with station and user
    const reports = await db
      .select({
        id: reportsTable.id,
        stationName: stationTable.name,
        userName: usersTable.name,
        userEmail: usersTable.email,
        queue: reportsTable.queue,
        message: reportsTable.message,
        status: reportsTable.status,
        createdAt: reportsTable.createdAt,
      })
      .from(reportsTable)
      .innerJoin(stationTable, eq(reportsTable.stationId, stationTable.id))
      .innerJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .orderBy(desc(reportsTable.createdAt));

    if (reports.length === 0) return [];

    // 2. Fetch all items for these reports
    const reportIds = reports.map((r) => r.id);
    const allReportItems = await db
      .select({
        reportId: reportItemsTable.reportId,
        itemName: itemsTable.name,
        itemSinhalaName: itemsTable.sinhalaName,
        availability: reportItemsTable.availability,
      })
      .from(reportItemsTable)
      .innerJoin(itemsTable, eq(reportItemsTable.itemId, itemsTable.id))
      .where(inArray(reportItemsTable.reportId, reportIds));

    // 3. Group items into their respective reports
    return reports.map((report) => ({
      ...report,
      items: allReportItems.filter((item) => item.reportId === report.id),
    }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}
export async function getRecentReportsForConsensus(
  stationId: string,
  hours: number,
) {
  try {
    const timeLimit = new Date();
    timeLimit.setHours(timeLimit.getHours() - hours);

    return await db
      .select({
        itemId: reportItemsTable.itemId,
        availability: reportItemsTable.availability,
        trustScore: usersTable.trustScore,
      })
      .from(reportsTable)
      .innerJoin(
        reportItemsTable,
        eq(reportsTable.id, reportItemsTable.reportId),
      )
      .innerJoin(usersTable, eq(reportsTable.userId, usersTable.id))
      .where(
        and(
          eq(reportsTable.stationId, stationId),
          gte(reportsTable.createdAt, timeLimit),
        ),
      );
  } catch (error) {
    console.error('getRecentReportsForConsensus error:', error);
    return [];
  }
}
