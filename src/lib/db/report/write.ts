import { db } from '..';
import { Report, reportsTable } from '../schema/reports';
import { reportItemsTable } from '../schema/reports-items';
import { DBOperationResponse } from '../types';

interface CreateReportResponse extends DBOperationResponse {
  report?: Report;
}

export async function createReport(data: {
  userId: string;
  stationId: string;
  queue: 'no_queue' | 'short' | 'medium' | 'long';
  message?: string | null;
  status: 'pending' | 'approved' | 'suspended';
}): Promise<CreateReportResponse> {
  try {
    const [newReport] = await db
      .insert(reportsTable)
      .values({
        userId: data.userId,
        stationId: data.stationId,
        queue: data.queue,
        message: data.message,
        status: data.status,
      })
      .returning();

    return {
      status: true,
      message: 'Report created successfully.',
      report: newReport,
    };
  } catch (error) {
    console.error('Create report DB error:', error);
    return {
      status: false,
      message: 'Failed to create report.',
    };
  }
}

export async function createReportItems(
  reportId: string,
  items: { itemId: string; availability: 'available' | 'low' | 'out' }[],
): Promise<DBOperationResponse> {
  try {
    await db.insert(reportItemsTable).values(
      items.map((item) => ({
        reportId,
        itemId: item.itemId,
        availability: item.availability,
      })),
    );

    return {
      status: true,
      message: 'Report items created successfully.',
    };
  } catch (error) {
    console.error('Create report items DB error:', error);
    return {
      status: false,
      message: 'Failed to create report items.',
    };
  }
}
