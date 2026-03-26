'use client'

import { formatDistance } from 'date-fns'
import { Young_Serif } from 'next/font/google'
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
        <p className="text-xs tracking-widest uppercase text-blue-300 mb-2">
          Real market price
        </p>
        <div className="absolute inset-1 border border-blue-300 pointer-events-none"></div>
        <div className="h-2 bg-blue-950 mb-2"></div>
        <p className="text-sm text-blue-300">
          Price for <span className="font-bold">CIB</span> condition
        </p>
        <div className="flex flex-col gap-4">
          <p
            className={`text-8xl font-bold mt-2 ${youngSerif.className} relative`}
          >
            {props.priceSnapshot.price} {currency}{' '}
            <span className="text-lg absolute">*</span>
          </p>
          <p className="text-sm">
            Most sales: {props.priceSnapshot.minPrice} {currency} -{' '}
            {props.priceSnapshot.maxPrice} {currency}
          </p>
        </div>
        <div className="mt-4 opacity-90">
          <p>
            Based on{' '}
            <span className="font-bold">{props.priceSnapshot.itemsCount}</span>{' '}
            tracked sales
          </p>
          <hr className="my-1 border border-blue-300" />
          <p className="text-xs">Last update {lastUpdate}</p>
        </div>
      </div>
      <p className="text-sm mt-2">
        *Prices are calculated using the median of recent sales. <br /> Extreme
        low and high values are removed to avoid distortions.
      </p>
    </div>
  )
}
