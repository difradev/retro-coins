import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: integer().primaryKey().notNull(),
  title: text().notNull(),
  platform: text().notNull(),
  releaseYear: integer().notNull(),
  image: text(),
  description: text(),
});
