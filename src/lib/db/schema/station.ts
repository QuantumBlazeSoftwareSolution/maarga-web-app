import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { stationTypeEnum, districtEnum, stationStatusEnum } from './enum';

export const stationTable = pgTable('station', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  longitude: text('longitude').notNull(),
  latitude: text('latitude').notNull(),
  type: stationTypeEnum('type').notNull().default('fuel'),
  district: districtEnum('district'),
  status: stationStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Station = typeof stationTable.$inferSelect;
export type StationInsert = typeof stationTable.$inferInsert;
