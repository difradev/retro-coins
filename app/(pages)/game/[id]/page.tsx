/**
 * TODO
 * - Aggiungere altre versioni
 * - Aggiungere grafici
 * - Inserire developed by
 */

import { Price } from '@/app/_components/price'
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
    <div className="flex gap-8 items-start py-67.5 w-4xl mx-auto">
      <img
        src={game?.game.image}
        alt={`${game?.game.title} ${game?.condition.name} price`}
        className="w-1/2 rounded-sm shadow-lg"
      />
      <div className="flex flex-col gap-6">
        {/* TITLE AND INFO */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            <p className="text-xl font-bold text-white bg-red-600 p-2 rounded-sm">
              {game?.platform.name}
            </p>
            <p className="text-xl font-bold text-white bg-red-600 p-2 rounded-sm">
              {game?.region.name}
            </p>
            <p className="text-xl font-bold text-white bg-red-600 p-2 rounded-sm">
              {game?.condition.name}
            </p>
          </div>
          <h1
            className={`font-black text-6xl text-[#2247b5] ${youngSerif.className}`}
          >
            {game?.game.title}
          </h1>
          <div className="flex gap-1 items-center">
            <p>Published in {game?.game.year}</p>
            {/* <p>-</p>
            <p>Developed by SEGA</p> */}
          </div>
        </div>
        {/* PRICE */}
        <Price priceSnapshot={game?.priceSnapshots[0]!} />
        <hr className="w-full border border-blue-950" />
        <p className="text-xl mt-4">{game?.game.description}</p>
        <hr className="w-full border border-blue-950" />
        {/* Prices by condition */}
        <div>
          <p>Other conditions</p>
        </div>
        {/* <hr className="w-full border border-blue-950" /> */}
        {/* Grafici */}
        {/* <div>
          <p>GRAFICI</p>
        </div> */}
      </div>
    </div>
  )
}
