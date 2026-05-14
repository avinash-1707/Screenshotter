import type { Metadata } from 'next'
import { Bricolage_Grotesque, Outfit, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Screenshotter | Make Screenshots Beautiful',
    template: '%s | Screenshotter',
  },
  description: 'Wrap your screenshots in stunning gradient backgrounds. Adjust padding, roundness and transform then export at full resolution. No signup required.',
  keywords: ['screenshot', 'screenshot beautifier', 'gradient background', 'image editor', 'developer tool'],
  openGraph: {
    type: 'website',
    siteName: 'Screenshotter',
    title: 'Screenshotter | Make Screenshots Beautiful',
    description: 'Wrap your screenshots in stunning gradient backgrounds. No signup required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Screenshotter | Make Screenshots Beautiful',
    description: 'Wrap your screenshots in stunning gradient backgrounds. No signup required.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
