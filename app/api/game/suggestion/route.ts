import prisma from '@/app/lib/database/prisma'
import { NextRequest, NextResponse } from 'next/server'

export type GameSuggestionResult = {
  id: number
  slug: string
  title: string
  platform: {
    code: string
    name: string
  }
}

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ResponseWrapper<GameSuggestionResult[]>>> {
  try {
    const query = req.nextUrl.searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        {
          message: 'Bad request!',
        },
        {
          status: 400,
        },
      )
    }

    const suggestions = await prisma.gameSuggestion.findMany({
      where: {
        slug: { contains: query.split(' ').join('-'), mode: 'insensitive' },
      },
      select: {
        id: true,
        slug: true,
        title: true,
        platform: {
          select: {
            code: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: 'OK',
        data: suggestions,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
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
