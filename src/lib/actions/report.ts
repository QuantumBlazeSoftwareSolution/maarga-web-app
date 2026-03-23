'use server';

import { getAllReportsWithDetails as dbGetAllReports } from '../db/report/read';

export async function getAllReports() {
  return await dbGetAllReports();
}
