import { Condition, Platform, Region } from '@/app/generated/prisma/client'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import prisma from '../database/prisma'

// Cache() di react -> stesso render diverse richieste
// unstable_cache -> cache persistente dalla durata di 24 ore
export const getAllPlatforms = cache((): Promise<Platform[]> => {
  return unstable_cache(
    async () => {
      return prisma.platform.findMany()
    },
    ['platforms'],
    { revalidate: 86400, tags: ['platforms'] },
  )()
})

export const getAllConditions = cache((): Promise<Condition[]> => {
  return unstable_cache(
    async () => {
      return prisma.condition.findMany()
    },
    ['conditions'],
    { revalidate: 86400, tags: ['conditions'] },
  )()
})

export const getAllRegions = cache((): Promise<Region[]> => {
  return unstable_cache(
    async () => {
      return prisma.region.findMany()
    },
    ['regions'],
    { revalidate: 86400, tags: ['regions'] },
  )()
})

export const getTrendingGameSearches = cache(() => {
  return unstable_cache(
    async () => {
      return prisma.searchDemand.findMany({
        where: { count7d: { gte: 15 } },
        select: {
          rawQuery: true,
        },
      })
    },
    ['trendingSearches'],
    {
      revalidate: 86400,
      tags: ['trendingSearches'],
    },
  )()
})
