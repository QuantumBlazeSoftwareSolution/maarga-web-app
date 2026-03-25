import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './users';
import { reportStatusEnum } from './enum';

export const newStationReportsTable = pgTable('new_station_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  status: reportStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export type NewStationReport = typeof newStationReportsTable.$inferSelect;
export type NewStationReportInsert = typeof newStationReportsTable.$inferInsert;