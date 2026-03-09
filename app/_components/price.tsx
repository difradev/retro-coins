/**
 * TODO
 *
 * - rivedere campo last update
 */

'use client'

import { Young_Serif } from 'next/font/google'
import { PriceSnapshot } from '../generated/prisma/client'
import { Tooltip } from 'react-tooltip'

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

type PriceProps = {
  priceSnapshot: PriceSnapshot
  info: { condition: string; region: string }
}

export function Price(props: PriceProps) {
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
          Typical market price - {props.info.condition} ({props.info.region})
        </p>
        <p className={`text-8xl font-bold mt-2 ${youngSerif.className} price`}>
          {props.priceSnapshot.price}{' '}
          {props.priceSnapshot.currency === 'EUR' ? '€' : '$'}
        </p>
        <div className="mt-4 text-sm opacity-90">
          <p>Based on {props.priceSnapshot.itemsCount} tracked sales</p>
          <p>(Outliers removed)</p>
          <hr className="my-1 border border-blue-300" />
          <p>Last update {props.priceSnapshot.lastUpdate.toDateString()}</p>
        </div>
      </div>
      <Tooltip anchorSelect=".price" place="top">
        Price based on recent sales with extreme values removed
      </Tooltip>
    </div>
  )
}
