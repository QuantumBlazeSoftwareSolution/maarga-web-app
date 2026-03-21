import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { adminRoleEnum, userStatusEnum } from './enum';

export const adminTable = pgTable('admin', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  status: userStatusEnum('status').notNull().default('pending'),
  role: adminRoleEnum('role').notNull().default('admin'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Admin = typeof adminTable.$inferSelect;
export type AdminInsert = typeof adminTable.$inferInsert;
