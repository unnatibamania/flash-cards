import { pgTable, text, uuid, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const sets = pgTable("set", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  is_public: boolean("is_public"),
  is_draft: boolean("is_draft"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: text("user_id").notNull(),
  tags: text("tags").array(),
  is_bookmarked: boolean("is_bookmarked").default(false),
  users_enrolled: text("users_enrolled")
  .array()
  .notNull()
  .$type<Array<{ id: string; profile_picture: string }>>()
  .default([]),
  created_by: jsonb("created_by").$type<{
    id: string;
    profile_picture: string;
    name: string;
  }>(),
  // prompt: text("prompt"),
});
