import type { Transform, TextElement } from '@/lib/types'

export type PresetConfig = {
  gradientId: string
  padding: number
  borderRadius: number
  transform: Transform
  textElements: TextElement[]
}

export type SavedPreset = {
  id: string
  name: string
  createdAt: number
  config: PresetConfig
}

const STORAGE_KEY = 'screenshotter-presets-v1'

export function loadPresets(): SavedPreset[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SavedPreset[]) : []
  } catch {
    return []
  }
}

export function savePreset(name: string, config: PresetConfig): SavedPreset {
  const preset: SavedPreset = {
    id: Math.random().toString(36).slice(2, 10),
    name: name.trim() || 'Untitled',
    createdAt: Date.now(),
    config,
  }
  const existing = loadPresets()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([preset, ...existing]))
  return preset
}

export function deletePreset(id: string): void {
  const updated = loadPresets().filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function renamePreset(id: string, name: string): void {
  const updated = loadPresets().map((p) =>
    p.id === id ? { ...p, name: name.trim() || p.name } : p
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
