import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const stationTable = pgTable('station', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  longitude: text('longitude').notNull(),
  latitude: text('latitude').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Station = typeof stationTable.$inferSelect;
export type StationInsert = typeof stationTable.$inferInsert;
