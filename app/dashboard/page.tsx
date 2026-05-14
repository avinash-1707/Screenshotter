'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { GRADIENTS } from '@/lib/gradients'
import { DEFAULT_TRANSFORM, type TextElement, type Transform } from '@/lib/types'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import UploadZone from '@/components/dashboard/UploadZone'
import GradientPicker from '@/components/dashboard/GradientPicker'
import Sliders from '@/components/dashboard/Sliders'
import TransformControls from '@/components/dashboard/TransformControls'
import TextPanel from '@/components/dashboard/TextPanel'
import ImageCanvas, { type ImageCanvasRef } from '@/components/dashboard/ImageCanvas'

type Tab = 'style' | 'transform' | 'text'

const TABS: { id: Tab; label: string }[] = [
  { id: 'style', label: 'Style' },
  { id: 'transform', label: 'Transform' },
  { id: 'text', label: 'Text' },
]

export default function Dashboard() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [gradientId, setGradientId] = useState('aurora')
  const [padding, setPadding] = useState(20)
  const [borderRadius, setBorderRadius] = useState(16)
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM)
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('style')
  const canvasRef = useRef<ImageCanvasRef>(null)
  const objectUrlRef = useRef<string | null>(null)

  const gradient = GRADIENTS.find((g) => g.id === gradientId) ?? GRADIENTS[0]

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = url
  }, [])

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      for (const item of Array.from(e.clipboardData?.items ?? [])) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) { loadFile(file); break }
        }
      }
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [loadFile])

  useEffect(() => {
    return () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current) }
  }, [])

  const updateTransform = (partial: Partial<Transform>) =>
    setTransform((prev) => ({ ...prev, ...partial }))

  const addText = (draft: Omit<TextElement, 'id' | 'x' | 'y'>) => {
    const size = canvasRef.current?.getCanvasSize() ?? { width: 800, height: 600 }
    setTextElements((prev) => [
      ...prev,
      {
        ...draft,
        id: Math.random().toString(36).slice(2),
        x: Math.round(size.width * 0.1),
        y: Math.round(size.height * 0.45),
      },
    ])
  }

  const removeText = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedTextId === id) setSelectedTextId(null)
    if (editingTextId === id) setEditingTextId(null)
  }

  const updateText = (id: string, updates: Partial<TextElement>) =>
    setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))

  const moveText = (id: string, x: number, y: number) =>
    setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, x, y } : el)))

  const handleTextSelect = (id: string | null) => {
    setSelectedTextId(id)
    setEditingTextId(null)
    if (id) setActiveTab('text')
  }

  const handleTextEditStart = (id: string) => {
    setSelectedTextId(id)
    setEditingTextId(id)
    setActiveTab('text')
  }

  const handleTextEditEnd = () => setEditingTextId(null)

  const replaceImage = () => {
    setImage(null)
    setTransform(DEFAULT_TRANSFORM)
    setTextElements([])
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-shrink-0 w-full lg:w-72 xl:w-80 flex flex-col overflow-y-auto"
          style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          {/* Image section */}
          <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}>
                Image
              </span>
              {image && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={replaceImage}
                  className="text-xs px-2.5 py-1 rounded-lg transition-colors"
                  style={{ color: 'var(--muted)', border: '1px solid var(--border)', background: 'var(--card)' }}
                >
                  Replace
                </motion.button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {image ? (
                <motion.div
                  key="thumb"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={objectUrlRef.current ?? ''}
                    alt="Uploaded"
                    style={{ display: 'block', width: '100%', maxHeight: '110px', objectFit: 'cover' }}
                  />
                  <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'var(--card)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>
                      {image.naturalWidth} × {image.naturalHeight}px
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <UploadZone onFile={loadFile} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gradient picker — always visible */}
          <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <GradientPicker selectedId={gradientId} onChange={setGradientId} />
          </div>

          {/* Tabs */}
          <div className="p-5 flex flex-col gap-4 flex-1">
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors"
                  style={{
                    color: activeTab === tab.id ? 'var(--text)' : 'var(--muted)',
                    fontFamily: 'var(--font-syne)',
                  }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'style' && (
                  <Sliders
                    padding={padding}
                    borderRadius={borderRadius}
                    onPaddingChange={setPadding}
                    onBorderRadiusChange={setBorderRadius}
                  />
                )}
                {activeTab === 'transform' && (
                  <TransformControls transform={transform} onChange={updateTransform} />
                )}
                {activeTab === 'text' && (
                  <TextPanel
                    textElements={textElements}
                    selectedTextId={selectedTextId}
                    editingTextId={editingTextId}
                    onAdd={addText}
                    onRemove={removeText}
                    onUpdate={updateText}
                    onEditStart={handleTextEditStart}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Download */}
          <AnimatePresence>
            {image && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => canvasRef.current?.download()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                    color: 'var(--on-accent)',
                    fontFamily: 'var(--font-syne)',
                    boxShadow: '0 4px 24px var(--accent-20)',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M7.5 10V2M4.5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Download PNG
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>

        {/* Canvas area */}
        <main
          className="flex-1 relative flex items-center justify-center p-6 lg:p-12 overflow-auto"
          style={{
            background: 'var(--bg)',
            backgroundImage: 'radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          <Link
            href="/"
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              fontFamily: 'var(--font-syne)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 6H4M4 6l2.5-2.5M4 6l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
          <div className="absolute top-4 right-4 z-10">
            <ThemeToggle />
          </div>
          <AnimatePresence mode="wait">
            {image ? (
              <motion.div
                key="canvas"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-4xl"
              >
                <ImageCanvas
                  ref={canvasRef}
                  image={image}
                  gradient={gradient}
                  padding={padding}
                  borderRadius={borderRadius}
                  transform={transform}
                  textElements={textElements}
                  selectedTextId={selectedTextId}
                  editingTextId={editingTextId}
                  onOffsetChange={(x, y) => updateTransform({ offsetX: x, offsetY: y })}
                  onTextMove={moveText}
                  onTextSelect={handleTextSelect}
                  onTextEditStart={handleTextEditStart}
                  onTextEditEnd={handleTextEditEnd}
                  onTextContentChange={(id, text) => updateText(id, { text })}
                />
                <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
                  Drag image to reposition · Drag text to move
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-5 text-center max-w-xs"
              >
                <div
                  className="w-56 h-36 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{ background: GRADIENTS[0].css, boxShadow: '0 8px 40px var(--shadow)' }}
                >
                  <div
                    className="w-36 h-24 rounded-xl"
                    style={{ background: 'var(--invert-10)', border: '1px solid var(--invert-15)', backdropFilter: 'blur(6px)' }}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                    Upload a screenshot
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                    Click Upload, drag & drop, or press{' '}
                    <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--card)', border: '1px solid var(--border)', fontFamily: 'monospace' }}>
                      ⌘V
                    </kbd>{' '}
                    to paste.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
