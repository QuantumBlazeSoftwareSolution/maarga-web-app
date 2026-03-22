import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { stationTable } from './station';
import { queueEnum, reportStatusEnum } from './enum';
import { usersTable } from './users';

export const reportsTable = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  stationId: uuid('station_id')
    .references(() => stationTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  queue: queueEnum('queue').notNull().default('no_queue'),
  message: text('message'),
  status: reportStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Report = typeof reportsTable.$inferSelect;
export type ReportInsert = typeof reportsTable.$inferInsert;
