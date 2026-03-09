'use client'

type TrendingSearchesProps = {
  searches: { rawQuery: string }[]
}

export function TrendingSearches(props: TrendingSearchesProps) {
  return (
    <div className="p-2 self-start w-full bg-blue-300 rounded-sm mb-8 border border-blue-950">
      <p className="text-sm uppercase font-semibold">Trending searches</p>
      <div className="flex flex-col gap-2 items-start mt-2">
        {props.searches.map((t) => (
          <p key={t.rawQuery} className="cursor-pointer">
            {t.rawQuery}
          </p>
        ))}
      </div>
    </div>
  )
}
