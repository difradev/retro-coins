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
 * TODO
 * ----
 * - Arriva una condizione di default (CIB) e una regione di default (PAL). Bisogna recuperare automaticamente le altre condizioni e le altre regioni
 *   se disponibili.
 * - Capire se implementare la chiamata verso il servizio esterno (THEGAMEDB) per recuperare SOLO le versioni disponibili per un determinato gioco.
 * - Recuperare copertine da thegamedb.
 *
 */

import { ConditionCode, RegionCode } from '@/app/generated/prisma/enums'
import prisma from '@/app/lib/database/prisma'
import { getGamePrice } from '@/app/lib/utils/get-game-price'
import { getGameInfoFromSS } from '@/app/lib/utils/get-game.info'
import { getPlatformCode, normalizeGameTitle } from '@/app/lib/utils/utils'
import { NextResponse } from 'next/server'

const CONDITIONS_AND_REGIONS = [
  { condition: 'CIB', region: 'PAL' },
  { condition: 'SEALED', region: 'PAL' },
  { condition: 'LOOSE', region: 'PAL' },
  { condition: 'CIB', region: 'NTSC' },
  { condition: 'SEALED', region: 'NTSC' },
  { condition: 'LOOSE', region: 'NTSC' },
  { condition: 'CIB', region: 'JAP' },
  { condition: 'SEALED', region: 'JAP' },
  { condition: 'LOOSE', region: 'JAP' },
] as { condition: ConditionCode; region: RegionCode }[]

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
    // Processo 5 giochi alla volta con 1000 ms di ritardo ogni chiamata
    const gamesPerBatch = 5
    const delayMs = 1000

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

  const platformsFromDb = await prisma.platform.findMany({
    select: {
      code: true,
    },
  })
  const normalizedPlatforms = platformsFromDb.map((p) =>
    p.code.toLocaleLowerCase(),
  )
  const platformFromSearchKey = new Set(normalizedPlatforms)

  const normalizedTitle = normalizeGameTitle(title, platformFromSearchKey)
  const platformCode = getPlatformCode(title, platformFromSearchKey)

  console.log(
    `[getGameInfoAndPrice] Parsed - normalized: ${normalizedTitle}, platform: ${platformCode}`,
  )

  const gameInfo = await getGameInfoFromSS(normalizedTitle, platformCode)

  if (!gameInfo) {
    console.warn(
      `[getGameInfoAndPrice] Game not found on IGDB: ${normalizedTitle}`,
    )
    return
  }

  // Destructuring IGDB game object
  const {
    name: gameName,
    cover,
    regions,
    involvedCompanies,
    summary,
    releaseYear,
  } = gameInfo

  // Get game price in small batches to avoid firing all 9 calls at once.
  const gamePrices: PromiseSettledResult<{
    conditionCode: ConditionCode
    regionCode: RegionCode
    price: Awaited<ReturnType<typeof getGamePrice>>
  }>[] = []

  const COMBINATIONS_PER_BATCH = 3
  const COMBINATIONS_DELAY_MS = 300

  const availableCombinations = CONDITIONS_AND_REGIONS.filter((cr) => {
    return regions.includes(cr.region)
  })

  for (
    let i = 0;
    i < availableCombinations.length;
    i += COMBINATIONS_PER_BATCH
  ) {
    const chunk = availableCombinations.slice(i, i + COMBINATIONS_PER_BATCH)

    const chunkResult = await Promise.allSettled(
      chunk.map(async (cr) => {
        return {
          conditionCode: cr.condition,
          regionCode: cr.region,
          price: await getGamePrice({
            title: normalizedTitle,
            platformCode,
            regionCode: cr.region,
            conditionCode: cr.condition,
          }),
        }
      }),
    )

    gamePrices.push(...chunkResult)

    if (i + COMBINATIONS_PER_BATCH < availableCombinations.length) {
      await new Promise((resolve) => setTimeout(resolve, COMBINATIONS_DELAY_MS))
    }
  }

  // Write game only if there is some price!
  if (
    gamePrices.length &&
    gamePrices.every((gp) => gp.status === 'fulfilled') &&
    gamePrices.some((gp) => gp.value.price.count > 0)
  ) {
    await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          title: gameName,
          slug: normalizedTitle,
          firstRelease: releaseYear!,
          image: cover!,
          developedBy: involvedCompanies!,
          description: summary!,
        },
      })

      await Promise.all(
        gamePrices.map(async (gp) => {
          const [platform, condition, region] = await Promise.all([
            tx.platform.findFirst({ where: { code: platformCode } }),
            tx.condition.findFirst({ where: { code: gp.value.conditionCode } }),
            tx.region.findFirst({ where: { code: gp.value.regionCode } }),
          ])

          if (!platform || !condition || !region) {
            throw new Error(
              `Missing references: platform=${!!platform}, condition=${!!condition}, region=${!!region}`,
            )
          }

          const gameVariant = await tx.gameVariant.create({
            data: {
              gameId: game.id!,
              platformId: platform.id,
              conditionId: condition.id,
              regionId: region.id,
            },
          })

          await tx.priceSnapshot.create({
            data: {
              gameVariantId: gameVariant.id,
              source: 'ebay',
              price: gp.value.price.median,
              maxPrice: gp.value.price.maxPrice,
              minPrice: gp.value.price.minPrice,
              itemsCount: gp.value.price.count,
              currency: gp.value.regionCode === 'PAL' ? 'EUR' : 'USD',
              lastUpdate: new Date(),
            },
          })
        }),
      )

      await tx.searchDemand.update({
        where: { id: searchId },
        data: { processed: true },
      })
    })
  }
}
