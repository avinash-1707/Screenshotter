'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { GRADIENTS } from '@/lib/gradients'

function MiniScreenshot() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden"
      style={{ background: '#0e0f1c', border: '1px solid rgba(255,255,255,.1)', boxShadow: '0 4px 24px rgba(0,0,0,.5)' }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
          <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
        ))}
        <div className="ml-2 h-3 rounded-full" style={{ background: 'rgba(255,255,255,.07)', width: '90px' }} />
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,.15)', width: '80px' }} />
          <div className="h-6 w-16 rounded-lg" style={{ background: 'rgba(45,212,191,.25)', border: '1px solid rgba(45,212,191,.3)' }} />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['rgba(45,212,191,.15)', 'rgba(167,139,250,.15)', 'rgba(244,114,182,.15)'].map((bg, i) => (
            <div key={i} className="rounded-lg p-2.5" style={{ background: bg }}>
              <div className="h-2 rounded mb-1.5" style={{ background: 'rgba(255,255,255,.2)', width: '60%' }} />
              <div className="h-4 rounded" style={{ background: 'rgba(255,255,255,.3)' }} />
            </div>
          ))}
        </div>
        <div className="space-y-1.5 pt-1">
          {[0.72, 0.45, 0.88, 0.55].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ['#2dd4bf', '#a78bfa', '#f472b6', '#fb923c'][i] }} />
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${w * 100}%`, background: ['#2dd4bf', '#a78bfa', '#f472b6', '#fb923c'][i], opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SparkleIcon() {
  return (
    <motion.svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 0.95, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{ color: 'var(--accent)', flexShrink: 0 }}
    >
      <path
        d="M7 0.5L8.05 5.3L12.5 4.2L8.9 7L10.5 11.5L7 8.9L3.5 11.5L5.1 7L1.5 4.2L5.95 5.3L7 0.5Z"
        fill="currentColor"
      />
    </motion.svg>
  )
}

const SHOWCASE_GRADIENTS = [0, 3, 8, 6]

function TransformIllustration({ activeIdx }: { activeIdx: number }) {
  const currentGradient = GRADIENTS[SHOWCASE_GRADIENTS[activeIdx]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-5 mb-12 w-full"
    >
      {/* Before → After visual row */}
      <div className="flex items-center gap-3 sm:gap-6">

        {/* BEFORE card */}
        <div className="flex flex-col items-center gap-2">
          <div
            style={{
              width: 'clamp(110px, 18vw, 160px)',
              background: 'rgba(18, 20, 36, 0.88)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
              {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', background: c, opacity: 0.45 }} />
              ))}
              <div style={{ marginLeft: 6, height: 3, width: 48, borderRadius: 9, background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <div style={{ padding: 8, filter: 'grayscale(1) brightness(0.45) contrast(0.85)' }}>
              <MiniScreenshot />
            </div>
          </div>
          <span style={{
            fontSize: 9,
            fontFamily: 'var(--font-syne)',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            before
          </span>
        </div>

        {/* Transform arrow */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <SparkleIcon />
            <svg width="36" height="10" viewBox="0 0 36 10" fill="none">
              <path d="M0 5h30M24 1l6 4-6 4" stroke="url(#arrow-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="arrow-grad" x1="0" y1="0" x2="36" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--accent)" stopOpacity="0.2" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <span style={{
            fontSize: 9,
            fontFamily: 'var(--font-syne)',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}>
            enhance
          </span>
        </div>

        {/* AFTER card — gradient wraps the screenshot */}
        <div className="flex flex-col items-center gap-2">
          <div style={{ position: 'relative' }}>
            {/* Gradient layers cross-fade same as background */}
            <div style={{ position: 'relative', padding: 10, borderRadius: 14, overflow: 'hidden', boxShadow: '0 10px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.13)' }}>
              {SHOWCASE_GRADIENTS.map((gIdx, i) => (
                <div
                  key={gIdx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: GRADIENTS[gIdx].css,
                    opacity: i === activeIdx ? 1 : 0,
                    transition: 'opacity 1.6s cubic-bezier(0.4,0,0.2,1)',
                    borderRadius: 14,
                  }}
                />
              ))}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 'clamp(110px, 18vw, 160px)',
                  background: 'rgba(13, 14, 26, 0.91)',
                  border: '1px solid rgba(255,255,255,0.13)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.45)',
                }}
              >
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                    <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />
                  ))}
                  <div style={{ marginLeft: 6, height: 3, width: 48, borderRadius: 9, background: 'rgba(255,255,255,0.1)' }} />
                </div>
                <div style={{ padding: 8 }}>
                  <MiniScreenshot />
                </div>
              </div>
            </div>

            {/* Glow ring that matches active gradient accent */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: -3,
                borderRadius: 17,
                background: 'transparent',
                border: '1px solid var(--accent-35)',
                pointerEvents: 'none',
              }}
            />
          </div>
          <span style={{
            fontSize: 9,
            fontFamily: 'var(--font-syne)',
            color: 'var(--accent)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            after
          </span>
        </div>

      </div>

      {/* Step pills */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {[
          { label: 'Upload', symbol: '↑' },
          { label: 'Pick gradient', symbol: '◈' },
          { label: 'Export HD', symbol: '↓' },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-1.5 sm:gap-2">
            <div
              style={{
                fontSize: 'clamp(9px, 1.8vw, 11px)',
                fontFamily: 'var(--font-syne)',
                color: 'rgba(255,255,255,0.55)',
                background: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '3px 9px',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 9, color: 'var(--accent)', opacity: 0.9 }}>{step.symbol}</span>
              {step.label}
            </div>
            {i < 2 && (
              <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 9 }}>→</span>
            )}
          </div>
        ))}
      </div>

    </motion.div>
  )
}

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % SHOWCASE_GRADIENTS.length), 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-20">
      {/* Live gradient layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SHOWCASE_GRADIENTS.map((gIdx, i) => (
          <div
            key={gIdx}
            style={{
              position: 'absolute',
              inset: 0,
              background: GRADIENTS[gIdx].css,
              opacity: i === activeIdx ? 1 : 0,
              transition: 'opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 75% 60% at 50% 40%, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.22) 55%, transparent 75%)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Transformation illustration */}
        <TransformIllustration activeIdx={activeIdx} />

        {/* Main heading */}
        <div className="mb-8 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="text-base sm:text-lg mb-1"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-syne)', fontWeight: 400, textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}
          >
            The fastest way to make your screenshots
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="font-extrabold leading-none tracking-tight"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: 'clamp(56px, 9vw, 120px)',
                textShadow: '0 2px 32px rgba(0,0,0,0.7)',
              }}
            >
              <span style={{ color: '#ffffff' }}>beautiful.</span>
            </motion.h1>
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <Link href="/dashboard">
            <motion.span
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
              style={{
                background: 'var(--accent)',
                color: 'var(--on-accent)',
                fontFamily: 'var(--font-syne)',
                boxShadow: '0 0 0 1px var(--accent-35), 0 6px 28px var(--accent-20)',
              }}
            >
              Open App
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </Link>
          <motion.a
            href="#gradients"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff',
              fontFamily: 'var(--font-syne)',
              backdropFilter: 'blur(12px)',
            }}
          >
            Explore gradients ↓
          </motion.a>
        </motion.div>

        {/* Gradient showcase cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {SHOWCASE_GRADIENTS.map((gIdx, i) => {
            const g = GRADIENTS[gIdx]
            const isActive = i === activeIdx
            return (
              <motion.div
                key={g.id}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  aspectRatio: '4/3',
                  background: g.css,
                  outline: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  outlineOffset: '2px',
                  boxShadow: isActive ? `0 0 24px var(--accent-25)` : '0 4px 20px rgba(0,0,0,.4)',
                  transition: 'outline 0.4s, box-shadow 0.4s',
                }}
                onClick={() => setActiveIdx(i)}
              >
                <div className="absolute inset-4 sm:inset-5">
                  <MiniScreenshot />
                </div>
                <div
                  className="absolute bottom-2 left-2 right-2 text-center text-xs font-medium py-1 rounded-lg"
                  style={{
                    background: 'rgba(0,0,0,.35)',
                    backdropFilter: 'blur(8px)',
                    color: 'rgba(255,255,255,.8)',
                    fontFamily: 'var(--font-syne)',
                    fontSize: '10px',
                  }}
                >
                  {g.name}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Indicator dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-2 mt-4"
        >
          {SHOWCASE_GRADIENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIdx ? '20px' : '6px',
                height: '6px',
                background: i === activeIdx ? 'var(--accent)' : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
