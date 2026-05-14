'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Slider } from '@/components/ui/Slider'
import { TEXT_FONTS, TEXT_COLORS, type TextElement } from '@/lib/types'

type DraftState = {
  text: string
  fontFamily: string
  fontSize: number
  color: string
  bold: boolean
  italic: boolean
}

type Props = {
  textElements: TextElement[]
  selectedTextId: string | null
  editingTextId: string | null
  onAdd: (draft: Omit<TextElement, 'id' | 'x' | 'y'>) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<TextElement>) => void
  onEditStart: (id: string) => void
}

const DEFAULT_DRAFT: DraftState = {
  text: '',
  fontFamily: 'Syne',
  fontSize: 48,
  color: '#ffffff',
  bold: false,
  italic: false,
}

function FontPicker({ value, onChange }: { value: string; onChange: (f: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}>
        Font
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TEXT_FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.family)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all"
            style={{
              background: value === f.family ? 'var(--accent-soft)' : 'var(--card)',
              border: `1px solid ${value === f.family ? 'var(--accent-40)' : 'var(--border)'}`,
              minWidth: '48px',
            }}
          >
            <span className="text-lg leading-none" style={{ fontFamily: `"${f.family}"`, color: value === f.family ? 'var(--accent)' : 'var(--text)' }}>
              Aa
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '9px', whiteSpace: 'nowrap' }}>
              {f.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}>
        Color
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {TEXT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="w-6 h-6 rounded-full transition-all hover:scale-110 flex-shrink-0"
            style={{
              background: c,
              outline: value === c ? '2px solid var(--accent)' : '2px solid transparent',
              outlineOffset: '2px',
            }}
          />
        ))}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded-full cursor-pointer flex-shrink-0"
          style={{ border: '1px solid var(--border)', padding: 0 }}
          title="Custom color"
        />
      </div>
    </div>
  )
}

function StyleToggles({ bold, italic, onBoldChange, onItalicChange }: { bold: boolean; italic: boolean; onBoldChange: (v: boolean) => void; onItalicChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      {([['Bold', bold, onBoldChange, 700, 'normal'], ['Italic', italic, onItalicChange, 400, 'italic']] as const).map(([label, active, set, fw, fi]) => (
        <button
          key={label}
          onClick={() => set(!active)}
          className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: active ? 'var(--accent-soft)' : 'var(--card)',
            border: `1px solid ${active ? 'var(--accent-40)' : 'var(--border)'}`,
            color: active ? 'var(--accent)' : 'var(--muted)',
            fontWeight: fw,
            fontStyle: fi,
            fontFamily: 'var(--font-syne)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function TextPanel({
  textElements, selectedTextId, editingTextId,
  onAdd, onRemove, onUpdate, onEditStart,
}: Props) {
  const [draft, setDraft] = useState<DraftState>(DEFAULT_DRAFT)

  const selectedEl = textElements.find(el => el.id === selectedTextId)
  const isEditingSelected = selectedEl && selectedEl.id === editingTextId

  /* Unified data + setter — points to draft or selected element */
  const data: DraftState = selectedEl
    ? { text: selectedEl.text, fontFamily: selectedEl.fontFamily, fontSize: selectedEl.fontSize, color: selectedEl.color, bold: selectedEl.bold, italic: selectedEl.italic }
    : draft

  const setData = (updates: Partial<DraftState>) => {
    if (selectedEl) {
      onUpdate(selectedEl.id, updates)
    } else {
      setDraft(d => ({ ...d, ...updates }))
    }
  }

  const handleAdd = () => {
    if (!draft.text.trim()) return
    onAdd({ text: draft.text.trim(), fontFamily: draft.fontFamily, fontSize: draft.fontSize, color: draft.color, bold: draft.bold, italic: draft.italic })
    setDraft(d => ({ ...d, text: '' }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode indicator */}
      <AnimatePresence mode="wait">
        {selectedEl ? (
          <motion.div
            key="edit-mode"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-25)' }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-syne)' }}>
              Editing text
            </span>
            <button
              onClick={() => onRemove(selectedEl.id)}
              className="text-xs px-2 py-0.5 rounded-md transition-colors hover:text-red-400"
              style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Delete
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="add-mode"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}>
              Add Text
            </label>
            <input
              type="text"
              placeholder="Type something..."
              value={draft.text}
              onChange={(e) => setDraft(d => ({ ...d, text: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontFamily: `"${draft.fontFamily}"`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Double-click to edit hint */}
      {selectedEl && !isEditingSelected && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onEditStart(selectedEl.id)}
          className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
          style={{
            background: 'var(--card)',
            border: '1px dashed var(--accent-35)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-syne)',
          }}
        >
          Double-click on canvas to edit text
        </motion.button>
      )}

      {/* Shared controls */}
      <FontPicker value={data.fontFamily} onChange={(f) => setData({ fontFamily: f })} />
      <Slider label="Size" value={data.fontSize} min={12} max={160} unit="px" onChange={(v) => setData({ fontSize: v })} />
      <ColorPicker value={data.color} onChange={(c) => setData({ color: c })} />
      <StyleToggles
        bold={data.bold}
        italic={data.italic}
        onBoldChange={(v) => setData({ bold: v })}
        onItalicChange={(v) => setData({ italic: v })}
      />

      {/* Add button (only in create mode) */}
      {!selectedEl && (
        <button
          onClick={handleAdd}
          disabled={!draft.text.trim()}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 hover:brightness-110"
          style={{ background: 'var(--accent)', color: 'var(--on-accent)', fontFamily: 'var(--font-syne)' }}
        >
          + Add to canvas
        </button>
      )}

      {/* Elements list */}
      <AnimatePresence>
        {textElements.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}>
              On canvas
            </label>
            {textElements.map((el) => {
              const isSelected = el.id === selectedTextId
              return (
                <motion.button
                  key={el.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  onClick={() => {/* selection handled by canvas click */}}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-left w-full"
                  style={{
                    background: isSelected ? 'var(--accent-soft)' : 'var(--card)',
                    border: `1px solid ${isSelected ? 'var(--accent-35)' : 'var(--border)'}`,
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: el.color, border: '1px solid var(--invert-20)' }} />
                  <span className="flex-1 text-sm truncate" style={{ fontFamily: `"${el.fontFamily}"`, color: 'var(--text)' }}>
                    {el.text}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(el.id) }}
                    className="text-xs flex-shrink-0 transition-colors hover:text-red-400"
                    style={{ color: 'var(--muted)' }}
                  >
                    ✕
                  </button>
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
