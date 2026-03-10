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
import { NextResponse } from 'next/server'

type TokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
}

const TWITCH_OAUTH_URL = process.env.TWITCH_OAUTH_URL
const TWITCH_API_CLIENT_ID = process.env.TWITCH_API_CLIENT_ID
const TWITCH_API_SECRET = process.env.TWITCH_API_SECRET
const IGDB_ENDPOINT = process.env.IGDB_ENDPOINT

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

let cachedTwitchToken: TokenResponse
let expiryTwitchTokenTimestamp: number
let gamesAdded = 0

export async function POST(): Promise<NextResponse<ResponseWrapper<null>>> {
  let searchDemands: { id: number; searchKey: string; count7d: number }[] = []
  try {
    searchDemands = await prisma.searchDemand.findMany({
      select: { id: true, searchKey: true, count7d: true },
      where: { processed: false },
      take: 10,
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
    if (!cachedTwitchToken || Date.now() > expiryTwitchTokenTimestamp) {
      const igdbAuth = await fetch(
        `${TWITCH_OAUTH_URL}?client_id=${TWITCH_API_CLIENT_ID}&client_secret=${TWITCH_API_SECRET}&grant_type=client_credentials`,
        { method: 'POST' },
      )
      const response = (await igdbAuth.json()) as TokenResponse
      cachedTwitchToken = response
      expiryTwitchTokenTimestamp = Date.now() + response.expires_in * 1000
    }
  } catch (error) {
    console.error('Error while trying to login to Twitch!', error)
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
    console.error('Error fetching IGDB!', error)
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

  const request = ` fields name,rating,cover,first_release_date,summary,involved_companies;
                    where slug = "${normalizedTitle}";
                    limit 1;
                  `

  const gameAlreadyPresent = await prisma.game.findUnique({
    where: { slug: normalizedTitle },
  })

  if (gameAlreadyPresent) return

  const searchGameResponse = await fetch(`${IGDB_ENDPOINT}/v4/games`, {
    method: 'POST',
    body: request,
    headers: {
      Accept: 'application/json',
      'Client-ID': TWITCH_API_CLIENT_ID!,
      Authorization: `Bearer ${cachedTwitchToken.access_token}`,
    },
  })

  const gameData = await searchGameResponse.json()

  if (!gameData.length) {
    console.warn(
      `[getGameInfoAndPrice] Game not found on IGDB: ${normalizedTitle}`,
    )
    return
  }

  const [cover, price] = await Promise.allSettled([
    fetchCover(gameData[0]?.cover),
    getGamePrice({
      title: normalizedTitle,
      platformCode,
      regionCode,
      conditionCode,
    }),
  ])

  const otherConditions = await prisma.condition.findMany({
    where: { code: { not: conditionCode } },
  })

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

  if (price.status === 'fulfilled' && price.value.count > 0) {
    // Scrivo sul database solo se ho trovato un prezzo!
    await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          title: gameData[0].name,
          slug: normalizedTitle,
          year: new Date(gameData[0].first_release_date * 1000).getFullYear(),
          image:
            cover.status === 'fulfilled'
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${cover.value[0].image_id}.jpg`
              : '',
          developedBy: '',
          description: gameData[0].summary,
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
          price: price.value.median,
          maxPrice: price.value.maxPrice,
          minPrice: price.value.minPrice,
          itemsCount: price.value.count,
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

async function fetchCover(cover_id: number) {
  const gameCoverResponse = await fetch(`${IGDB_ENDPOINT}/v4/covers`, {
    method: 'POST',
    body: `fields *; where id = ${cover_id};`,
    headers: {
      Accept: 'application/json',
      'Client-ID': TWITCH_API_CLIENT_ID!,
      Authorization: `Bearer ${cachedTwitchToken.access_token}`,
    },
  })
  return gameCoverResponse.json()
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
