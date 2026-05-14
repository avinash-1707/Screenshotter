'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1"
      style={{
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '100px',
        padding: '6px 6px 6px 18px',
        boxShadow: '0 8px 32px var(--shadow), 0 0 0 1px var(--invert-5)',
      }}
    >
      <Link href="/" className="flex items-center gap-2 mr-2">
        <div
          className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', fontFamily: 'var(--font-syne)', fontSize: '10px' }}
        >
          S
        </div>
        <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}>
          Screenshotter
        </span>
      </Link>

      <div className="hidden sm:flex items-center gap-1 mr-1">
        <a
          href="#features"
          className="text-xs px-3 py-2 rounded-full transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          Features
        </a>
        <a
          href="#gradients"
          className="text-xs px-3 py-2 rounded-full transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          Gradients
        </a>
      </div>

      <ThemeToggle />

      <Link href="/dashboard">
        <motion.span
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full cursor-pointer ml-1"
          style={{
            background: 'var(--accent)',
            color: 'var(--on-accent)',
            fontFamily: 'var(--font-syne)',
          }}
        >
          Open App
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </Link>
    </motion.nav>
  )
}
