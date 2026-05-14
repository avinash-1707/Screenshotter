'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'var(--card)', border: '1px solid var(--border)',
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
        width: '32px', height: '32px', borderRadius: '8px',
        background: 'var(--card)', border: '1px solid var(--border)',
        color: 'var(--muted)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
      }}
    >
      {isDark ? (
        /* Sun */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 12.07l1.06-1.06M10.01 4.99l1.06-1.06"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ) : (
        /* Moon */
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M12 9.5A6 6 0 0 1 4.5 2a6 6 0 1 0 7.5 7.5Z"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  )
}
