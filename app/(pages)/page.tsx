import Hero from '../_components/hero'
import SearchBar from '../_components/searchbar'
import {
  getAllPlatforms,
  getAllConditions,
} from '../lib/repository/game-repository'

export default async function Home() {
  const platforms = await getAllPlatforms()
  const conditions = await getAllConditions()

  return (
    <div className="h-screen flex flex-col items-center gap-11 w-4xl mx-auto">
      <Hero />
      <SearchBar platforms={platforms!} conditions={conditions!} />
    </div>
  )
}
