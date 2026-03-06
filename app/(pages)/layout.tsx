import type { Metadata } from 'next'
import { Libre_Caslon_Text } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const libreCaslonText = Libre_Caslon_Text({
  variable: '--font-caslon-text',
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
        className={`${libreCaslonText.className} antialiased text-gray-900 transition-all`}
      >
        <Toaster position="bottom-center" />
        <div className="flex w-4xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
