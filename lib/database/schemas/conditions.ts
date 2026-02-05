import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const conditions = pgTable('conditions', {
  id: integer().primaryKey(),
  code: text().notNull().unique(),
  name: text().notNull(),
})
