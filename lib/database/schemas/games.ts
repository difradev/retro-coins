import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const games = pgTable('games', {
  id: integer().primaryKey().notNull(),
  title: text().notNull(),
  releaseYear: integer().notNull(),
  image: text(),
  description: text(),
  slug: text().notNull(), // nome-del-gioco
})
