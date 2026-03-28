import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { supportTopicValueEnum } from './enum';

export const supportTopicTable = pgTable('support_topic', {
  id: uuid('id').defaultRandom().primaryKey(),
  value: supportTopicValueEnum().notNull().default('other'),
  icon: varchar('icon', { length: 255 }).notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SupportTopic = typeof supportTopicTable.$inferSelect;
export type SupportTopicInsert = typeof supportTopicTable.$inferInsert;
