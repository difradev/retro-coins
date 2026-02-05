'use client'

import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'

export default function Searchbar() {
  const { pending } = useFormStatus()
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true)

  function handleSearchInput(query: string) {
    // TODO: Toggle autosuggest here?
    const minimalQueryLength = query.length >= 5
    setIsTyping(minimalQueryLength)
    setIsSubmitEnabled(!minimalQueryLength)
  }

  return (
    <div className="flex items-center transition-all w-1/3">
      <div className="flex flex-col gap-2 relative w-full">
        <div
          className={`text-xs transition-all duration-200 ease-in ${
            isTyping ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-2'
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
        <div className="flex gap-2">
          <input
            type="text"
            name="query"
            required
            placeholder={pending ? 'Searching..' : 'Search retrogame price now!'}
            onChange={(e) => handleSearchInput(e.target.value)}
            className="p-4 rounded-md border border-foreground w-full outline-none text-xl text-foreground"
          />
          <button
            className="outline-none border-none bg-blue-700 text-white rounded-md px-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitEnabled}
            type="submit"
          >
            GO!
          </button>
        </div>
      </div>
    </div>
  )
}
