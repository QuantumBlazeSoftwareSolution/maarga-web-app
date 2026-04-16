import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export interface LocalizedContent {
  en: string;
  si: string;
  ta?: string;
}

export const emergencyContactsTable = pgTable('emergency_contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: jsonb('name').$type<LocalizedContent>().notNull(),
  description: jsonb('description').$type<LocalizedContent>().notNull(),
  phone: text('phone').notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type EmergencyContact = typeof emergencyContactsTable.$inferSelect;
export type EmergencyContactInsert = typeof emergencyContactsTable.$inferInsert;
