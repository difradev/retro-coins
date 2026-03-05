/**
 * TODO
 * - Aggiungere altre versioni
 * - Aggiungere grafici
 * - Prevedere una pagina intermedia? Si ricerca il gioco e si filtra solo dopo? Pagina dei risultati?
 */

import prisma from '@/app/lib/database/prisma'
import { Metadata } from 'next'
import { Young_Serif } from 'next/font/google'

export const metadata: Metadata = {}

type GamePageParams = {
  id: string
}

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

export default async function Game({
  params,
}: {
  params: Promise<GamePageParams>
}) {
  const { id } = await params
  let game = null

  try {
    game = await prisma.gameVariant.findFirst({
      where: { id: +id },
      select: {
        game: true,
        condition: true,
        platform: true,
        region: true,
        priceSnapshots: true,
      },
    })

    metadata.title = `${game?.game.title} ${game?.region.name} ${game?.condition.name} price - RetroCoins!`
    metadata.description = `Find the right price for ${game?.game.title} ${game?.region.name} ${game?.condition.name}`
  } catch (error) {
    console.error('There was a problem', error)
  }

  return (
    <div className="flex gap-8 items-start pt-67.5 w-4xl mx-auto">
      <img
        src={game?.game.image}
        alt={`${game?.game.title} ${game?.condition.name} price`}
        className="w-1/2 rounded-md shadow-lg"
      />
      <div className="flex flex-col gap-8 ">
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-semibold">
            {game?.platform.name} - {game?.region.name} - {game?.condition.name}
          </p>
          <h1
            className={`font-black text-6xl text-blue-800 ${youngSerif.className}`}
          >
            {game?.game.title}
          </h1>
          <p className="text-xl text-red-600 font-medium p-2 border-2 border-red-600 rounded-md">
            Published in {game?.game.year} - Ratings: {game?.game.rate}
          </p>
          <p className="text-xl mt-4">{game?.game.description}</p>
        </div>
        <p
          className={`text-9xl font-black text-blue-800 ${youngSerif.className}`}
        >
          {game?.priceSnapshots[0].price} €
        </p>
      </div>
    </div>
  )
}
