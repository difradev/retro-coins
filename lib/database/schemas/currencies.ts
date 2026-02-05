import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const currencies = pgTable('currencies', {
  id: integer().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
})
