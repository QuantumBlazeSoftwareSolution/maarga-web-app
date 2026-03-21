import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { stationTable } from './station';
import { queueEnum } from './enum';

export const reportsTable = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  stationId: uuid('station_id')
    .references(() => stationTable.id, { onDelete: 'cascade' })
    .notNull(),
  queue: queueEnum('queue').notNull().default('no_queue'),
  message: text('message'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Report = typeof reportsTable.$inferSelect;
export type ReportInsert = typeof reportsTable.$inferInsert;
