import { Prisma } from '@/app/generated/prisma/browser'
import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { faker } from '@faker-js/faker'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const createManyPlatforms = async () =>
  await prisma.platform.createMany({
    data: [
      { code: 'GB', name: 'Game Boy' },
      { code: 'GBC', name: 'Game Boy Color' },
      { code: 'GBA', name: 'Game Boy Advance' },
      { code: 'NES', name: 'Nintendo Entertainment System' },
      { code: 'SNES', name: 'Super Nintendo' },
      { code: 'SMS', name: 'Sega Master System' },
      { code: 'SMD', name: 'Sega Mega Drive' },
    ],
  })

const createManyConditions = async () =>
  await prisma.condition.createMany({
    data: [
      { code: 'LOOSE', name: 'Loose' },
      { code: 'CIB', name: 'Complete' },
      { code: 'SEALED', name: 'Sealed' },
    ],
  })

const createManyRegions = async () =>
  await prisma.region.createMany({
    data: [
      { code: 'PAL', name: 'PAL' },
      { code: 'NTSC', name: 'NTSC' },
      { code: 'JAP', name: 'Japan' },
    ],
  })

const createSearchDemands = async () =>
  await prisma.searchDemand.createMany({
    data: [
      {
        searchKey: 'pokemon-red-pal-cib',
        rawQuery: 'Pokemon Red PAL CIB',
        createdAt: faker.date.anytime(),
        count7d: 11,
      },
      {
        searchKey: 'sonic-the-hedgehog-pal-loose',
        rawQuery: 'Sonic The Hedgehog PAL LOOSE',
        createdAt: faker.date.anytime(),
        count7d: 2,
      },
    ],
  })

const gameData: Prisma.GameCreateInput[] = [
  {
    title: 'Pokemon Red',
    description: 'This is a dummy text',
    image: '',
    year: 1996,
    rate: 90,
    gameVariants: {
      create: [
        {
          platformId: 1,
          conditionId: 2,
          regionId: 1,
        },
      ],
    },
  },
]

export async function main() {
  createManyPlatforms()
  createManyConditions()
  createManyRegions()
  // for (const g of gameData) {
  //   await prisma.game.create({ data: g })
  // }
  // createSearchDemands()
}

main()
