'use server'

import { redirect } from 'next/navigation'
import { ConditionCode, RegionCode } from '../generated/prisma/client'
import prisma from '../lib/database/prisma'
import { ErrorSearchGamesEnum } from '../lib/enums/ErrorSearchGamesEnum'
import { getPlatformCode, getSlugFromSearchQuery } from '../lib/utils/utils'

type SearchGame = {
  success: boolean
  gameId?: number
  error?: string
  errorCode?: ErrorSearchGamesEnum
}

export async function searchGames(formData: FormData): Promise<SearchGame> {
  const searchQuery = formData.get('search-input') as string
  const selectedCondition = formData.get('condition') as string | null
  const selectedRegion = formData.get('region') as string | null

  if (!searchQuery || !selectedCondition || !selectedRegion) {
    return {
      success: false,
      error: 'Missing required parameters',
      errorCode: ErrorSearchGamesEnum.MissingRequiredParameters,
    }
  }

  const platformsAvailable = await prisma.platform.findMany({
    select: {
      code: true,
    },
  })

  const platform = getPlatformCode(
    searchQuery,
    new Set(platformsAvailable.map((p) => p.code.toLocaleLowerCase())),
  )
  const slug = getSlugFromSearchQuery(
    searchQuery,
    new Set(platformsAvailable.map((p) => p.code.toLocaleLowerCase())),
  )
  const condition = selectedCondition as ConditionCode
  const region = selectedRegion as RegionCode

  const game = await prisma.gameVariant.findFirst({
    where: {
      AND: [
        { game: { slug } },
        { condition: { code: condition } },
        { platform: { code: platform } },
        { region: { code: region } },
      ],
    },
    select: { id: true },
  })

  try {
    const rawQuery = searchQuery.replaceAll('-', ' ')
    await prisma.searchDemand.upsert({
      where: {
        searchKey: `${searchQuery}-${selectedRegion.toLowerCase()}`,
      },
      update: { count7d: { increment: 1 } },
      create: {
        searchKey: `${searchQuery}-${selectedRegion.toLowerCase()}`,
        count7d: 1,
        rawQuery: `${rawQuery} ${selectedRegion}`,
        createdAt: new Date(),
        processed: false,
      },
    })
  } catch (error) {
    console.error('Problem while finding game search demand', error)
    return {
      success: false,
      error: 'Search Demand error!',
      errorCode: ErrorSearchGamesEnum.GeneralError,
    }
  }

  if (!game) {
    return {
      success: false,
      error: 'Game not found!',
      errorCode: ErrorSearchGamesEnum.GameNotFound,
    }
  }

  return redirect(`/game/${game.id}`)
}
