import type { Metadata } from 'next'
import { Syne, Outfit } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Screenshotter — Beautiful Screenshot Backgrounds',
  description: 'Wrap your screenshots in stunning gradient backgrounds. Adjust size, roundness, and download in one click.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${syne.variable} ${outfit.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
