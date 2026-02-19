/**
 * QUESTO ENDPOINT SI OCCUPERÀ DI CONTROLLARE E AGGIORNARE IL PREZZO PER OGNI GIOCO (SE L'ULTIMO PREZZO AGGIORNATO RISALE AD UNA SETTIMANA PRIMA)
 *
 */

import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse<ResponseWrapper<null>>> {
  return NextResponse.json(
    {
      message: 'OK',
    },
    { status: 200 },
  )
}
