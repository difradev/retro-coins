import { Libre_Caslon_Text } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const libreCaslonText = Libre_Caslon_Text({
  variable: '--font-caslon-text',
  weight: '400',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreCaslonText.className} antialiased text-blue-950 transition-all`}
      >
        <Toaster position="bottom-center" />
        <div className="flex w-4xl mx-auto">{children}</div>
      </body>
    </html>
  )
}
