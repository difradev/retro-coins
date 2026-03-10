import prisma from '@/app/lib/database/prisma'
import { getGamePrice } from '@/app/lib/utils/get-game-price'
import { NextResponse } from 'next/server'

type GamePrice = {
  id: number
  median: number
  count: number
  outliers: number
  minPrice: number
  maxPrice: number
}

export async function POST(): Promise<NextResponse<ResponseWrapper<null>>> {
  try {
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10)

    const pricesGameToUpdate = await prisma.priceSnapshot.findMany({
      where: {
        lastUpdate: { lt: tenDaysAgo },
      },
      select: {
        id: true,
        gameVariant: {
          select: {
            game: true,
            condition: true,
            platform: true,
            region: true,
          },
        },
      },
    })

    try {
      // Processo 10 giochi alla volta con 1 secondo di ritardo ogni chiamata
      const gamesPerBatch = 10
      const delayMs = 1000

      for (let i = 0; i < pricesGameToUpdate.length; i += gamesPerBatch) {
        const batch = pricesGameToUpdate.slice(i, i + gamesPerBatch)
        const results = await Promise.allSettled(
          batch.map(async ({ gameVariant, id }) => {
            const title = gameVariant.game.slug
            const platformCode = gameVariant.platform.code
            const regionCode = gameVariant.region.code
            const conditionCode = gameVariant.condition.code
            const gamePrice = await getGamePrice({
              title,
              platformCode,
              regionCode,
              conditionCode,
            })
            return {
              ...gamePrice,
              id,
            }
          }),
        )

        await savePricesToDb(results)

        if (i + 10 < pricesGameToUpdate.length) {
          await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
      }
    } catch (error) {
      console.error('Error fetch price from ebay!', error)
      return NextResponse.json(
        {
          message: 'Error fetch price from ebay!',
        },
        {
          status: 500,
        },
      )
    }

    return NextResponse.json(
      {
        message: `There was updated ${pricesGameToUpdate.length} games`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error checking price!', error)
    return NextResponse.json(
      {
        message: 'There was a problem!',
      },
      {
        status: 500,
      },
    )
  }
}

async function savePricesToDb(
  gamesPrice: PromiseSettledResult<GamePrice>[],
): Promise<void> {
  try {
    for (const gamePrice of gamesPrice) {
      if (gamePrice.status === 'fulfilled') {
        await prisma.priceSnapshot.update({
          where: { id: gamePrice.value.id },
          data: {
            minPrice: gamePrice.value.minPrice,
            price: gamePrice.value.median,
            maxPrice: gamePrice.value.maxPrice,
            lastUpdate: new Date(),
          },
        })
      }
    }
  } catch (error) {
    console.error('There was a problem while saving new game price', error)
    throw error
  }
}
