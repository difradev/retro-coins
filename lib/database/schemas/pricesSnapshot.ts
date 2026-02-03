import { integer, pgEnum, pgTable } from 'drizzle-orm/pg-core'

export const currenciesEnum = pgEnum('currencies', ['EUR', 'USD', 'YEN'])
export const sourcesEnum = pgEnum('sources', ['EUR', 'USD', 'YEN'])

export const pricesSnapshot = pgTable('pricesSnapshot', {
  id: integer().primaryKey().notNull(),
  variantId: integer().notNull(), // TODO: FIXARE CON FOREIGN KEY
  price: integer().notNull(),
  source: sourcesEnum().notNull(),
  currency: currenciesEnum().notNull(),
})
