/**
 * TODO
 * - Aggiungere altre versioni
 * - Aggiungere grafici
 * - Inserire developed by
 * - prevedere range di prezzo con check di prezzo!
 */

import { GameInfo } from '@/app/_components/game-info'
import { Price } from '@/app/_components/price'
import prisma from '@/app/lib/database/prisma'
import { Metadata } from 'next'
import { Young_Serif } from 'next/font/google'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

    if (!game) {
      redirect('/')
    }

    metadata.title = `${game.game.title} ${game.region.name} ${game.condition.name} price - RetroCoins!`
    metadata.description = `Find the right price for ${game.game.title} ${game.region.name} ${game.condition.name}`
  } catch (error) {
    console.error('There was a problem', error)
  }

  return (
    <div className="py-67.5 w-4xl mx-auto">
      <div className="relative bg-linear-to-r from-red-500 to-red-600 border-l-8 border-[#2247b5] p-4 mb-6 hover:border-yellow-400 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 cursor-pointer active:translate-0">
        <Link
          href="/"
          className="text-white font-black text-xl tracking-wider w-full h-full uppercase"
        >
          ► Press <span className="underline-offset-4 underline">start</span> to
          find another retro-game!
        </Link>
      </div>
      <div className="flex gap-8 items-start">
        <img
          src={game?.game.image}
          alt={`${game?.game.title} ${game?.condition.name} price`}
          className="w-1/2 rounded-sm shadow-lg"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <GameInfo
              platform={game?.platform.name!}
              region={game?.region.name!}
              condition={game?.condition.code!}
            />
            <h1
              className={`font-black text-6xl text-[#2247b5] ${youngSerif.className}`}
            >
              {game?.game.title}
            </h1>
            <div className="flex gap-1 items-center">
              <p>Published in {game?.game.year}</p>
            </div>
          </div>
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
    </div>
  )
}
