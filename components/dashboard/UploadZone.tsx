'use client'

import { useRef, useState } from 'react'

type Props = {
  onFile: (file: File) => void
}

export default function UploadZone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        onFile(file)
        return
      }
    }
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-4 rounded-2xl transition-all duration-200"
      style={{
        minHeight: '220px',
        border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
        background: dragging ? 'var(--accent-soft)' : 'var(--surface)',
        cursor: dragging ? 'copy' : 'pointer',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: dragging ? 'var(--accent-20)' : 'var(--card)',
          border: '1px solid var(--border)',
          color: dragging ? 'var(--accent)' : 'var(--muted)',
          transition: 'all 0.2s',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="text-center px-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          Click to upload or drag & drop
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Or press{' '}
          <kbd
            className="px-1.5 py-0.5 rounded text-xs"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'monospace' }}
          >
            ⌘V
          </kbd>{' '}
          to paste from clipboard
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
