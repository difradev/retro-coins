'use client'

import { Young_Serif } from 'next/font/google'

const youngSerif = Young_Serif({
  variable: '--font-young-serif',
  weight: '400',
})

export default function Hero(): React.ReactNode {
  return (
    <div className="w-full flex flex-col">
      <p className="text-2xl">For all retro-gamers!</p>
      <h1
        className={`font-black text-9xl text-[#2247b5] ${youngSerif.className}`}
      >
        RetroCoins!
      </h1>
      <p className="text-4xl font-semibold">
        Accurate retro game prices based on real market sales
      </p>
    </div>
  )
}
