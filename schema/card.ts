import { integer, pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";

import { sets } from "./set";

export const cards = pgTable("card", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  tags: text("tags").array(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  user_id: text("user_id").notNull(),
  set_id: uuid("set_id").references(() => sets.id),
  order: integer("order").notNull(),
  is_visited: boolean("is_visited").default(false),
});
