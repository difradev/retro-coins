'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.focus()
    }
  }, [searchBarRef])

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full flex gap-2">
        <input
          ref={searchBarRef}
          type="text"
          className="w-full border-2 border-blue-600 outline-none p-4 rounded-md placeholder:text-xl placeholder:text-gray-500 text-2xl"
          placeholder="Awesome 8-bit game.."
        />
        <button className="py-2 px-4 text-xl bg-red-600 text-neutral-100 rounded-md uppercase font-black cursor-pointer">
          Search
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {/* Chips for platforms */}
        <p className="text-sm uppercase font-semibold">Platforms</p>
        <div className="flex gap-1 justify-items-start">
          {platforms?.map((p) => (
            <Chip label={p.code} key={p.id} />
          ))}
        </div>
        {/* Chips for conditions */}
        <p className="text-sm uppercase font-semibold">Conditions</p>
        <div className="flex gap-1 justify-items-start">
          {conditions?.map((c) => (
            <Chip label={c.code} key={c.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
