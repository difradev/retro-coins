import { integer, pgTable } from 'drizzle-orm/pg-core'
import { conditions } from './conditions'
import { games } from './games'
import { platforms } from './platforms'
import { regions } from './regions'

export const gamesVariant = pgTable('gamesVariant', {
  id: integer().primaryKey(),
  gameId: integer()
    .notNull()
    .references(() => games.id),
  platformId: integer()
    .notNull()
    .references(() => platforms.id),
  conditionId: integer()
    .notNull()
    .references(() => conditions.id),
  regionId: integer()
    .notNull()
    .references(() => regions.id),
})
