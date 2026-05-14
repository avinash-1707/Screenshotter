'use client'

import { Slider } from '@/components/ui/Slider'
import { motion, AnimatePresence } from 'motion/react'
import type { Transform } from '@/lib/types'

type Props = {
  transform: Transform
  onChange: (partial: Partial<Transform>) => void
}

type Preset = {
  label: string
  values: Partial<Transform>
}

const PRESETS: Preset[] = [
  { label: 'Flat',        values: { skewX: 0,  skewY: 0,  rotate: 0  } },
  { label: 'Tilt Left',   values: { skewX: -3, skewY: 0,  rotate: 0  } },
  { label: 'Tilt Right',  values: { skewX: 3,  skewY: 0,  rotate: 0  } },
  { label: 'Lean Back',   values: { skewX: 0,  skewY: -3, rotate: 0  } },
  { label: 'Lean Fwd',    values: { skewX: 0,  skewY: 3,  rotate: 0  } },
  { label: '3D Left',     values: { skewX: -4, skewY: 2,  rotate: -1 } },
  { label: '3D Right',    values: { skewX: 4,  skewY: 2,  rotate: 1  } },
  { label: 'Warp',        values: { skewX: 3,  skewY: 2,  rotate: 0  } },
]

function isActivePreset(transform: Transform, preset: Preset) {
  return (
    (preset.values.skewX ?? 0) === transform.skewX &&
    (preset.values.skewY ?? 0) === transform.skewY &&
    (preset.values.rotate ?? 0) === transform.rotate
  )
}

export default function TransformControls({ transform, onChange }: Props) {
  const hasAnyTransform =
    transform.skewX !== 0 || transform.skewY !== 0 ||
    transform.rotate !== 0 || transform.offsetX !== 0 || transform.offsetY !== 0

  return (
    <div className="flex flex-col gap-5">
      {/* Presets */}
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          Presets
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((preset) => {
            const active = isActivePreset(transform, preset)
            return (
              <motion.button
                key={preset.label}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onChange(preset.values)}
                className="py-1.5 px-1 rounded-lg text-xs font-medium text-center transition-colors"
                style={{
                  background: active ? 'var(--accent-soft)' : 'var(--card)',
                  border: `1px solid ${active ? 'var(--accent-40)' : 'var(--border)'}`,
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  fontFamily: 'var(--font-syne)',
                  fontSize: '10px',
                }}
              >
                {preset.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
        <div className="flex flex-col gap-5">
          <Slider label="Skew X" value={transform.skewX} min={-40} max={40} unit="°" onChange={(v) => onChange({ skewX: v })} />
          <Slider label="Skew Y" value={transform.skewY} min={-40} max={40} unit="°" onChange={(v) => onChange({ skewY: v })} />
          <Slider label="Rotate" value={transform.rotate} min={-45} max={45} unit="°" onChange={(v) => onChange({ rotate: v })} />
        </div>
      </div>

      {/* Hint */}
      <div
        className="rounded-xl p-3 text-xs"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        <p className="mb-1 font-medium" style={{ color: 'var(--text)' }}>Drag to reposition</p>
        Grab the image on the canvas to offset it. Drag text elements to reposition them.
      </div>

      {/* Reset */}
      <AnimatePresence>
        {hasAnyTransform && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange({ skewX: 0, skewY: 0, rotate: 0, offsetX: 0, offsetY: 0 })}
            className="w-full py-2 rounded-lg text-xs font-semibold"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              fontFamily: 'var(--font-syne)',
            }}
          >
            Reset transforms
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
