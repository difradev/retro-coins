import type { Metadata } from 'next'
import { Libre_Caslon_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const libreCaslonDisplay = Libre_Caslon_Display({
  variable: '--font-caslon-display',
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Retro Coins',
  description: 'Find the right price for your retro games!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreCaslonDisplay.className} antialiased text-gray-900 transition-all`}
      >
        <Toaster position="bottom-center" />
        {children}
      </body>
    </html>
  )
}
