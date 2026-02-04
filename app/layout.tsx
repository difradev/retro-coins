import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Retro Coins',
  description: 'TBD',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>
        <div className="h-[calc(100vh-56px)]">{children}</div>
      </body>
    </html>
  )
}
