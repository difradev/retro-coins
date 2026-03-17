/**
 * RECUPERA LE INFO E I DATI PER UN GIOCO DA INSERIRE.
 *
 * Questo endpoint si occuperà di recuperare tutte le informazioni di un gioco
 * partendo da IGDB fino ad arrivare al prezzo.
 *
 * Verrà invocato periodicamente da un batch (1 volta ogni due settimane) e andrà a recuperare
 * le informazioni di soli quei giochi che sono stati ricercati, ma non sono disponibili sul database.
 *
 * Protetto da API_SECRET, non potrà mai essere invocato da nessun client se non dal batch di recupero info.
 *
 * TODO:
 * - migliorare tipizzazione;
 * - migliorare gestione degli errori (errori più parlanti);
 * - impostare un logger;
 */

import {
  ConditionCode,
  PlatformCode,
  RegionCode,
} from '@/app/generated/prisma/enums'
import prisma from '@/app/lib/database/prisma'
import { getGamePrice } from '@/app/lib/utils/get-game-price'
import { getGameInfoFromIGDB } from '@/app/lib/utils/get-game.info'
import { NextResponse } from 'next/server'

const platformFromSearchKey = new Set([
  'gb',
  'gba',
  'nes',
  'snes',
  'sms',
  'smd',
])

const gameConditionsFromSearchKey = new Set(['loose', 'cib', 'sealed'])

const gameRegionsFromSearchKey = new Set(['pal', 'ntsc', 'jap'])

const excludeWordsFromSearchKey = new Set([
  ...gameRegionsFromSearchKey,
  ...gameConditionsFromSearchKey,
  ...platformFromSearchKey,
])

let gamesAdded = 0

export async function POST(): Promise<NextResponse<ResponseWrapper<null>>> {
  let searchDemands: { id: number; searchKey: string; count7d: number }[] = []

  try {
    searchDemands = await prisma.searchDemand.findMany({
      select: { id: true, searchKey: true, count7d: true },
      where: { processed: false },
      // take: 1,
    })
  } catch (error) {
    console.error('Error while quering database!', error)
    return NextResponse.json(
      {
        message: 'There was a problem!',
      },
      {
        status: 500,
      },
    )
  }

  try {
    // Processo 5 giochi alla volta con 500 ms di ritardo ogni chiamata
    const gamesPerBatch = 5
    const delayMs = 500

    gamesAdded = searchDemands.filter((s) => s.count7d >= 10).length

    for (let i = 0; i < searchDemands.length; i += gamesPerBatch) {
      const batch = searchDemands
        .slice(i, i + gamesPerBatch)
        .filter((s) => s.count7d >= 10)

      await Promise.all(
        batch.map(({ searchKey, id }) => getGameInfoAndPrice(searchKey, id)),
      )

      if (i + gamesPerBatch < searchDemands.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  } catch (error) {
    console.error('Error getting info from IGDB and game price!', error)
    return NextResponse.json(
      {
        message: 'There was a problem!',
      },
      {
        status: 500,
      },
    )
  }

  return NextResponse.json(
    {
      message: `Was added ${gamesAdded} new games!`,
    },
    {
      status: 200,
    },
  )
}

/**
 * This function will get info and price from external services and save this information into database (will be used only one transaction).
 * Before that operation some informations will normalize.
 * The game info and price will be stored only if there is some price. If the game is already present in database, will be skipped!
 *
 * @param title game title
 * @param searchId id of the searchDemands record
 * @returns
 */
async function getGameInfoAndPrice(
  title: string,
  searchId: number,
): Promise<void> {
  console.log(
    `[getGameInfoAndPrice] Processing: ${title} and searchId ${searchId}`,
  )

  const normalizedTitle = normalizeGameTitle(title)
  const conditionCode = getConditionCode(title)
  const platformCode = getPlatformCode(title)
  const regionCode = getRegionCode(title)

  console.log(
    `[getGameInfoAndPrice] Parsed - normalized: ${normalizedTitle}, platform: ${platformCode}, condition: ${conditionCode}, region: ${regionCode}`,
  )

  const gameAlreadyPresent = await prisma.game.findUnique({
    where: { slug: normalizedTitle },
  })

  if (gameAlreadyPresent) {
    console.log(
      `[getGameInfoAndPrice] Game already present! Skipped: ${normalizedTitle}`,
    )
    return
  }

  const gameData = await getGameInfoFromIGDB(normalizedTitle)

  if (!gameData.length) {
    console.warn(
      `[getGameInfoAndPrice] Game not found on IGDB: ${normalizedTitle}`,
    )
    return
  }

  // Destructuring IGDB game object
  const {
    name: gameName,
    cover,
    first_release_date,
    involved_companies,
    summary,
  } = gameData[0]

  // Get game prices
  const price = await getGamePrice({
    title: normalizedTitle,
    platformCode,
    regionCode,
    conditionCode,
  })

  // Retrieve other conditions from database
  const otherConditions = await prisma.condition.findMany({
    where: { code: { not: conditionCode } },
  })

  // From the original condition searched will be searched other game conditions!
  const otherConditionsPrice = await Promise.allSettled(
    otherConditions.map(async (c) => ({
      conditionId: c.id,
      price: await getGamePrice({
        title: normalizedTitle,
        platformCode,
        regionCode,
        conditionCode: c.code,
      }),
    })),
  )

  // Write game only if there is some price!
  if (price.count > 0) {
    await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          title: gameName,
          slug: normalizedTitle,
          year: new Date(+first_release_date * 1000).getFullYear(),
          image: `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${cover.image_id}.jpg`,
          developedBy: involved_companies.map((i) => i.company).join(', '),
          description: summary,
        },
      })

      const [platform, condition, region] = await Promise.all([
        tx.platform.findFirst({ where: { code: platformCode } }),
        tx.condition.findFirst({ where: { code: conditionCode } }),
        tx.region.findFirst({ where: { code: regionCode } }),
      ])

      if (!platform || !condition || !region) {
        throw new Error(
          `Missing references: platform=${!!platform}, condition=${!!condition}, region=${!!region}`,
        )
      }

      const gameVariant = await tx.gameVariant.create({
        data: {
          gameId: game.id,
          platformId: platform.id,
          conditionId: condition.id,
          regionId: region.id,
        },
      })

      await tx.priceSnapshot.create({
        data: {
          gameVariantId: gameVariant.id,
          source: 'ebay',
          price: price.median,
          maxPrice: price.maxPrice,
          minPrice: price.minPrice,
          itemsCount: price.count,
          currency: regionCode === 'PAL' ? 'EUR' : 'USD',
          lastUpdate: new Date(),
        },
      })

      await Promise.all(
        otherConditionsPrice.map(async (o) => {
          if (o.status === 'fulfilled') {
            const otherGameVariant = await tx.gameVariant.create({
              data: {
                gameId: game.id,
                platformId: platform.id,
                conditionId: o.value.conditionId,
                regionId: region.id,
              },
            })

            await tx.priceSnapshot.create({
              data: {
                gameVariantId: otherGameVariant.id,
                source: 'ebay',
                price: o.value.price.median,
                itemsCount: o.value.price.count,
                maxPrice: o.value.price.maxPrice,
                minPrice: o.value.price.minPrice,
                currency: regionCode === 'PAL' ? 'EUR' : 'USD',
                lastUpdate: new Date(),
              },
            })
          }
        }),
      )

      await tx.searchDemand.update({
        where: { id: searchId },
        data: { processed: true },
      })
    })
  }
}

function normalizeGameTitle(searchKey: string): string {
  return searchKey
    .split('-')
    .filter((s) => !excludeWordsFromSearchKey.has(s))
    .join('-')
}

function getPlatformCode(searchKey: string): PlatformCode {
  return searchKey
    .split('-')
    .filter((s) => platformFromSearchKey.has(s))
    .join('')
    .toUpperCase() as PlatformCode
}

function getConditionCode(searchKey: string): ConditionCode {
  return searchKey
    .split('-')
    .filter((s) => gameConditionsFromSearchKey.has(s))
    .join('')
    .toUpperCase() as ConditionCode
}

function getRegionCode(searchKey: string): RegionCode {
  return searchKey
    .split('-')
    .filter((s) => gameRegionsFromSearchKey.has(s))
    .join('')
    .toUpperCase() as RegionCode
}
