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

  if (!searchQuery) {
    return {
      success: false,
      error: 'Missing required parameters',
      errorCode: ErrorSearchGamesEnum.MissingRequiredParameters,
    }
  }

  let condition = null
  let region = null
  let platform = null
  let slug = null
  try {
    // Retrieve platforms from database!
    const platformsAvailable = await prisma.platform.findMany({
      select: {
        code: true,
      },
    })
    // Get platformCode from searchKey using platforms available.
    platform = getPlatformCode(
      searchQuery,
      new Set(platformsAvailable.map((p) => p.code.toLocaleLowerCase())),
    )
    // Get slug from searchKey.
    slug = getSlugFromSearchQuery(
      searchQuery,
      new Set(platformsAvailable.map((p) => p.code.toLocaleLowerCase())),
    )
    // Get first available region from database
    region = await prisma.gameVariant.findFirst({
      where: {
        AND: [{ game: { slug } }],
      },
      select: { region: true },
    })
  } catch (error) {
    console.error(
      'Problem while retrieve info from database (first condition and first region)',
      error,
    )
    return {
      success: false,
      error: 'Search Demand error!',
      errorCode: ErrorSearchGamesEnum.GeneralError,
    }
  }

  if (!region || !slug || !platform) {
    return {
      success: false,
      error: 'Search Demand error!',
      errorCode: ErrorSearchGamesEnum.GeneralError,
    }
  }

  const game = await prisma.gameVariant.findFirst({
    where: {
      AND: [
        { game: { slug } },
        { condition: { code: 'CIB' } }, // CIB di default
        { platform: { code: platform } },
        { region: { code: region.region.code } },
      ],
    },
    select: { id: true },
  })

  try {
    const rawQuery = searchQuery.replaceAll('-', ' ')
    await prisma.searchDemand.upsert({
      where: {
        searchKey: `${searchQuery}`,
      },
      update: { count7d: { increment: 1 } },
      create: {
        searchKey: `${searchQuery}`,
        count7d: 1,
        rawQuery: `${rawQuery}`,
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
