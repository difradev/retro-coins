import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const gamesDictionary = pgTable('gamesDictionary', {
  id: integer().primaryKey(),
  slug: text().notNull().unique(),
  name: text().notNull(),
})
