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
 * - implementare getPrice;
 */

import {
  ConditionCode,
  PlatformCode,
  RegionCode,
} from '@/app/generated/prisma/enums'
import prisma from '@/app/lib/database/prisma'
import { manageGamePrice } from '@/app/lib/utils/manage-game-price'
import EbayAuthToken from 'ebay-oauth-nodejs-client'
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
const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET
const EBAY_ENDPOINT = process.env.EBAY_ENDPOINT

const platformFromSearchKey = new Set([
  'gb',
  'gba',
  'nes',
  'snes',
  'sms',
  'smd',
])

const platformMap = new Map<string, string>()
  .set('gb', 'Game Boy')
  .set('gba', 'Game Boy Advance')
  .set('nes', 'Nintendo Entertainment System')
  .set('snes', 'Super Nintendo Entertainment System')
  .set('sms', 'Sega Master System')
  .set('smd', 'Sega Mega Drive')

const gameConditionsFromSearchKey = new Set(['loose', 'cib', 'sealed'])

const gameRegionsFromSearchKey = new Set(['pal', 'ntsc', 'jap'])

const excludeWordsFromSearchKey = new Set([
  ...gameRegionsFromSearchKey,
  ...gameConditionsFromSearchKey,
  ...platformFromSearchKey,
])

let cachedTwitchToken: TokenResponse
let cachedEbayToken: TokenResponse
let expiryTwitchTokenTimestamp: number
let expiryEbayTokenTimestamp: number

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

    if (!cachedEbayToken || Date.now() > expiryEbayTokenTimestamp) {
      const ebayAuthToken = new EbayAuthToken({
        clientId: EBAY_CLIENT_ID!,
        clientSecret: EBAY_CLIENT_SECRET!,
        redirectUri: '/api/game/retrieve-info',
      })

      const token = await ebayAuthToken.getApplicationToken('PRODUCTION')
      cachedEbayToken = JSON.parse(token) as TokenResponse
      expiryEbayTokenTimestamp = Date.now() + cachedEbayToken.expires_in * 1000
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
    const gamesPerBatch = 5
    const delayMs = 500

    for (let i = 0; i < searchDemands.length; i += gamesPerBatch) {
      const batch = searchDemands
        .slice(i, i + gamesPerBatch)
        .filter((s) => s.count7d >= 10)

      await Promise.all(
        batch.map(({ searchKey, id }) => getGameInfoAndPrice(searchKey, id)),
      )

      // Delay tra ogni chiamata
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
      message: 'OK',
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

  const request = ` fields name,rating,cover,first_release_date,summary;
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
    getGamePrice(normalizedTitle, platformCode, regionCode, conditionCode),
  ])

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
          rate: gameData[0].rating,
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

      if (price.status === 'fulfilled') {
        await tx.priceSnapshot.create({
          data: {
            gameVariantId: gameVariant.id,
            source: 'ebay',
            price: price.value.median,
            // currency: regionCode === 'PAL' ? 'EUR' : 'USD'
            lastUpdate: new Date(),
          },
        })
      }

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

async function getGamePrice(
  normalizedTitle: string,
  platformCode: PlatformCode,
  regionCode: RegionCode,
  conditionCode: ConditionCode,
): Promise<{ median: number; count: number; outliers: number }> {
  const marketplace = getMarketplaceByRegion(regionCode)
  const platform = platformMap.get(platformCode.toLowerCase()) || ''

  // Simplified query: only title + platform (no region/condition terms)
  const searchQuery =
    `${normalizedTitle.replaceAll('-', ' ')} ${platform}`.trim()
  const encodedQuery = encodeURIComponent(searchQuery)

  console.log(
    `[getGamePrice] Search: "${searchQuery}" on ${marketplace} for ${conditionCode}`,
  )

  const marketplaceEndpoint = 'buy/browse/v1/item_summary/search'
  // categoryIds=139973 is "Video Games & Consoles > Video Games"
  const filters = 'buyingOptions:{FIXED_PRICE},categoryIds:{139973}'

  try {
    const marketplaceResponse = await fetch(
      `${EBAY_ENDPOINT}/${marketplaceEndpoint}?q=${encodedQuery}&limit=150&filter=${filters}`,
      {
        headers: {
          Authorization: `Bearer ${cachedEbayToken.access_token}`,
          'X-EBAY-C-MARKETPLACE-ID': marketplace,
        },
      },
    )
    const items = await marketplaceResponse.json()
    const gamePrice = manageGamePrice(
      items.itemSummaries,
      normalizedTitle,
      conditionCode,
    )
    return gamePrice
  } catch (error) {
    console.error('Error fetching price from eBay!', error)
    throw new Error('There was a problem')
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

function getMarketplaceByRegion(regionCode: RegionCode): string {
  const marketplaceMap: Record<RegionCode, string> = {
    PAL: 'EBAY_GB',
    NTSC: 'EBAY_US',
    JAP: 'EBAY_US',
  }
  return marketplaceMap[regionCode] || 'EBAY_US'
}
