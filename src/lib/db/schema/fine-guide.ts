import { numeric, pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export interface LocalizedContent {
  en: string;
  si: string;
  ta?: string;
}

export const fineGuideTable = pgTable('fine_guide', {
  id: uuid('id').defaultRandom().primaryKey(),
  offense: jsonb('offense').$type<LocalizedContent>().notNull(),
  description: jsonb('description').$type<LocalizedContent>().notNull(),
  fineAmount: numeric('fine_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
  section: text('section'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type FineGuide = typeof fineGuideTable.$inferSelect;
export type FineGuideInsert = typeof fineGuideTable.$inferInsert;
