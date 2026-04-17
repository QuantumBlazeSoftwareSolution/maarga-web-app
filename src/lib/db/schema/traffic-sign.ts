import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export interface LocalizedContent {
  en: string;
  si: string;
  ta?: string;
}

export const trafficSignTable = pgTable('traffic_sign', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: jsonb('name').$type<LocalizedContent>().notNull(),
  description: jsonb('description').$type<LocalizedContent>().notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type TrafficSign = typeof trafficSignTable.$inferSelect;
export type TrafficSignInsert = typeof trafficSignTable.$inferInsert;
