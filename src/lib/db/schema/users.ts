import { numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: text('auth_id').unique().notNull(),
  name: text('name'),
  email: text('email').notNull().unique(),
  trustScore: numeric('trust_score', { precision: 10, scale: 2 })
    .notNull()
    .default('0.0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
