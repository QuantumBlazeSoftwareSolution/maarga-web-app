import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { reportsTable } from './reports';
import { itemsTable } from './items';
import { availabilityEnum } from './enum';

export const reportItemsTable = pgTable('report_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  reportId: uuid('report_id')
    .references(() => reportsTable.id, { onDelete: 'cascade' })
    .notNull(),
  itemId: uuid('item_id')
    .references(() => itemsTable.id, { onDelete: 'cascade' })
    .notNull(),
  availability: availabilityEnum('availability').notNull(),
});

export type ReportItem = typeof reportItemsTable.$inferSelect;
export type ReportItemInsert = typeof reportItemsTable.$inferInsert;
