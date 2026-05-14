'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M7 1.5V2.8M7 11.2V12.5M1.5 7H2.8M11.2 7H12.5M3.11 3.11L4.04 4.04M9.96 9.96L10.89 10.89M3.11 10.89L4.04 9.96M9.96 4.04L10.89 3.11"
        stroke="currentColor" strokeWidth="1.35" strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M11.5 8.8A5.3 5.3 0 0 1 5.2 2.5a5.3 5.3 0 1 0 6.3 6.3Z"
        stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: 34, height: 34, borderRadius: '999px',
          background: 'var(--card)', border: '1px solid var(--border)',
          flexShrink: 0,
        }}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={className}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 34,
        height: 34,
        borderRadius: '999px',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* hover accent tint layer */}
      <motion.span
        aria-hidden
        initial={false}
        whileHover={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'var(--accent-soft)',
          opacity: 0,
          transition: 'opacity 0.18s',
          pointerEvents: 'none',
        }}
      />

      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={{ opacity: 0, rotate: -40, scale: 0.55 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1    }}
          exit={{    opacity: 0, rotate:  40, scale: 0.55 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
