import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { adminTable } from './admin';

export const authenticationTable = pgTable('authentication', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id')
    .references(() => adminTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  otp: varchar('otp', { length: 6 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Authentication = typeof authenticationTable.$inferSelect;
export type AuthenticationInsert = typeof authenticationTable.$inferInsert;