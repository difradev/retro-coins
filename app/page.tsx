import prisma from './lib/database/prisma'

export default async function Home() {
  const gameVariants = await prisma.gameVariant.findMany({
    include: {
      game: true,
      platform: true,
      condition: true,
      region: true,
    },
  })
  return <div>{gameVariants.map((g) => g.platform.code)}</div>
}
