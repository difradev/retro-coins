import {
  ConditionCode,
  PlatformCode,
  RegionCode,
} from '@/app/generated/prisma/enums'
import EbayAuthToken from 'ebay-oauth-nodejs-client'
import { manageGamePrice } from './manage-game-price'

const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET
const EBAY_ENDPOINT = process.env.EBAY_ENDPOINT

type GameInfo = {
  title: string
  regionCode: RegionCode
  platformCode: PlatformCode
  conditionCode: ConditionCode
}

type TokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
}

const platformMap = new Map<string, string>()
  .set('gb', 'Game Boy')
  .set('gba', 'Game Boy Advance')
  .set('nes', 'Nintendo Entertainment System')
  .set('snes', 'Super Nintendo Entertainment System')
  .set('sms', 'Sega Master System')
  .set('smd', 'Sega Mega Drive')

let expiryEbayTokenTimestamp: number
let cachedEbayToken: TokenResponse

export async function getGamePrice({
  title,
  platformCode,
  regionCode,
  conditionCode,
}: GameInfo): Promise<{
  median: number
  count: number
  outliers: number
  minPrice: number
  maxPrice: number
}> {
  try {
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
    console.error('Error while trying to login to Ebay!', error)
  }

  const marketplace = getMarketplaceByRegion(regionCode)
  const platform = platformMap.get(platformCode.toLowerCase()) || ''

  const searchQuery = `${title.replaceAll('-', ' ')} ${platform}`.trim()
  const encodedQuery = encodeURIComponent(searchQuery)

  console.log(
    `[getGamePrice] Search: "${searchQuery}" on ${marketplace} for ${conditionCode}`,
  )

  const marketplaceEndpoint = 'buy/browse/v1/item_summary/search'
  // categoryIds=139973 is "Video Games & Consoles > Video Games"
  const filters = 'buyingOptions:{FIXED_PRICE},categoryIds:{139973}'

  try {
    const marketplaceResponse = await fetch(
      `${EBAY_ENDPOINT}/${marketplaceEndpoint}?q=${encodedQuery}&limit=200&filter=${filters}`,
      {
        headers: {
          Authorization: `Bearer ${cachedEbayToken.access_token}`,
          'X-EBAY-C-MARKETPLACE-ID': marketplace,
        },
      },
    )
    const items = await marketplaceResponse.json()
    return manageGamePrice(items.itemSummaries, title, conditionCode)
  } catch (error) {
    console.error('Error fetching price from eBay!', error)
    throw new Error('There was a problem')
  }
}

function getMarketplaceByRegion(regionCode: RegionCode): string {
  const marketplaceMap: Record<RegionCode, string> = {
    PAL: 'EBAY_GB',
    NTSC: 'EBAY_US',
    JAP: 'EBAY_US',
  }
  return marketplaceMap[regionCode] || 'EBAY_US'
}
