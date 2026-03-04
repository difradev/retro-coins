import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ResponseWrapper<any>>> {
  try {
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
  return NextResponse.json(
    {
      message: 'OK',
    },
    {
      status: 200,
    },
  )
}
