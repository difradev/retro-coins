'use client'

import { formatDistance } from 'date-fns'
import { Young_Serif } from 'next/font/google'
import { Tooltip } from 'react-tooltip'
import { PriceSnapshot } from '../generated/prisma/client'

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

type PriceProps = {
  priceSnapshot: PriceSnapshot
  info: { condition: string; region: string }
}

export function Price(props: PriceProps) {
  const currency = props.priceSnapshot.currency === 'EUR' ? '€' : '$'
  const lastUpdate = formatDistance(
    new Date(props.priceSnapshot.lastUpdate),
    new Date(),
    { addSuffix: true },
  )

  return (
    <div className="flex flex-col gap-1">
      <div
        className="bg-[#2247b5] text-white p-6 rounded-sm
            border-2 border-blue-950
            shadow-lg
            relative"
      >
        <div className="absolute inset-1 border border-blue-300 pointer-events-none"></div>
        <div className="h-2 bg-blue-950 mb-4"></div>
        <p className="text-xs tracking-widest uppercase text-blue-300">
          Market price - {props.info.condition} ({props.info.region})
        </p>
        <div className="flex flex-col gap-4">
          <p
            className={`text-8xl font-bold mt-2 ${youngSerif.className} price`}
          >
            {props.priceSnapshot.price} {currency}
          </p>
          <p>
            Most sales: {props.priceSnapshot.minPrice} {currency} -{' '}
            {props.priceSnapshot.maxPrice} {currency}
          </p>
        </div>
        <div className="mt-4 opacity-90">
          <p>Based on {props.priceSnapshot.itemsCount} tracked sales</p>
          <p className="text-xs">(Extreme values removed)</p>
          <hr className="my-1 border border-blue-300" />
          <p className="text-sm">Last update {lastUpdate}</p>
        </div>
      </div>
      <Tooltip anchorSelect=".price" place="top">
        Prices are calculated using the median of recent sales. <br /> Extreme
        low and high values are removed to avoid distortions.
      </Tooltip>
    </div>
  )
}
