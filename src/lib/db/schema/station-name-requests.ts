import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { stationTable } from './station';
import { usersTable } from './users';
import { reportStatusEnum } from './enum';

export const stationNameRequestsTable = pgTable('station_name_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  stationId: uuid('station_id')
    .references(() => stationTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  suggestedName: text('suggested_name').notNull(),
  status: reportStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type StationNameRequest = typeof stationNameRequestsTable.$inferSelect;
export type StationNameRequestInsert = typeof stationNameRequestsTable.$inferInsert;

