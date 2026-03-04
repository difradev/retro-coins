'use client'

import { useEffect, useRef, useState } from 'react'
import { searchGames } from '../actions/search-games'
import { Condition, Platform } from '../generated/prisma/client'
import Chip from './chip'

type SearchbarPros = {
  platforms: Platform[]
  conditions: Condition[]
}

export default function SearchBar({
  platforms,
  conditions,
}: SearchbarPros): React.ReactNode {
  const searchBarRef = useRef<HTMLInputElement>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  )
  const [gameSearched, setGameSearched] = useState<boolean>(false)

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus()
    }
  }, [searchBarRef, gameSearched, selectedCondition, selectedPlatform])

  const togglePlatform = (code: string) => {
    setSelectedPlatform((prev) => (prev === code ? null : code))
  }

  const toggleCondition = (code: string) => {
    setSelectedCondition((prev) => (prev === code ? null : code))
  }

  const handleSearchbar = (value: string) => {
    if (value.length >= 3) {
      // TODO: call api for get games suggestion
      // TODO: setgamesearched
      setGameSearched(true)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await searchGames(formData)
    console.log('Search result:', result)
    // TODO: Handle result (redirect)
  }

  return (
    <form action={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full flex gap-2">
          <input
            autoComplete="off"
            ref={searchBarRef}
            onChange={(e) => handleSearchbar(e.target.value)}
            type="text"
            className="w-full border-2 border-blue-600 outline-none p-4 rounded-md placeholder:text-xl placeholder:text-gray-500 text-2xl"
            placeholder="Search awesome 8-bit game.."
            name="search-input"
          />
          <button
            type="submit"
            disabled={!gameSearched || !selectedCondition || !selectedPlatform}
            className="py-2 px-4 text-xl bg-red-600 text-neutral-100 rounded-md uppercase font-black cursor-pointer hover:opacity-80 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {/* Chips for platforms */}
          <p className="text-sm uppercase font-semibold">Platforms</p>
          <div className="flex gap-1 justify-items-start flex-wrap">
            {platforms?.map((p) => (
              <div key={p.id}>
                <Chip
                  label={p.code}
                  selected={selectedPlatform === p.code}
                  onClick={() => togglePlatform(p.code)}
                />
              </div>
            ))}
            {selectedPlatform && (
              <input type="hidden" name="platform" value={selectedPlatform} />
            )}
          </div>
          {/* Chips for conditions */}
          <p className="text-sm uppercase font-semibold">Conditions</p>
          <div className="flex gap-1 justify-items-start flex-wrap">
            {conditions?.map((c) => (
              <div key={c.id}>
                <Chip
                  label={c.code}
                  selected={selectedCondition === c.code}
                  onClick={() => toggleCondition(c.code)}
                />
              </div>
            ))}
            {selectedCondition && (
              <input type="hidden" name="condition" value={selectedCondition} />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
