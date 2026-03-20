import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { stationTable } from './station';
import { availabilityEnum } from './enum';
import { itemsTable } from './items';

export const stationItemsTable = pgTable('station_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: uuid('item_id')
    .references(() => itemsTable.id, { onDelete: 'cascade' })
    .notNull(),
  stationId: uuid('station_id')
    .references(() => stationTable.id, { onDelete: 'cascade' })
    .notNull(),
  availability: availabilityEnum('availability').notNull().default('out'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type StationItem = typeof stationItemsTable.$inferSelect;
export type StationItemInsert = typeof stationItemsTable.$inferInsert;
