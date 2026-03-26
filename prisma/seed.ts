import { PrismaClient } from '@/app/generated/prisma/client'
import { faker } from '@faker-js/faker'
import { PrismaPg } from '@prisma/adapter-pg'

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
      { code: 'NTSC_J', name: 'NTSC-J' },
    ],
    skipDuplicates: true,
  })

const createSearchDemands = async () =>
  await prisma.searchDemand.createMany({
    data: [
      {
        searchKey: 'sonic-the-hedgehog-sms-pal-cib',
        rawQuery: 'Sonic the hedgehog SMS PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'sonic-the-hedgehog-smd-pal-cib',
        rawQuery: 'Sonic the hedgehog SMD PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'pokemon-red-version-gb-pal-cib',
        rawQuery: 'Pokemon Red Version GB PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'stadium-events-nes-pal-cib',
        rawQuery: 'Stadium Events NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'the-legend-of-zelda-nes-pal-cib',
        rawQuery: 'The Legend of Zelda NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'chrono-trigger-nes-pal-cib',
        rawQuery: 'Chrono Trigger NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'earthbound-snes-pal-cib',
        rawQuery: 'Earthbound SNES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'earthbound-gba-pal-cib',
        rawQuery: 'Earthbound GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'little-samson-nes-pal-cib',
        rawQuery: 'Little Samson NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'final-fantasy-nes-pal-cib',
        rawQuery: 'Final Fantasy NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'star-fox-2-snes-pal-cib',
        rawQuery: 'Star Fox 2 SNES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'ecco-the-dolphin-SMD-pal-cib',
        rawQuery: 'Ecco The Dolphin SMD PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'castlevania-nes-pal-cib',
        rawQuery: 'Castlevania NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'mega-man-2-nes-pal-cib',
        rawQuery: 'Mega Man 2 NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'metroid-nes-pal-cib',
        rawQuery: 'Metroid NES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'secret-of-mana-snes-pal-cib',
        rawQuery: 'Secret of Mana SNES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'donkey-kong-country-snes-pal-cib',
        rawQuery: 'Donkey Kong Country SNES PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'panorama-cotton-smd-pal-cib',
        rawQuery: 'Panorama Cotton Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'eliminate-down-smd-pal-cib',
        rawQuery: 'Eliminate Down Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'twinkle-tale-smd-pal-cib',
        rawQuery: 'Twinkle Tale Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'battle-mania-daiginjou-smd-pal-cib',
        rawQuery: 'Battle Mania Daiginjou Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'gley-lancer-smd-pal-cib',
        rawQuery: 'Gley Lancer Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'pulseman-smd-pal-cib',
        rawQuery: 'Pulseman Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'alien-soldier-smd-pal-cib',
        rawQuery: 'Alien Soldier Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'mega-man-the-wily-wars-smd-pal-cib',
        rawQuery: 'Mega Man The Wily Wars Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'castlevania-bloodlines-smd-pal-cib',
        rawQuery: 'Castlevania Bloodlines Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'contra-hard-corps-smd-pal-cib',
        rawQuery: 'Contra Hard Corps Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'snow-bros-smd-pal-cib',
        rawQuery: 'Snow Bros Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'the-punisher-smd-pal-cib',
        rawQuery: 'The Punisher Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'yu-yu-hakusho-makyou-toitsusen-smd-pal-cib',
        rawQuery: 'Yu Yu Hakusho Makyou Toitsusen Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'verytex-smd-pal-cib',
        rawQuery: 'Verytex Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'undead-line-smd-pal-cib',
        rawQuery: 'Undead Line Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'crusader-of-centy-smd-pal-cib',
        rawQuery: 'Crusader of Centy Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'beyond-oasis-smd-pal-cib',
        rawQuery: 'Beyond Oasis Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'light-crusader-smd-pal-cib',
        rawQuery: 'Light Crusader Sega Mega Drive PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'power-strike-ii-sms-pal-cib',
        rawQuery: 'Power Strike II Sega Master System PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'bomber-raid-sms-pal-cib',
        rawQuery: 'Bomber Raid Sega Master System PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'metroid-fusion-gba-pal-cib',
        rawQuery: 'Metroid Fusion GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'metroid-zero-mission-gba-pal-cib',
        rawQuery: 'Metroid Zero Mission GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'castlevania-aria-of-sorrow-gba-pal-cib',
        rawQuery: 'Castlevania Aria of Sorrow GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'castlevania-circle-of-the-moon-gba-pal-cib',
        rawQuery: 'Castlevania Circle of the Moon GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'castlevania-harmony-of-dissonance-gba-pal-cib',
        rawQuery: 'Castlevania Harmony of Dissonance GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'pokemon-emerald-gba-pal-cib',
        rawQuery: 'Pokemon Emerald GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'pokemon-fire-red-gba-pal-cib',
        rawQuery: 'Pokemon Fire Red GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'pokemon-leaf-green-gba-pal-cib',
        rawQuery: 'Pokemon Leaf Green GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'advance-wars-gba-pal-cib',
        rawQuery: 'Advance Wars GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
      {
        searchKey: 'advance-wars-2-black-hole-rising-gba-pal-cib',
        rawQuery: 'Advance Wars 2 Black Hole Rising GBA PAL CIB',
        createdAt: faker.date.recent(),
        count7d: 10,
      },
    ],
  })

// const createGamesSuggestion = async () =>
//   await prisma.gameSuggestion.createMany({
//     data: [
//       { code: 'sonic-the-hedgehog', title: 'Sonic the Hedgehog' },
//       { code: 'metroid-fusion', title: 'Metroid Fusion' },
//       { code: 'metroid-zero-mission', title: 'Metroid Zero Mission' },
//       {
//         code: 'castlevania-aria-of-sorrow',
//         title: 'Castlevania Aria of Sorrow',
//       },
//       {
//         code: 'castlevania-circle-of-the-moon',
//         title: 'Castlevania Circle of the Moon',
//       },
//       {
//         code: 'castlevania-harmony-of-dissonance',
//         title: 'Castlevania Harmony of Dissonance',
//       },
//       { code: 'pokemon-emerald', title: 'Pokémon Emerald' },
//       { code: 'pokemon-fire-red', title: 'Pokémon FireRed' },
//       { code: 'pokemon-leaf-green', title: 'Pokémon LeafGreen' },
//       { code: 'advance-wars', title: 'Advance Wars' },
//       {
//         code: 'advance-wars-2-black-hole-rising',
//         title: 'Advance Wars 2 Black Hole Rising',
//       },
//       { code: 'panorama-cotton', title: 'Panorama Cotton' },
//       { code: 'eliminate-down', title: 'Eliminate Down' },
//       { code: 'twinkle-tale', title: 'Twinkle Tale' },
//       { code: 'battle-mania-daiginjou', title: 'Battle Mania Daiginjou' },
//       { code: 'gley-lancer', title: 'Gley Lancer' },
//       { code: 'pulseman', title: 'Pulseman' },
//       { code: 'alien-soldier', title: 'Alien Soldier' },
//       { code: 'mega-man-the-wily-wars', title: 'Mega Man: The Wily Wars' },
//       { code: 'castlevania-bloodlines', title: 'Castlevania: Bloodlines' },
//       { code: 'contra-hard-corps', title: 'Contra: Hard Corps' },
//       { code: 'snow-bros', title: 'Snow Bros.' },
//       { code: 'the-punisher', title: 'The Punisher' },
//       {
//         code: 'yu-yu-hakusho-makyou-toitsusen',
//         title: 'Yu Yu Hakusho: Makyou Toitsusen',
//       },
//       { code: 'magical-taruruuto-kun', title: 'Magical Taruruuto-kun' },
//       { code: 'verytex', title: 'Verytex' },
//       { code: 'undead-line', title: 'Undead Line' },
//       { code: 'rent-a-hero', title: 'Rent-A-Hero' },
//       { code: 'langrisser-ii', title: 'Langrisser II' },
//       { code: 'devil-hunter-yohko', title: 'Devil Hunter Yohko' },
//       { code: 'battle-golfer-yui', title: 'Battle Golfer Yui' },
//       { code: 'dahna-megami-tanjou', title: 'Dahna: Megami Tanjou' },
//       { code: 'el-viento', title: 'El Viento' },
//       { code: 'chakan-the-forever-man', title: 'Chakan: The Forever Man' },
//       { code: 'zero-tolerance', title: 'Zero Tolerance' },
//       { code: 'the-ooze', title: 'The Ooze' },
//       {
//         code: 'spider-man-and-venom-separation-anxiety',
//         title: 'Spider-Man and Venom: Separation Anxiety',
//       },
//       { code: 'time-killers', title: 'Time Killers' },
//       { code: 'crusader-of-centy', title: 'Crusader of Centy' },
//       { code: 'beyond-oasis', title: 'Beyond Oasis' },
//       { code: 'light-crusader', title: 'Light Crusader' },
//       { code: 'power-strike-ii', title: 'Power Strike II' },
//       { code: 'bomber-raid', title: 'Bomber Raid' },
//       { code: 'mah-jong', title: 'Mah-Jong' },
//       { code: 'great-ice-hockey', title: 'Great Ice Hockey' },
//       { code: 'masters-of-combat', title: 'Masters of Combat' },
//       { code: 'the-ninja', title: 'The Ninja' },
//       { code: 'golden-axe-warrior', title: 'Golden Axe Warrior' },
//       {
//         code: 'golvellius-valley-of-doom',
//         title: 'Golvellius: Valley of Doom',
//       },
//       { code: 'ys-the-vanished-omens', title: 'Ys: The Vanished Omens' },
//       {
//         code: 'alex-kidd-in-shinobi-world',
//         title: 'Alex Kidd in Shinobi World',
//       },
//       {
//         code: 'wonder-boy-iii-the-dragons-trap',
//         title: "Wonder Boy III: The Dragon's Trap",
//       },
//       { code: 'master-of-darkness', title: 'Master of Darkness' },
//       {
//         code: 'zillion-ii-the-tri-formation',
//         title: 'Zillion II: The Tri Formation',
//       },
//       { code: 'montezumas-revenge', title: "Montezuma's Revenge" },
//       { code: 'galaxy-force', title: 'Galaxy Force' },
//       { code: 'r-type', title: 'R-Type' },
//       { code: 'psycho-fox', title: 'Psycho Fox' },
//       {
//         code: 'wonder-boy-in-monster-land',
//         title: 'Wonder Boy in Monster Land',
//       },
//       {
//         code: 'rambo-first-blood-part-ii',
//         title: 'Rambo: First Blood Part II',
//       },
//     ],
//   })

// const gameData: Prisma.GameCreateInput[] = [
//   {
//     title: 'Pokemon Red',
//     description: 'This is a dummy text',
//     image: '',
//     year: 1996,
//     developedBy: '',
//     slug: '',
//     gameVariants: {
//       create: [
//         {
//           platformId: 1,
//           conditionId: 2,
//           regionId: 1,
//         },
//       ],
//     },
//   },
// ]

export async function main() {
  // await createManyPlatforms()
  // await createManyConditions()
  await createManyRegions()
  // for (const g of gameData) {
  //   await prisma.game.create({ data: g })
  // }
  // createSearchDemands()
  // createGamesSuggestion()
}

main()
