'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { GRADIENTS } from '@/lib/gradients'
import {
  loadPresets,
  savePreset,
  deletePreset,
  renamePreset,
  type PresetConfig,
  type SavedPreset,
} from '@/lib/presets'

type Props = {
  currentConfig: PresetConfig
  onApply: (config: PresetConfig) => void
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'Just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return new Date(ts).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

function GradientSwatch({ gradientId }: { gradientId: string }) {
  const g = GRADIENTS.find((g) => g.id === gradientId) ?? GRADIENTS[0]
  return (
    <div
      style={{
        width: 28,
        height: 18,
        borderRadius: 5,
        background: g.css,
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    />
  )
}

function PresetCard({
  preset,
  onApply,
  onDelete,
}: {
  preset: SavedPreset
  onApply: () => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(preset.name)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const g = GRADIENTS.find((g) => g.id === preset.config.gradientId) ?? GRADIENTS[0]
  const textCount = preset.config.textElements.length

  const commitRename = () => {
    renamePreset(preset.id, draftName)
    setEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -10, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl p-3 flex flex-col gap-2.5"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') { setDraftName(preset.name); setEditing(false) }
              }}
              onBlur={commitRename}
              className="w-full text-xs font-semibold px-1.5 py-0.5 rounded-md outline-none"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--accent-40)',
                color: 'var(--text)',
                fontFamily: 'var(--font-syne)',
              }}
            />
          ) : (
            <button
              onDoubleClick={() => setEditing(true)}
              className="text-xs font-semibold text-left truncate block w-full"
              style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)', cursor: 'text' }}
              title="Double-click to rename"
            >
              {preset.name}
            </button>
          )}
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {relativeTime(preset.createdAt)}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {confirmDelete ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <button
                onClick={onDelete}
                className="text-xs px-2 py-0.5 rounded-md font-semibold"
                style={{ background: '#ef444422', border: '1px solid #ef4444', color: '#ef4444', fontFamily: 'var(--font-syne)' }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ color: 'var(--muted)', border: '1px solid var(--border)', fontFamily: 'var(--font-syne)' }}
              >
                No
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="trash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(true)}
              className="p-1 rounded-md transition-opacity flex-shrink-0"
              style={{ color: 'var(--muted)', opacity: 0.45 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.45')}
              title="Delete"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 3h8M5 3V2h2v1M4.5 9.5V5M7.5 9.5V5M3 3l.5 7h5l.5-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2">
        <GradientSwatch gradientId={preset.config.gradientId} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {g.name}
        </span>
        <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          pad {preset.config.padding}%
        </span>
        {textCount > 0 && (
          <>
            <span style={{ color: 'var(--border)', fontSize: 10 }}>·</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {textCount} text
            </span>
          </>
        )}
      </div>

      {/* Apply button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onApply}
        className="w-full py-1.5 rounded-lg text-xs font-semibold"
        style={{
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-40)',
          color: 'var(--accent)',
          fontFamily: 'var(--font-syne)',
        }}
      >
        Apply
      </motion.button>
    </motion.div>
  )
}

export default function PresetsPanel({ currentConfig, onApply }: Props) {
  const [presets, setPresets] = useState<SavedPreset[]>([])
  const [name, setName] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    setPresets(loadPresets())
  }, [])

  const handleSave = () => {
    const label = name.trim() || `Preset ${presets.length + 1}`
    const saved = savePreset(label, currentConfig)
    setPresets((prev) => [saved, ...prev])
    setName('')
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1800)
  }

  const handleDelete = (id: string) => {
    deletePreset(id)
    setPresets((prev) => prev.filter((p) => p.id !== id))
  }

  const handleApply = (config: PresetConfig) => {
    // Reassign text IDs to avoid any stale selection state
    const freshConfig: PresetConfig = {
      ...config,
      textElements: config.textElements.map((el) => ({
        ...el,
        id: Math.random().toString(36).slice(2, 10),
      })),
    }
    onApply(freshConfig)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Save section */}
      <div className="flex flex-col gap-2">
        <label
          className="block text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          Save current
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder={`Preset ${presets.length + 1}`}
            className="flex-1 text-xs px-3 py-2 rounded-lg outline-none"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-syne)',
            }}
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 min-w-[52px] flex items-center justify-center"
            style={{
              background: justSaved ? 'var(--accent-soft)' : 'var(--accent)',
              border: justSaved ? '1px solid var(--accent-40)' : 'none',
              color: justSaved ? 'var(--accent)' : 'var(--on-accent)',
              fontFamily: 'var(--font-syne)',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {justSaved ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              'Save'
            )}
          </motion.button>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Saves gradient, padding, transform & text layout.
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
          >
            Saved ({presets.length})
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {presets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'var(--card)',
                border: '1px dashed var(--border)',
                color: 'var(--muted)',
                fontSize: '11px',
                lineHeight: 1.6,
              }}
            >
              No presets saved yet.
              <br />
              Configure your style and hit <strong style={{ color: 'var(--text)' }}>Save</strong>.
            </motion.div>
          ) : (
            presets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                onApply={() => handleApply(preset.config)}
                onDelete={() => handleDelete(preset.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
