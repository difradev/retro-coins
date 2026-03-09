'use client'

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { searchGames } from '../actions/search-games'
import {
  Condition,
  GameSuggestion,
  Platform,
  Region,
} from '../generated/prisma/client'
import { ErrorSearchGamesEnum } from '../lib/enums/ErrorSearchGamesEnum'
import Chip from './chip'
import { SearchbarSpinner } from './searchbar-spinner'

type SearchbarProps = {
  platforms: Platform[]
  conditions: Condition[]
  regions: Region[]
}

const placeholderTextsMap = new Map<number, string>()
  .set(0, 'Sonic the hedgehog')
  .set(1, 'Pokémon Blue')
  .set(2, 'Chrono Trigger')

export default function Searchbar({
  platforms,
  conditions,
  regions,
}: SearchbarProps): React.ReactNode {
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
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<GameSuggestion[]>([])
  const [searchPlaceholderTexts, setSearchPlaceholderTexts] =
    useState<string>('Pokémon Blue')

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus()
    }

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * placeholderTextsMap.size)
      setSearchPlaceholderTexts(placeholderTextsMap.get(randomIndex)!)
    }, 4000)

    return () => clearInterval(intervalId)
  }, [])

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
      setIsSearching(true)
      timeoutRef.current = setTimeout(async () => {
        const suggestionsResponse = await fetch(
          `/api/game/suggestion?q=${value}`,
        )
        const suggestions = await suggestionsResponse.json()
        setIsOpenSuggestions(!!suggestions.data)
        setSuggestions(suggestions.data)
        setIsSearching(false)
      }, 800)
    }

    if (!value.length) {
      setSuggestions([])
      setIsOpenSuggestions(false)
      setIsSearching(false)
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
      toast(
        'Game not found! Check back later to see if prices are available.',
        {
          style: {
            border: '1px solid #193cb8',
            padding: '16px',
            color: '#193cb8',
            fontSize: '18px',
            fontFamily: 'monospace',
          },
          icon: '',
        },
      )
    } else if (
      !result.success &&
      result.errorCode === ErrorSearchGamesEnum.GeneralError
    ) {
      toast.error('Oops!! There was a problem', {
        style: {
          border: '1px solid #193cb8',
          padding: '16px',
          color: '#193cb8',
          fontSize: '18px',
          fontFamily: 'monospace',
        },
      })
    }
  }

  return (
    <form action={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="relative">
          <div className="w-full flex gap-2">
            <input type="hidden" name="search-input" ref={hiddenSearchBarRef} />
            <label className="relative w-full">
              <input
                autoComplete="off"
                ref={searchBarRef}
                onChange={(e) => handleSearchbar(e.target.value)}
                type="text"
                className="w-full border-2 border-blue-950 outline-none p-4 rounded-sm placeholder:text-xl placeholder:text-gray-500 text-2xl"
                placeholder={`Search for ${searchPlaceholderTexts}`}
              />
              {isSearching && <SearchbarSpinner />}
            </label>
            <button
              type="submit"
              disabled={
                !gameSelected ||
                !selectedCondition ||
                !selectedPlatform ||
                !selectedRegion
              }
              className="py-2 px-4 flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 text-neutral-100 rounded-sm uppercase font-black cursor-pointer disabled:cursor-not-allowed border-l-8 border-[#2247b5] hover:border-yellow-400 hover:-translate-y-1 duration-200 active:translate-0 transition-all"
            >
              Start <span>►</span>
            </button>
          </div>
          {isOpenSuggestions ? (
            <div className="absolute top-full mt-1 bg-white shadow-lg rounded-sm z-10 max-h-44 overflow-auto w-full border border-blue-600">
              <div className="flex flex-col gap-2">
                {suggestions.length ? (
                  suggestions.map((s) => (
                    <p
                      className="cursor-pointer hover:bg-neutral-100 p-4 text-xl"
                      onClick={() => handleSelectGame(s.code, s.title)}
                      key={s.id}
                    >
                      {s.title}
                    </p>
                  ))
                ) : (
                  <p className="p-4 text-xl">No games found!</p>
                )}
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <p>Based on real sales • Median price • Outliers removed</p>
        <div className="h-2 bg-blue-950 my-2"></div>
        <div className="flex flex-col gap-4">
          {/* Chips for platforms */}
          <div className="flex flex-col gap-1">
            <p className="text-sm uppercase font-semibold">Platforms</p>
            <div className="flex gap-2 justify-items-start flex-wrap">
              {platforms?.map((p) => (
                <div key={p.id}>
                  <Chip
                    label={p.name}
                    selected={selectedPlatform === p.code}
                    onClick={() => togglePlatform(p.code)}
                  />
                </div>
              ))}
              {selectedPlatform && (
                <input type="hidden" name="platform" value={selectedPlatform} />
              )}
            </div>
          </div>
          {/* Chips for conditions */}
          <div className="flex flex-col gap-1">
            <p className="text-sm uppercase font-semibold">Conditions</p>
            <div className="flex gap-2 justify-items-start flex-wrap">
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
                <input
                  type="hidden"
                  name="condition"
                  value={selectedCondition}
                />
              )}
            </div>
          </div>
          {/* Chips for regions */}
          <div className="flex flex-col gap-1">
            <p className="text-sm uppercase font-semibold">Regions</p>
            <div className="flex gap-2 justify-items-start flex-wrap">
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
      </div>
    </form>
  )
}
