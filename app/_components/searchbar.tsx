'use client'

import { useEffect, useRef, useState } from 'react'
import { searchGames } from '../actions/search-games'
import {
  Condition,
  GameSuggestion,
  Platform,
  Region,
} from '../generated/prisma/client'
import { ErrorSearchGamesEnum } from '../lib/enums/ErrorSearchGamesEnum'
import Chip from './chip'

type SearchbarPros = {
  platforms: Platform[]
  conditions: Condition[]
  regions: Region[]
}

export default function SearchBar({
  platforms,
  conditions,
  regions,
}: SearchbarPros): React.ReactNode {
  const searchBarRef = useRef<HTMLInputElement>(null)
  const hiddenSearchBarRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null,
  )
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [gameSelected, setGameSelected] = useState<boolean>(false)
  const [isOpenSuggestions, setIsOpenSuggestions] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([])

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus()
    }
  }, [searchBarRef])

  const ripristineChips = () => {
    setSelectedCondition(null)
    setSelectedRegion(null)
    setSelectedPlatform(null)
  }

  const togglePlatform = (code: string) => {
    setSelectedPlatform((prev) => (prev === code ? null : code))
  }

  const toggleCondition = (code: string) => {
    setSelectedCondition((prev) => (prev === code ? null : code))
  }

  const toggleRegion = (code: string) => {
    setSelectedRegion((prev) => (prev === code ? null : code))
  }

  const handleSearchbar = async (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (value.length >= 3) {
      timeoutRef.current = setTimeout(async () => {
        const suggestionsResponse = await fetch(
          `/api/game/suggestion?q=${value}`,
        )
        const suggestions = await suggestionsResponse.json()
        setIsOpenSuggestions(!!suggestions.data)
        setSuggestions(suggestions.data)
      }, 800)
    }

    if (!value.length) {
      setSuggestions([])
      setIsOpenSuggestions(false)
    }
  }

  const handleSelectGame = (gameCode: string, gameTitle: string) => {
    setGameSelected(true)
    setIsOpenSuggestions(false)
    if (searchBarRef.current && hiddenSearchBarRef.current) {
      searchBarRef.current.value = gameTitle
      hiddenSearchBarRef.current.value = gameCode
    }
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await searchGames(formData)
    ripristineChips()

    if (
      !result.success &&
      result.errorCode === ErrorSearchGamesEnum.GameNotFound
    ) {
      // TODO: Alert with message info!
    } else if (
      !result.success &&
      result.errorCode === ErrorSearchGamesEnum.GeneralError
    ) {
      // TODO: Alert with general error!
    } else if (result.success) {
      console.log('redirect to', result.gameId)
    }
  }

  return (
    <form action={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="relative">
          <div className="w-full flex gap-2">
            <input type="hidden" name="search-input" ref={hiddenSearchBarRef} />
            <input
              autoComplete="off"
              ref={searchBarRef}
              onChange={(e) => handleSearchbar(e.target.value)}
              type="text"
              className="w-full border-2 border-blue-600 outline-none p-4 rounded-md placeholder:text-xl placeholder:text-gray-500 text-2xl"
              placeholder="Search awesome 8-bit game.."
            />
            <button
              type="submit"
              disabled={
                !gameSelected ||
                !selectedCondition ||
                !selectedPlatform ||
                !selectedRegion
              }
              className="py-2 px-4 text-xl bg-red-600 text-neutral-100 rounded-md uppercase font-black cursor-pointer hover:opacity-80 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
          {isOpenSuggestions ? (
            <div className="absolute top-full mt-1 bg-white shadow-lg rounded-md z-10 max-h-44 overflow-auto w-full border border-blue-600">
              <div className="flex flex-col gap-2">
                {suggestions.length
                  ? suggestions.map((s) => (
                      <p
                        className="cursor-pointer hover:bg-neutral-100 p-4 text-xl"
                        onClick={() => handleSelectGame(s.code, s.title)}
                        key={s.id}
                      >
                        {s.title}
                      </p>
                    ))
                  : ''}
              </div>
            </div>
          ) : (
            ''
          )}
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
          {/* Chips for regions */}
          <p className="text-sm uppercase font-semibold">Regions</p>
          <div className="flex gap-1 justify-items-start flex-wrap">
            {regions?.map((r) => (
              <div key={r.id}>
                <Chip
                  label={r.code}
                  selected={selectedRegion === r.code}
                  onClick={() => toggleRegion(r.code)}
                />
              </div>
            ))}
            {selectedRegion && (
              <input type="hidden" name="region" value={selectedRegion} />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
