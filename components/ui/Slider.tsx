'use client'

type Props = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          {label}
        </label>
        <span
          className="text-xs px-2 py-0.5 rounded font-mono"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-ew-resize"
        style={{
          background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) 0%)`,
        }}
      />
    </div>
  )
}
