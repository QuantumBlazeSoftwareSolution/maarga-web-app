import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { itemTypeEnum } from './enum';

export const itemsTable = pgTable('items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  itemType: itemTypeEnum('item_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Item = typeof itemsTable.$inferSelect;
export type ItemInsert = typeof itemsTable.$inferInsert;
