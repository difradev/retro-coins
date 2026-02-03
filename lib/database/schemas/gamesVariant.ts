import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'

export const condtionsEnum = pgEnum('conditions', [
  'loose',
  'complete',
  'saled',
])

export const gamesVariant = pgTable('gamesVariant', {
  id: integer().primaryKey().notNull(),
  gameId: integer().notNull(), // TODO: FIXARE CON FOREIGN KEY
  region: text().notNull(),
  condition: condtionsEnum().notNull(),
})
