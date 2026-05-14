'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { GRADIENTS } from '@/lib/gradients'

export default function GradientShowcase() {
  return (
    <section id="gradients" className="py-32 px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)', fontFamily: 'var(--font-syne)', letterSpacing: '0.12em' }}>
            Gradient library
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            10 hand-crafted backgrounds.
          </h2>
          <p className="text-base mt-4 max-w-md leading-relaxed" style={{ color: 'var(--muted)' }}>
            Radial mesh, layered orbs, and conic blends. Dark and light. Each designed specifically for screenshots.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GRADIENTS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className="w-full rounded-2xl cursor-pointer"
                  style={{
                    aspectRatio: '4/3',
                    background: g.css,
                    boxShadow: '0 4px 20px rgba(0,0,0,.35)',
                  }}
                />
                <p
                  className="text-xs text-center mt-2 font-medium"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
                >
                  {g.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/dashboard">
            <motion.span
              whileHover={{ scale: 1.03, filter: 'brightness(1.08)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-sm cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                color: '#fff',
                fontFamily: 'var(--font-syne)',
                boxShadow: '0 6px 32px rgba(45,212,191,.2)',
              }}
            >
              Try it now, free, no signup
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7 2l4.5 4.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
