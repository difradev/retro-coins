import { GameInfo } from '@/app/_components/game-info'
import { Price } from '@/app/_components/price'
import prisma from '@/app/lib/database/prisma'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { Young_Serif } from 'next/font/google'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cache } from 'react'

export const metadata: Metadata = {}

type GamePageParams = {
  id: string
}

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

const getGameVariant = cache((id: string) => {
  return unstable_cache(
    () => {
      return prisma.gameVariant.findFirst({
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
    },
    ['gameVariant', id],
    { revalidate: 86400, tags: ['gameVariant', id] },
  )()
})

const getOtherGamesVariant = cache((gameId: number, conditionId: number) => {
  return unstable_cache(
    () => {
      return prisma.gameVariant.findMany({
        where: {
          gameId: gameId,
          AND: [{ conditionId: { not: conditionId } }],
        },
        select: {
          condition: true,
          priceSnapshots: true,
        },
      })
    },
    ['otherGamesVariant', gameId.toLocaleString()],
    { revalidate: 86400, tags: ['otherGamesVariant', gameId.toLocaleString()] },
  )()
})

export default async function Game({
  params,
}: {
  params: Promise<GamePageParams>
}) {
  const { id } = await params

  const searchedGame = await getGameVariant(id)
  if (!searchedGame) {
    redirect('/')
  }

  const otherGameConditions = await getOtherGamesVariant(
    searchedGame.game.id,
    searchedGame.condition.id,
  )

  metadata.title = `${searchedGame.game.title} ${searchedGame.condition.code} ${searchedGame.region.name} price | RetroCoins!`
  metadata.description = `Find the right price for ${searchedGame.game.title} ${searchedGame.condition.code} ${searchedGame.region.name}`

  return (
    <div className="py-67.5 w-4xl mx-auto">
      <Link
        href="/"
        className="text-white font-black text-xl tracking-wider w-full h-full uppercase"
      >
        <div className="rounded-sm relative bg-linear-to-r from-red-500 to-red-600 border-l-8 border-[#2247b5] p-4 mb-6 hover:border-yellow-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer active:translate-0">
          Press <span className="p-2 bg-[#2247b5] rounded-sm">start ►</span> to
          find another retro-game!
        </div>
      </Link>
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
