import { integer, pgTable } from 'drizzle-orm/pg-core'
import { currencies } from './currencies'
import { gamesVariant } from './gamesVariant'
import { sources } from './sources'

export const pricesSnapshot = pgTable('pricesSnapshot', {
  id: integer().primaryKey().notNull(),
  variantId: integer()
    .notNull()
    .references(() => gamesVariant.id),
  price: integer().notNull(),
  currency: integer()
    .notNull()
    .references(() => currencies.id),
  source: integer()
    .notNull()
    .references(() => sources.id),
})
