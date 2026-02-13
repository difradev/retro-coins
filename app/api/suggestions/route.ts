import { db } from '@/lib/database'
import { BaseModel } from '@/lib/models/base-model'
import { GamesSuggestionResponse } from '@/lib/models/games-suggestion'
import { gamesDictionary } from '@/lib/database/schemas/gamesDictionary'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')

  if (!query) {
    return new Response(JSON.stringify({ success: false }), {
      status: 400,
    })
  }

  const normalizedQuery = query.split(' ').join('-').toLowerCase()
  const data = (await db.select().from(gamesDictionary)).filter((gd) =>
    gd.slug.includes(normalizedQuery),
  )

  return new Response(
    JSON.stringify({ success: true, data } as BaseModel<
      GamesSuggestionResponse[]
    >),
    {
      status: 200,
    },
  )
}
