import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const fcmTokensTable = pgTable('fcm_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: text('auth_id')
    .notNull()
    .references(() => usersTable.authId, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type FcmToken = typeof fcmTokensTable.$inferSelect;
export type FcmTokenInsert = typeof fcmTokensTable.$inferInsert;
