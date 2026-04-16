'use server';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../';
import { Station, stationTable } from '../schema/station';
import { stationItemsTable } from '../schema/station-items';
import { itemsTable } from '../schema/items';
import { reportsTable } from '../schema/reports';

export async function getStations(): Promise<Station[]> {
  try {
    const stations = await db.select().from(stationTable);
    return stations;
  } catch (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────
export type StationItemEnriched = {
  id: string;
  itemId: string;
  itemName: string;
  itemType: string;
  availability: string;
};

export type LastReportEnriched = {
  id: string;
  queue: string;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
} | null;

export type EnrichedStation = Station & {
  items: StationItemEnriched[];
  lastReport: LastReportEnriched;
};

// ─── Bulk enriched query ────────────────────────────────────────────────────
// Uses two single bulk queries (no N+1) and joins in TypeScript:
//   1. LEFT JOIN station_items + items → all availability data for all stations
//   2. Subquery using DISTINCT ON → one latest approved report per station
export async function getStationsEnriched(filters?: {
  district?: string;
  itemId?: string;
}): Promise<EnrichedStation[]> {
  try {
    // Query 1: Bulk fetch stations with optional filters
    const conditions = [];
    conditions.push(eq(stationTable.status, 'approved'));

    if (filters?.district) {
      conditions.push(eq(stationTable.district, filters.district as any));
    }

    if (filters?.itemId) {
      // Find station IDs that have the requested item
      const stationsWithItem = await db
        .select({ id: stationItemsTable.stationId })
        .from(stationItemsTable)
        .where(eq(stationItemsTable.itemId, filters.itemId));

      const stationIds = stationsWithItem.map((s) => s.id);

      if (stationIds.length === 0) {
        return []; // No stations found with this item
      }

      conditions.push(inArray(stationTable.id, stationIds));
    }

    const stations = await db
      .select()
      .from(stationTable)
      .where(and(...conditions));
    if (stations.length === 0) return [];

    const stationIds = stations.map((s) => s.id);

    // Query 2: Bulk fetch station items for THESE stations only
    const allItems = await db
      .select({
        stationId: stationItemsTable.stationId,
        id: stationItemsTable.id,
        itemId: stationItemsTable.itemId,
        itemName: itemsTable.name,
        itemType: itemsTable.itemType,
        availability: stationItemsTable.availability,
      })
      .from(stationItemsTable)
      .leftJoin(itemsTable, eq(stationItemsTable.itemId, itemsTable.id))
      .where(inArray(stationItemsTable.stationId, stationIds));

    // Query 3: Bulk fetch the latest approved report for THESE stations only
    // We fetch all approved reports ordered by desc, then deduplicate in TS
    const allReports = await db
      .select({
        id: reportsTable.id,
        stationId: reportsTable.stationId,
        queue: reportsTable.queue,
        message: reportsTable.message,
        status: reportsTable.status,
        createdAt: reportsTable.createdAt,
        updatedAt: reportsTable.updatedAt,
      })
      .from(reportsTable)
      .where(
        and(
          eq(reportsTable.status, 'approved'),
          inArray(reportsTable.stationId, stationIds),
        ),
      )
      .orderBy(desc(reportsTable.updatedAt));

    // Build lookup maps for fast O(1) access
    const itemsByStation = new Map<string, StationItemEnriched[]>();
    for (const item of allItems) {
      const list = itemsByStation.get(item.stationId) ?? [];
      list.push({
        id: item.id,
        itemId: item.itemId,
        itemName: item.itemName ?? 'Unknown',
        itemType: item.itemType ?? 'fuel',
        availability: item.availability,
      });
      itemsByStation.set(item.stationId, list);
    }

    // Keep only the FIRST (latest) approved report per station
    const latestReportByStation = new Map<string, LastReportEnriched>();
    for (const report of allReports) {
      if (!latestReportByStation.has(report.stationId)) {
        latestReportByStation.set(report.stationId, {
          id: report.id,
          queue: report.queue,
          message: report.message,
          status: report.status,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
        });
      }
    }

    // Merge into enriched station list
    return stations.map((station) => ({
      ...station,
      items: itemsByStation.get(station.id) ?? [],
      lastReport: latestReportByStation.get(station.id) ?? null,
    }));
  } catch (error) {
    console.error('Error fetching enriched stations:', error);
    return [];
  }
}
