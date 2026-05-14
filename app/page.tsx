import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import GradientShowcase from '@/components/landing/GradientShowcase'
import Link from 'next/link'

function Footer() {
  return (
    <footer
      className="py-10 px-6 text-center text-sm"
      style={{ borderTop: '1px solid var(--border)', color: 'var(--muted)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 600, color: 'var(--text)' }}>
          Screenshotter
        </span>
        <span>Make your screenshots beautiful. No signup required.</span>
        <Link href="/dashboard" style={{ color: 'var(--accent)' }}>
          Open App →
        </Link>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <GradientShowcase />
      <Footer />
    </main>
  )
}
