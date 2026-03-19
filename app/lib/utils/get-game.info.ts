import { IGDBGame } from '../types/IGDBGame'

const IGDB_ENDPOINT = process.env.IGDB_ENDPOINT
const TWITCH_OAUTH_URL = process.env.TWITCH_OAUTH_URL
const TWITCH_API_CLIENT_ID = process.env.TWITCH_API_CLIENT_ID
const TWITCH_API_SECRET = process.env.TWITCH_API_SECRET

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
export async function getGameInfoFromIGDB(title: string): Promise<IGDBGame[]> {
  try {
    if (!cachedTwitchToken || Date.now() > expiryTwitchTokenTimestamp) {
      const igdbAuth = await fetch(
        `${TWITCH_OAUTH_URL}?client_id=${TWITCH_API_CLIENT_ID}&client_secret=${TWITCH_API_SECRET}&grant_type=client_credentials`,
        { method: 'POST' },
      )
      const response = (await igdbAuth.json()) as TokenResponse
      cachedTwitchToken = response
      expiryTwitchTokenTimestamp = Date.now() + response.expires_in * 1000
      console.log(cachedTwitchToken)
    }
  } catch (error) {
    console.error('Error while trying to login to Twitch!', error)
    throw error
  }
  try {
    const request = ` fields name,cover.image_id,first_release_date,summary,involved_companies.company.name,platforms.name;
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

    return (await gameInfoResponse.json()) as IGDBGame[]
  } catch (error) {
    throw error
  }
}
