'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type RegionProps = {
  regions: {
    id: number
    code: string
  }[]
  region: number
}

export function Regions(props: RegionProps) {
  const [selectedRegion, setSelectedRegion] = useState<number>()
  const router = useRouter()

  useEffect(() => {
    setSelectedRegion(props.region)
  }, [props.region])

  const handleSelectRegion = (idRegion: number) => {
    router.push(`?region=${idRegion}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">Available regions</p>
      <div className="flex gap-1">
        {props.regions.map((r) => (
          <button
            key={r.id}
            onClick={() => handleSelectRegion(r.id)}
            className={`${selectedRegion === r.id && 'bg-[#2247b5] text-white'} p-2 rounded-sm border-2 border-blue-950 cursor-pointer font-bold`}
          >
            {r.code}
          </button>
        ))}
      </div>
    </div>
  )
}
