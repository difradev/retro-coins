import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const platforms = pgTable('platforms', {
  id: integer().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
})
