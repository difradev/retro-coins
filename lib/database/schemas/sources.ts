import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const sources = pgTable('sources', {
  id: integer().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
})
