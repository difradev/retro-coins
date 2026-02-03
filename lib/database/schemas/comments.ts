import { pgTable, text } from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  comment: text(),
});
