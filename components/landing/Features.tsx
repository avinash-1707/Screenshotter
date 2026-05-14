'use client'

import { motion } from 'motion/react'

const STEPS = [
  {
    num: '01',
    title: 'Upload',
    desc: 'Drop, click, or paste (⌘V) any screenshot. PNG, JPEG, and WebP are all supported.',
    color: 'var(--accent)',
  },
  {
    num: '02',
    title: 'Customize',
    desc: 'Choose from 10 gradient presets. Adjust padding, roundness, skew, rotation, and add text.',
    color: 'var(--accent-2)',
  },
  {
    num: '03',
    title: 'Download',
    desc: 'Export as full-resolution PNG. What you see is exactly what you get.',
    color: 'var(--accent-3)',
  },
]

const FEATURES_SMALL = [
  { icon: '⬡', label: 'Radial mesh gradients' },
  { icon: '◎', label: 'Conic & layered orbs' },
  { icon: '◈', label: 'Dark + light themes' },
  { icon: '⟢', label: 'Skew & rotation' },
  { icon: 'T', label: 'Text overlay tool' },
  { icon: '↓', label: 'Full-res PNG export' },
]

export default function Features() {
  return (
    <section
      id="features"
      className="py-32 px-6"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-20"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)', fontFamily: 'var(--font-syne)', letterSpacing: '0.12em' }}>
            How it works
          </p>
          <h2
            className="text-3xl sm:text-5xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Three steps to a<br className="hidden sm:block" /> beautiful screenshot.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-px" style={{ background: 'var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col gap-6 p-9"
              style={{ background: 'var(--card)' }}
            >
              <span
                className="text-5xl font-extrabold leading-none"
                style={{ fontFamily: 'var(--font-syne)', color: step.color, opacity: 0.7 }}
              >
                {step.num}
              </span>
              <div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-loose" style={{ color: 'var(--muted)' }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2.5 mt-12"
        >
          {FEATURES_SMALL.map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                fontFamily: 'var(--font-syne)',
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ color: 'var(--accent)', fontSize: '11px' }}>{f.icon}</span>
              {f.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
