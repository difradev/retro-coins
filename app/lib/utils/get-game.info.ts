import { IGDBGame } from '../types/IGDBGame'
import { Jeux, SSGame } from '../types/SSGame'
import { IGDB_REGIONS, SS_PLATFORM_CODE, SS_REGIONS_CODE } from './utils'

const IGDB_ENDPOINT = process.env.IGDB_ENDPOINT
const TWITCH_OAUTH_URL = process.env.TWITCH_OAUTH_URL
const TWITCH_API_CLIENT_ID = process.env.TWITCH_API_CLIENT_ID
const TWITCH_API_SECRET = process.env.TWITCH_API_SECRET

const SCREENSCRAPER_GAME_ENDPOINT = process.env.SCREENSCRAPER_GAME_ENDPOINT

export type GameInfo = {
  name: string
  cover: string | undefined
  releaseYear?: string
  involvedCompanies: string | undefined
  summary: string | undefined
  regions: string[]
}

type TokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
}

let cachedTwitchToken: TokenResponse
let expiryTwitchTokenTimestamp: number

/**
 * Get token from Twitch (if is not already present) and retrieve game info from IGDB.
 * @param title name (slug) of the game
 * @returns IGDB Game Object
 */
export async function getGameInfoFromIGDB(title: string): Promise<GameInfo> {
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
    throw error
  }
  try {
    const request = ` fields name,cover.image_id,first_release_date,summary,involved_companies.company.name,release_dates.release_region;
                      where slug = "${title}";
                      limit 1;
                    `

    const gameInfoResponse = await fetch(`${IGDB_ENDPOINT}/v4/games`, {
      method: 'POST',
      body: request,
      headers: {
        Accept: 'application/json',
        'Client-ID': TWITCH_API_CLIENT_ID!,
        Authorization: `Bearer ${cachedTwitchToken.access_token}`,
      },
    })

    const gameInfo = (await gameInfoResponse.json())[0] as IGDBGame

    console.log(
      gameInfo.release_dates.map((r) => IGDB_REGIONS[r.release_region]),
    )
    return {
      name: gameInfo.name,
      cover: gameInfo.cover.image_id,
      releaseYear: String(
        new Date(+gameInfo.first_release_date * 1000).getFullYear(),
      ),
      involvedCompanies: gameInfo.involved_companies
        .map((i) => i.company.name)
        .join(', '),
      summary: gameInfo.summary,
      regions: Array.from(
        new Set(
          gameInfo.release_dates.map((r) => IGDB_REGIONS[r.release_region]),
        ),
      ).filter(Boolean),
    }
  } catch (error) {
    throw error
  }
}

export async function getGameInfoFromSS(
  title: string,
  platform: string,
): Promise<GameInfo> {
  try {
    const systemId = SS_PLATFORM_CODE[platform]
    const normalizedTitle = title.replaceAll('-', ' ').trim()

    const gameInfoResponse = await fetch(
      `${SCREENSCRAPER_GAME_ENDPOINT}?devid=difradev&devpassword=FHhunOSIar8&softname=retro-coins&output=JSON&recherche=${encodeURIComponent(normalizedTitle)}&systemeid=${systemId}`,
    )
    const result = (await gameInfoResponse.json()) as SSGame
    return findTheRightGame(normalizedTitle, result.response.jeux)
  } catch (error) {
    console.error('Error while retrieving game info from ScreenScraper!', error)
    throw error
  }
}

function findTheRightGame(title: string, games: Jeux[]): GameInfo {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Must start at the beginning of the string
  const includeTitleRegex = new RegExp(`^${escapedTitle}(\\b|$)`, 'i')
  // Exclude if after the title there is a standalone number or a proper Roman numeral
  const romanNumerals = 'i{1,3}|iv|vi{0,3}|ix|xi{0,3}|xiv|xix|x{1,3}'
  const excludeSequelRegex = new RegExp(
    `^${escapedTitle}[\\s.\\-:,]*(?:\\d+|(?:${romanNumerals}))(?:\\s|$)`,
    'i',
  )
  const rightGame = games
    .filter((game) =>
      game.noms.some((nom) => {
        const candidate = nom.text.toLowerCase().trim()
        return (
          includeTitleRegex.test(candidate) &&
          !excludeSequelRegex.test(candidate)
        )
      }),
    )
    .map((g) => ({
      name: g.noms[0].text,
      cover: g.medias.find((m) => m.type === 'box-2D')?.url,
      regions: g.dates?.map((r) => SS_REGIONS_CODE[r.region]).filter(Boolean),
      involvedCompanies: g.developpeur?.text,
      summary: g.synopsis.find((s) => s.langue === 'en')?.text,
      releaseYear: g.dates?.reduce(
        (oldest, d) => (d.text < oldest.text ? d : oldest),
        g.dates[0],
      ).text,
      // box: g.medias.find((m) => m.type === 'box-3D')?.url,
      // boxSide: g.medias.find((m) => m.type === 'box-2D-side')?.url,
    }))

  return rightGame[0]
}
