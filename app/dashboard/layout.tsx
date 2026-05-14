import type { Metadata } from 'next'
import { Playfair_Display, Space_Mono, Bebas_Neue, Pacifico } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
  display: 'swap',
})
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: '400',
  display: 'swap',
})
const pacifico = Pacifico({
  subsets: ['latin'],
  variable: '--font-pacifico',
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dashboard — Screenshotter',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${playfair.variable} ${spaceMono.variable} ${bebasNeue.variable} ${pacifico.variable}`}
      style={{ display: 'contents' }}
    >
      {/* Invisible font preload elements so browsers eagerly load these */}
      <span style={{ fontFamily: '"Playfair Display"', position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>x</span>
      <span style={{ fontFamily: '"Space Mono"', position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>x</span>
      <span style={{ fontFamily: '"Bebas Neue"', position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>x</span>
      <span style={{ fontFamily: '"Pacifico"', position: 'absolute', opacity: 0, pointerEvents: 'none', fontSize: '1px' }}>x</span>
      {children}
    </div>
  )
}
