/**
 * TODO
 * 
 * - Inserire più ricercati;
 */

import Hero from '../_components/hero'
import SearchBar from '../_components/searchbar'
import {
  getAllPlatforms,
  getAllConditions,
  getAllRegions,
} from '../lib/repository/game-repository'

export default async function Home() {
  const platforms = await getAllPlatforms()
  const conditions = await getAllConditions()
  const regions = await getAllRegions()

  return (
    <div className="h-full flex flex-col items-center gap-6 w-4xl mx-auto">
      <Hero />
      <SearchBar
        platforms={platforms!}
        conditions={conditions!}
        regions={regions!}
      />
      {/* More visited! */}
    </div>
  )
}
