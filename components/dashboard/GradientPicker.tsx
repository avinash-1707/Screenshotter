'use client'

import { GRADIENTS } from '@/lib/gradients'

type Props = {
  selectedId: string
  onChange: (id: string) => void
}

export default function GradientPicker({ selectedId, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-3" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Background
      </label>
      <div className="grid grid-cols-5 gap-2">
        {GRADIENTS.map((g) => {
          const selected = g.id === selectedId
          return (
            <button
              key={g.id}
              title={g.name}
              onClick={() => onChange(g.id)}
              className="relative rounded-xl transition-all duration-200 hover:scale-[1.08]"
              style={{
                aspectRatio: '1',
                background: g.css,
                outline: selected ? '2px solid var(--accent)' : '2px solid transparent',
                outlineOffset: '2px',
                boxShadow: selected ? `0 0 12px var(--accent-30)` : 'none',
                cursor: 'pointer',
              }}
            >
              {selected && (
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--overlay-sm)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
      <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>
        {GRADIENTS.find((g) => g.id === selectedId)?.name}
      </p>
    </div>
  )
}
