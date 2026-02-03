import { integer, pgEnum, pgTable } from "drizzle-orm/pg-core";

export const condtionsEnum = pgEnum("conditions", [
  "loose",
  "complete",
  "saled",
]);

export const gamesVariant = pgTable("gamesVariant", {
  id: integer().primaryKey().notNull(),
  gameId: integer().notNull(), // TODO: FIXARE CON FOREIGN KEY
  condition: condtionsEnum().notNull(),
});
