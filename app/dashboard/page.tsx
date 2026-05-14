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
import CodeCanvas, { type CodeCanvasRef } from '@/components/dashboard/CodeCanvas'
import CodePanel, { getDefaultSnippet } from '@/components/dashboard/CodePanel'
import PresetsPanel from '@/components/dashboard/PresetsPanel'
import type { PresetConfig } from '@/lib/presets'

type InputMode = 'image' | 'code'
type Tab = 'style' | 'transform' | 'text' | 'presets'
type AspectRatio = { w: number; h: number } | null

const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: 'Free', value: null },
  { label: '16:9', value: { w: 16, h: 9 } },
  { label: '4:3',  value: { w: 4,  h: 3 } },
  { label: '1:1',  value: { w: 1,  h: 1 } },
  { label: '9:16', value: { w: 9,  h: 16 } },
]

const TABS: { id: Tab; label: string }[] = [
  { id: 'style', label: 'Style' },
  { id: 'transform', label: 'Transform' },
  { id: 'text', label: 'Text' },
  { id: 'presets', label: 'Presets' },
]

export default function Dashboard() {
  const [inputMode, setInputMode] = useState<InputMode>('image')

  // ── Image state ──────────────────────────────────────────────
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

  // ── Code state ───────────────────────────────────────────────
  const [code, setCode] = useState(() => getDefaultSnippet('javascript'))
  const [language, setLanguage] = useState('javascript')
  const [filename, setFilename] = useState('untitled')
  const [codeTheme, setCodeTheme] = useState<'dark' | 'light'>('dark')
  const codeCanvasRef = useRef<CodeCanvasRef>(null)

  // ── Download ──────────────────────────────────────────────────
  const [downloadFilename, setDownloadFilename] = useState('screenshotter')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>({ w: 16, h: 9 })

  const gradient = GRADIENTS.find((g) => g.id === gradientId) ?? GRADIENTS[0]

  // ── Image loading ─────────────────────────────────────────────
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
      { ...draft, id: Math.random().toString(36).slice(2), x: Math.round(size.width * 0.1), y: Math.round(size.height * 0.45) },
    ])
  }

  const removeText = (id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedTextId === id) setSelectedTextId(null)
    if (editingTextId === id) setEditingTextId(null)
  }

  const updateText = (id: string, updates: Partial<TextElement>) =>
    setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))

  const applyPreset = (config: PresetConfig) => {
    setGradientId(config.gradientId)
    setPadding(config.padding)
    setBorderRadius(config.borderRadius)
    setTransform(config.transform)
    setTextElements(config.textElements)
    setSelectedTextId(null)
    setEditingTextId(null)
  }

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

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setCode(getDefaultSnippet(lang))
  }

  const handleDownload = () => {
    const name = downloadFilename.trim() || 'screenshotter'
    if (inputMode === 'code') codeCanvasRef.current?.download(name)
    else canvasRef.current?.download(name)
  }

  const showDownload = inputMode === 'code' || !!image

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-shrink-0 w-full lg:w-72 xl:w-80 flex flex-col overflow-y-auto"
          style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          {/* Mode switcher */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div
              className="flex rounded-xl p-1 gap-1"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              {(['image', 'code'] as InputMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className="relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  style={{
                    color: inputMode === mode ? 'var(--text)' : 'var(--muted)',
                    fontFamily: 'var(--font-syne)',
                  }}
                >
                  {inputMode === mode && (
                    <motion.div
                      layoutId="mode-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                  <span className="relative z-10">
                    {mode === 'image' ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
                        <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="4" cy="4.5" r="1" fill="currentColor" />
                        <path d="M1.5 8.5l2.5-2.5 2 2 1.5-1.5 2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }}>
                        <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M3.5 4.5L5 6l-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6.5 7.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    )}
                    {mode === 'image' ? 'Image' : 'Code'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Input section (Image or Code) ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={inputMode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {inputMode === 'image' ? (
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
              ) : (
                <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                  <CodePanel
                    code={code}
                    language={language}
                    filename={filename}
                    onCodeChange={setCode}
                    onLanguageChange={handleLanguageChange}
                    onFilenameChange={setFilename}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Gradient picker — always visible */}
          <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <GradientPicker selectedId={gradientId} onChange={setGradientId} />
          </div>

          {/* Controls */}
          <div className="p-5 flex flex-col gap-4">
            {inputMode === 'image' ? (
              <>
                {/* Image mode: tabs */}
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
                    {activeTab === 'presets' && (
                      <PresetsPanel
                        currentConfig={{
                          gradientId,
                          padding,
                          borderRadius,
                          transform,
                          textElements,
                        }}
                        onApply={applyPreset}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              /* Code mode: just sliders */
              <Sliders
                padding={padding}
                borderRadius={borderRadius}
                onPaddingChange={setPadding}
                onBorderRadiusChange={setBorderRadius}
              />
            )}
          </div>

          {/* Download */}
          <AnimatePresence>
            {showDownload && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {/* Aspect ratio */}
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Aspect Ratio</p>
                <div className="flex gap-1 mb-3">
                  {ASPECT_RATIOS.map(({ label, value }) => {
                    const active = value === null ? aspectRatio === null : aspectRatio?.w === value.w && aspectRatio?.h === value.h
                    return (
                      <button
                        key={label}
                        onClick={() => setAspectRatio(value)}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          fontFamily: 'var(--font-syne)',
                          background: active ? 'linear-gradient(135deg, var(--accent), var(--accent-2))' : 'var(--card)',
                          color: active ? 'var(--on-accent)' : 'var(--muted)',
                          border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>

                {/* Filename */}
                <div className="flex items-center rounded-xl overflow-hidden mb-3" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                  <input
                    type="text"
                    value={downloadFilename}
                    onChange={(e) => setDownloadFilename(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-syne)' }}
                    spellCheck={false}
                  />
                  <span className="px-3 py-2 text-xs select-none" style={{ color: 'var(--text-muted)', borderLeft: '1px solid var(--border)' }}>.png</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
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

        {/* ── Canvas area ──────────────────────────────────────────── */}
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
            {inputMode === 'image' ? (
              image ? (
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
                    aspectRatio={aspectRatio}
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
              )
            ) : (
              /* Code mode */
              <motion.div
                key="code-canvas"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-4xl"
                style={{ position: 'relative' }}
              >
                <CodeCanvas
                  ref={codeCanvasRef}
                  code={code}
                  language={language}
                  filename={filename}
                  gradient={gradient}
                  padding={padding}
                  borderRadius={borderRadius}
                  codeTheme={codeTheme}
                  aspectRatio={aspectRatio}
                />

                {/* Code theme toggle — overlaid, excluded from PNG export */}
                <div
                  data-no-capture
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    zIndex: 10,
                  }}
                >
                  <button
                    onClick={() => setCodeTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '7px 14px',
                      borderRadius: '999px',
                      background: codeTheme === 'dark' ? 'rgba(20,22,40,0.85)' : 'rgba(255,255,255,0.85)',
                      border: codeTheme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                      color: codeTheme === 'dark' ? '#c0c5e0' : '#24292e',
                      fontFamily: 'var(--font-syne)',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {codeTheme === 'dark' ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10.5 6.75A4.75 4.75 0 015.25 1.5a.25.25 0 00-.26-.25A5.25 5.25 0 106.5 10.76a.25.25 0 00.14-.47A4.77 4.77 0 0110.5 6.75z" fill="currentColor" />
                        </svg>
                        Dark
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                          <path d="M6 1v1M6 10v1M1 6h1M10 6h1M2.64 2.64l.71.71M8.65 8.65l.71.71M2.64 9.36l.71-.71M8.65 3.35l.71-.71" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                        Light
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-xs mt-3" style={{ color: 'var(--muted)' }}>
                  Edit code in the sidebar · Toggle theme above
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
