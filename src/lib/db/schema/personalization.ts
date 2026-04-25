import { pgTable, jsonb, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const personalizationTable = pgTable('personalization', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id),
  preferredFuels: jsonb('preferred_fuels').$type<string[]>().notNull().default([]),
  nearbyAlerts: boolean('nearby_alerts').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Personalization = typeof personalizationTable.$inferSelect;
export type PersonalizationInsert = typeof personalizationTable.$inferInsert;

