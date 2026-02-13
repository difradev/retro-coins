import { db } from '@/lib/database'
import { gamesDictionary } from '@/lib/database/schemas/gamesDictionary'
import { NextRequest } from 'next/server'

export type GamesSuggestionResponse = {
  id: number
  slug: string
  name: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')

  if (!query) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
    })
  }

  // TODO: Rivedere la query!
  const data = (await db.select().from(gamesDictionary)).filter((gd) =>
    gd.slug.includes(query),
  ) as GamesSuggestionResponse[]

  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
  })
}
