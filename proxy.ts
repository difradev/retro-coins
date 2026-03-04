import { NextRequest, NextResponse } from 'next/server'

const API_SECRET = process.env.API_SECRET

export function proxy(req: NextRequest) {
  const authentication = req.headers.get('Authorization')

  if (!API_SECRET || !authentication) {
    return NextResponse.json(
      {
        message: 'Unauthorized!',
      },
      {
        status: 403,
      },
    )
  }

  const token = authentication.replace('Bearer ', '')

  if (token !== API_SECRET) {
    return NextResponse.json(
      {
        message: 'Invalid token!',
      },
      {
        status: 401,
      },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
