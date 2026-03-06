/**
 * TODO
 *
 * - rivedere campo last update
 */

'use client'

import { Young_Serif } from 'next/font/google'
import { PriceSnapshot } from '../generated/prisma/client'

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

type PriceProps = {
  priceSnapshot: PriceSnapshot
}

export function Price(props: PriceProps) {
  return (
    <div
      className="bg-[#2247b5] text-white p-6 rounded-sm
            border-2 border-blue-950
            shadow-lg
            relative"
    >
      <div className="absolute inset-1 border border-blue-300 pointer-events-none"></div>
      <div className="h-2 bg-blue-950 mb-4"></div>
      <p className="text-xs tracking-widest uppercase text-blue-300">
        Average Price
      </p>
      <p className={`text-8xl font-bold mt-2 ${youngSerif.className}`}>
        {props.priceSnapshot.price}{' '}
        {props.priceSnapshot.currency === 'EUR' ? '€' : '$'}
      </p>
      <div className="mt-4 text-sm opacity-90">
        <p>Based on {props.priceSnapshot.itemsCount} sales</p>
        <hr className='my-1 border border-blue-300' />
        <p>Last update {props.priceSnapshot.lastUpdate.toDateString()}</p>
      </div>
    </div>
  )
}
