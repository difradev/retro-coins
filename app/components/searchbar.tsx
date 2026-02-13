'use client'

import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/solid'
import { useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useDebouncedCallback } from 'use-debounce'

type AutocompleteOptions = {
  slug: string
  label: string
}

export default function Searchbar() {
  const { pending } = useFormStatus()
  const inputQueryRef = useRef<HTMLInputElement>(null)
  const [isOpenSuggestion, setIsOpenSuggestion] = useState(false)
  const [isSelectValueFromSuggestion, setIsSelectValueFromSuggestion] =
    useState(false)
  const [autocompleteData, setAutocompleteData] = useState(
    [] as AutocompleteOptions[],
  )

  const handleDebounce = useDebouncedCallback(async (query) => {
    const normalizedQuery = query.split(' ').join('-').toLowerCase()
    // TODO: Capire come cachare la response!
    const response = await fetch(`/api/suggestions?q=${normalizedQuery}`)
    try {
      return response.json()
    } catch (error) {
      console.error('Error:', error)
    }
  }, 200)

  const handleSearchInput = async (query: string) => {
    setIsSelectValueFromSuggestion(false)
    const minimalQueryLength = query.length >= 4

    if (minimalQueryLength) {
      const response = await handleDebounce(query)
      if (response && response.success) {
        const suggestions = response.data.map((d: any) => {
          return {
            slug: d.slug,
            label: d.name,
          }
        }) as AutocompleteOptions[]
        setAutocompleteData(suggestions)
        setIsOpenSuggestion(true)
      }
    } else {
      setAutocompleteData([])
    }
  }

  const handleSelectGameFromSuggest = (suggestion: AutocompleteOptions) => {
    setIsOpenSuggestion(false)

    if (inputQueryRef.current) {
      inputQueryRef.current.value = suggestion.label
      setIsSelectValueFromSuggestion(true)
    }
  }

  return (
    <div className="flex items-center transition-all w-1/3">
      <div className="flex flex-col gap-2 relative w-full">
        <div className="flex gap-2">
          <input
            ref={inputQueryRef}
            type="text"
            name="query"
            required
            placeholder={
              pending ? 'Searching..' : 'Search retrogame price now!'
            }
            onChange={(e) => handleSearchInput(e.target.value)}
            className="p-4 rounded-md border border-foreground w-full outline-none text-xl text-foreground"
          />
          <button
            className="outline-none border-none bg-blue-700 text-white rounded-md px-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!isSelectValueFromSuggestion}
            type="submit"
          >
            Search!
          </button>
        </div>
        {isOpenSuggestion && (
          <div className="absolute top-full mt-1 w-full bg-white border border-foreground rounded-md shadow-lg z-10">
            <div className="p-2">
              <ul>
                {autocompleteData.length ? (
                  autocompleteData.map((suggestion) => (
                    <li
                      key={suggestion.label}
                      onClick={() => handleSelectGameFromSuggest(suggestion)}
                      className="hover:bg-gray-100 p-2 cursor-pointer rounded-sm"
                    >
                      {suggestion.label}
                    </li>
                  ))
                ) : (
                  <li>Ops..no games found!</li>
                )}
              </ul>
            </div>
          </div>
        )}
        <div
          className={`text-xs transition-all duration-200 ease-in absolute ${
            isSelectValueFromSuggestion
              ? 'opacity-100 translate-y-1 top-full mt-2'
              : 'opacity-0 translate-y'
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
    </div>
  )
}
