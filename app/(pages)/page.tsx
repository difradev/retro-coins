import { Metadata } from 'next'
import Hero from '../_components/hero'
import Searchbar from '../_components/searchbar'
import {
  getAllConditions,
  getAllPlatforms,
  getAllRegions,
  getTrendingGameSearches,
} from '../lib/repository/game-repository'
import { TrendingSearches } from '../_components/trending-searches'

export const metadata: Metadata = {
  title: 'RetroCoins! | Real market prices for retro games',
  description:
    'Accurate retro game prices based on real market sales! Prices calculated from real sales using median values. Extreme prices are removed for accuracy.',
}

export default async function Home() {
  const platforms = await getAllPlatforms()
  const conditions = await getAllConditions()
  const regions = await getAllRegions()
  const trendingSearches = await getTrendingGameSearches()

  return (
    <div className="h-full flex flex-col items-center gap-6 w-4xl mx-auto">
      <Hero />
      <Searchbar
        platforms={platforms!}
        conditions={conditions!}
        regions={regions!}
      />
      {/* <Divider hight="h-2" /> */}
      {/* More visited! */}
      {/* <TrendingSearches searches={trendingSearches} /> */}
    </div>
  )
}
