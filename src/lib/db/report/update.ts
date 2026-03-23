import { eq } from 'drizzle-orm';
import { db } from '..';
import { reportsTable } from '../schema/reports';
import { DBOperationResponse } from '../types';

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'approved' | 'suspended',
): Promise<DBOperationResponse> {
  try {
    await db
      .update(reportsTable)
      .set({ status })
      .where(eq(reportsTable.id, reportId));

    return {
      status: true,
      message: 'Report status updated successfully.',
    };
  } catch (error) {
    console.error('Update report status DB error:', error);
    return {
      status: false,
      message: 'Failed to update report status.',
    };
  }
}
