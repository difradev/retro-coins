import { GameSuggestion } from '@/app/generated/prisma/client'
import prisma from '@/app/lib/database/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ResponseWrapper<GameSuggestion[]>>> {
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
      where: { title: { contains: query, mode: 'insensitive' } },
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
