'use server'

import { redirect } from 'next/navigation'
import { ConditionCode, PlatformCode } from '../generated/prisma/client'
import prisma from '../lib/database/prisma'
import { ErrorSearchGamesEnum } from '../lib/enums/ErrorSearchGamesEnum'

type SearchGame = {
  success: boolean
  gameId?: number
  error?: string
  errorCode?: ErrorSearchGamesEnum
}

export async function searchGames(formData: FormData): Promise<SearchGame> {
  const searchQuery = formData.get('search-input') as string
  const selectedPlatform = formData.get('platform') as string | null
  const selectedCondition = formData.get('condition') as string | null
  const selectedRegion = formData.get('region') as string | null

  if (
    !searchQuery ||
    !selectedPlatform ||
    !selectedCondition ||
    !selectedRegion
  ) {
    return {
      success: false,
      error: 'Missing required parameters',
      errorCode: ErrorSearchGamesEnum.MissingRequiredParameters,
    }
  }

  const platform = selectedPlatform as PlatformCode
  const condition = selectedCondition as ConditionCode

  const game = await prisma.gameVariant.findFirst({
    where: {
      AND: [
        { game: { slug: searchQuery } },
        { condition: { code: condition } },
        { platform: { code: platform } },
      ],
    },
    select: { id: true },
  })

  if (!game) {
    const rawQuery = searchQuery.replaceAll('-', ' ')
    try {
      await prisma.searchDemand.upsert({
        where: {
          searchKey: `${searchQuery}-${selectedPlatform.toLowerCase()}-${selectedRegion.toLowerCase()}-${selectedCondition.toLowerCase()}`,
        },
        update: { count7d: { increment: 1 } },
        create: {
          searchKey: `${searchQuery}-${selectedPlatform.toLowerCase()}-${selectedRegion.toLowerCase()}-${selectedCondition.toLowerCase()}`,
          count7d: 1,
          rawQuery: `${rawQuery} ${selectedPlatform} ${selectedRegion} ${selectedCondition}`,
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
    return {
      success: false,
      error: 'Game not found!',
      errorCode: ErrorSearchGamesEnum.GameNotFound,
    }
  }

  return redirect(`game/${game.id}`)
}
