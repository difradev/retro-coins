'use client'

import { useState } from 'react'
import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/solid'

export default function Searchbar() {
  const [isTyping, setIsTyping] = useState(false)

  function handleSearchInput(query: string) {
    setIsTyping(query.length >= 5)
  }

  return (
    <div className="flex items-center transition-all w-1/3">
      <div className="flex flex-col gap-2 relative w-full">
        <input
          type="text"
          placeholder="Search games!"
          onChange={(e) => handleSearchInput(e.target.value)}
          className="p-4 rounded-2xl border-3 border-white w-full outline-0 text-xl text-foreground"
        />

        <div
          className={`ml-2 text-xs transition-all duration-200 ease-in ${
            isTyping ? 'opacity-100 translate-y-1' : 'opacity-0 -translate-y-2'
          }`}
        >
          <p className="flex gap-2 items-center ">
            Push
            <span className="border border-foreground p-1 rounded-lg">
              <ArrowTurnDownLeftIcon className="size-6" />
            </span>
            to search!
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <select>
          <option value="1">PAL</option>
        </select>
        <select>
          <option value="1">LOOSE</option>
        </select>
      </div>
    </div>
  )
}
