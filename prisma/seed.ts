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
    skipDuplicates: true,
  })

const createManyConditions = async () =>
  await prisma.condition.createMany({
    data: [
      { code: 'LOOSE', name: 'Loose' },
      { code: 'CIB', name: 'Complete' },
      { code: 'SEALED', name: 'Sealed' },
    ],
    skipDuplicates: true,
  })

const createManyRegions = async () =>
  await prisma.region.createMany({
    data: [
      { code: 'PAL', name: 'PAL' },
      { code: 'NTSC', name: 'NTSC' },
      { code: 'JAP', name: 'Japan' },
    ],
    skipDuplicates: true,
  })

const createSearchDemands = async () =>
  await prisma.searchDemand.createMany({
    data: [
      {
        searchKey: 'pokemon-red-version-gb-pal-cib',
        rawQuery: 'Pokemon Red Version GB PAL CIB',
        createdAt: faker.date.anytime(),
        count7d: 11,
      },
      {
        searchKey: 'sonic-the-hedgehog-sms-pal-loose',
        rawQuery: 'Sonic The Hedgehog SMS PAL LOOSE',
        createdAt: faker.date.anytime(),
        count7d: 22,
      },
      {
        searchKey: 'nintendo-world-championships-nes-pal-cib',
        rawQuery: 'Nintendo World Championships NES PAL CIB',
        createdAt: faker.date.anytime(),
        count7d: 12,
      },
    ],
  })

const createGamesSuggestion = async () =>
  await prisma.gameSuggestion.createMany({
    data: [
      { title: 'Super Mario Bros.', code: 'super-mario-bros' },
      {
        title: 'Nintendo World Championships',
        code: 'nintendo-world-championships',
      },
      { title: 'Stadium Events', code: 'stadium-events' },
      { title: 'The Legend of Zelda', code: 'the-legend-of-zelda' },
      { title: 'Pokémon Red', code: 'pokemon-red' },
      { title: 'Pokémon Blue', code: 'pokemon-blue' },
      {
        title: 'Sonic the Hedgehog',
        code: 'sonic-the-hedgehog',
      },
      { title: 'Chrono Trigger', code: 'chrono-trigger' },
      { title: 'EarthBound', code: 'earthbound' },
      { title: 'Little Samson', code: 'little-samson' },
      {
        title: 'Nintendo Campus Challenge',
        code: 'nintendo-campus-challenge',
      },
      { title: 'Final Fantasy', code: 'final-fantasy' },
      { title: 'Star Fox 2', code: 'star-fox-2' },
      {
        title: 'Ecco the Dolphin',
        code: 'ecco-the-dolphin',
      },
      { title: 'Tetris', code: 'tetris' },
      { title: 'Castlevania', code: 'castlevania' },
      { title: 'Mega Man 2', code: 'mega-man-2' },
      { title: 'Metroid', code: 'metroid' },
      { title: 'Secret of Mana', code: 'secret-of-mana' },
      { title: 'Donkey Kong Country', code: 'donkey-kong-country' },
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
  // await createManyPlatforms()
  // await createManyConditions()
  // await createManyRegions()
  // for (const g of gameData) {
  //   await prisma.game.create({ data: g })
  // }
  createSearchDemands()
  // createGamesSuggestion()
}

main()
