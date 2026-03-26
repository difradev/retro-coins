import { Divider } from '@/app/_components/divider'
import { GameInfo } from '@/app/_components/game-info'
import { Price } from '@/app/_components/price'
import { Regions } from '@/app/_components/regions'
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

const getGameVariant = cache((gameId: string, regionId?: number) => {
  return unstable_cache(
    () => {
      return prisma.gameVariant.findFirst({
        where: { AND: [{ gameId: +gameId }, { regionId }] },
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
    ['gameVariant', gameId, String(regionId)],
    { revalidate: 86400, tags: ['gameVariant', gameId] },
  )()
})

const getOtherGamesVariant = cache(
  (
    gameId: number,
    conditionId: number,
    regionId: number,
    platformId: number,
  ) => {
    return unstable_cache(
      () => {
        return prisma.gameVariant.findMany({
          where: {
            gameId: gameId,
            AND: [
              { conditionId: { not: conditionId } },
              { regionId },
              { platformId },
            ],
          },
          select: {
            condition: true,
            priceSnapshots: true,
          },
        })
      },
      ['otherGamesVariant', gameId.toLocaleString(), regionId.toLocaleString()],
      {
        revalidate: 86400,
        tags: [
          'otherGamesVariant',
          gameId.toLocaleString(),
          regionId.toLocaleString(),
        ],
      },
    )()
  },
)

const getGameRegions = cache((id: number) => {
  return unstable_cache(
    () => {
      return prisma.gameVariant.findMany({
        where: { gameId: id },
        select: {
          region: {
            select: {
              id: true,
              code: true,
            },
          },
        },
        distinct: ['regionId'],
      })
    },
    ['gameRegions', id.toLocaleString()],
    { revalidate: 86400, tags: ['gameRegions', id.toLocaleString()] },
  )()
})

export default async function Game({
  params,
  searchParams,
}: {
  params: Promise<GamePageParams>
  searchParams: Promise<{ region?: string }>
}) {
  const { id } = await params
  const { region } = await searchParams

  const gameRegions = await getGameRegions(+id)
  const regions = gameRegions.map((gr) => gr.region)

  let selectedRegion = regions[0].id
  if (region) {
    selectedRegion = +region
  }

  const foundGame = await getGameVariant(id, selectedRegion)

  if (!foundGame) {
    redirect('/')
  }

  const otherGameConditions = await getOtherGamesVariant(
    foundGame.game.id,
    foundGame.condition.id,
    foundGame.region.id,
    foundGame.platform.id,
  )

  metadata.title = `${foundGame.game.title} price | RetroCoins!`
  metadata.description = `Find the right price for ${foundGame.game.title}`

  return (
    <div className="w-4xl mx-auto">
      <Link
        href="/"
        className="text-white font-black text-xl tracking-wider w-full h-full uppercase"
      >
        <div className="rounded-sm relative bg-linear-to-r from-red-500 to-red-600 border-l-8 border-[#2247b5] p-4 mb-6 hover:border-yellow-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer active:translate-0">
          Press start ► to find another retro-game!
        </div>
      </Link>
      <div className="flex gap-8 items-start pb-12">
        <div className="flex flex-col gap-4 w-1/2">
          <img
            src={foundGame?.game.image}
            alt={`${foundGame?.game.title} ${foundGame?.condition.name} price`}
            className="max-w-121 rounded-sm shadow-lg"
          />
          <hr className="w-full border border-blue-950" />
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Game description</p>
            <p className="text-lg">{foundGame?.game.description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1
              className={`font-black text-6xl text-[#2247b5] ${youngSerif.className}`}
            >
              {foundGame?.game.title}
            </h1>
            <GameInfo
              platform={foundGame.platform.name}
              developers={foundGame.game.developedBy}
              firstReleaseDate={foundGame?.game.firstRelease}
              region={foundGame?.region.name}
            />
          </div>
          <Divider hight="h-0.5" />
          <Regions regions={regions} region={selectedRegion} />
          <Price
            priceSnapshot={foundGame?.priceSnapshots[0]!}
            info={{
              condition: foundGame?.condition.code!,
              region: foundGame?.region.name!,
            }}
          />
          <hr className="w-full border border-blue-950" />
          {/* Prices by condition */}
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">Other conditions for this game</p>
            <div className="bg-blue-950 p-4 rounded-sm flex flex-col gap-4 text-white font-bold text-lg">
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
