'use server'

export async function searchGames(formData: FormData) {
  const searchQuery = formData.get('search-input') as string
  const selectedPlatform = formData.get('platform') as string | null
  const selectedCondition = formData.get('condition') as string | null

  console.log('Search query:', searchQuery)
  console.log('Selected platform:', selectedPlatform)
  console.log('Selected condition:', selectedCondition)

  // TODO: Implementa la logica di ricerca nel DB
  // const results = await prisma.game.findMany({
  //   where: {
  //     title: { contains: searchQuery, mode: 'insensitive' },
  //     gameVariants: {
  //       some: {
  //         platform: { code: selectedPlatform },
  //         condition: { code: selectedCondition }
  //       }
  //     }
  //   }
  // })

  return {
    success: true,
    game: 'game-title-normalized-with-data',
  }
}
