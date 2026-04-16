import { integer, pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export interface LocalizedContent {
  en: string;
  si: string;
  ta?: string;
}

export const ruleHandbookTable = pgTable('rule_handbook', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: jsonb('title').$type<LocalizedContent>().notNull(),
  description: jsonb('description').$type<LocalizedContent>().notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type RuleHandbook = typeof ruleHandbookTable.$inferSelect;
export type RuleHandbookInsert = typeof ruleHandbookTable.$inferInsert;
