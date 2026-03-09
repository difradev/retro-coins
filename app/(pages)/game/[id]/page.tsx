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
  let searchedGame = null
  let otherGameConditions = null

  try {
    searchedGame = await prisma.gameVariant.findFirst({
      where: { id: +id },
      select: {
        id: true,
        game: true,
        condition: true,
        platform: true,
        region: true,
        priceSnapshots: true,
      },
    })

    if (!searchedGame) {
      redirect('/')
    }

    otherGameConditions = await prisma.gameVariant.findMany({
      where: {
        gameId: searchedGame.game.id,
        AND: [{ conditionId: { not: searchedGame.condition.id } }],
      },
      select: {
        condition: true,
        priceSnapshots: true,
      },
    })

    metadata.title = `${searchedGame.game.title} ${searchedGame.condition.code} ${searchedGame.region.name} price | RetroCoins!`
    metadata.description = `Find the right price for ${searchedGame.game.title} ${searchedGame.condition.code} ${searchedGame.region.name}`
  } catch (error) {
    console.error('There was a problem', error)
  }

  return (
    <div className="py-67.5 w-4xl mx-auto">
      <div className="relative bg-linear-to-r from-red-500 to-red-600 border-l-8 border-[#2247b5] p-4 mb-6 hover:border-yellow-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer active:translate-0">
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
          src={searchedGame?.game.image}
          alt={`${searchedGame?.game.title} ${searchedGame?.condition.name} price`}
          className="w-1/2 rounded-sm shadow-lg"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1
              className={`font-black text-6xl text-[#2247b5] ${youngSerif.className}`}
            >
              {searchedGame?.game.title}
            </h1>
            <GameInfo
              platform={searchedGame?.platform.name!}
              condition={searchedGame?.condition.code!}
              region={searchedGame?.region.name!}
              release={searchedGame?.game.year!}
            />
          </div>
          <Price
            priceSnapshot={searchedGame?.priceSnapshots[0]!}
            info={{
              condition: searchedGame?.condition.code!,
              region: searchedGame?.region.name!,
            }}
          />
          <hr className="w-full border border-blue-950" />
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Game description</p>
            <p className="text-xl">{searchedGame?.game.description}</p>
          </div>
          <hr className="w-full border border-blue-950" />
          {/* Prices by condition */}
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Other conditions for this game</p>
            <div className="bg-blue-950 p-4 rounded-sm flex flex-col gap-2 text-white font-bold text-lg">
              {otherGameConditions?.map((o) =>
                (o.priceSnapshots[0].itemsCount ?? 0) > 0 ? (
                  <div
                    key={o.condition.id}
                    className="flex w-full justify-between"
                  >
                    <p className="font-bold w-16">{o.condition.code}</p>
                    <p>
                      {o.priceSnapshots[0].price}{' '}
                      {o.priceSnapshots[0].currency === 'EUR' ? '€' : '$'}
                    </p>
                  </div>
                ) : (
                  <div
                    key={o.condition.id}
                    className="flex w-full justify-between"
                  >
                    <p className="font-bold w-16">{o.condition.code}</p>
                    <p>-</p>
                  </div>
                ),
              )}
            </div>
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
