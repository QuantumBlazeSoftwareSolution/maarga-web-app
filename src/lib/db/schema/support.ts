import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { supportTopicTable } from "./support-topic";
import { supportStatusEnum } from "./enum";



export const supportTable = pgTable("support", {
    id: uuid("id").defaultRandom().primaryKey(),
    userID: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
    appID: varchar("app_id", { length: 10 }).notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    topicID: uuid("topic_id").references(() => supportTopicTable.id, { onDelete: "cascade" }).notNull(),
    Message: text("message").notNull(),
    status: supportStatusEnum().notNull().default("pending"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),


})

export type Support = typeof supportTable.$inferSelect;
export type SupportInsert = typeof supportTable.$inferInsert;