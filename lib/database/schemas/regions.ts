import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const regions = pgTable('regions', {
  id: integer().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
})
