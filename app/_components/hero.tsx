'use client'

import { Young_Serif } from 'next/font/google'

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

export default function Hero(): React.ReactNode {
  return (
    <div className="w-full pt-56.5 flex flex-col">
      <p className="text-2xl">For all retro gamers!</p>
      <h1
        className={`font-black text-9xl text-blue-800 ${youngSerif.className}`}
      >
        RetroCoins!
      </h1>
      <p className="text-4xl font-semibold">
        Find the right price for your retro games!
      </p>
    </div>
  )
}
