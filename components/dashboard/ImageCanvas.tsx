'use client'

import {
  useEffect, useRef, useCallback, useState,
  forwardRef, useImperativeHandle,
} from 'react'
import type { GradientPreset } from '@/lib/gradients'
import type { TextElement, Transform } from '@/lib/types'

export type ImageCanvasRef = {
  download: () => void
  getCanvasSize: () => { width: number; height: number }
}

type EditOverlay = {
  id: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  bold: boolean
  italic: boolean
  color: string
}

type DragState =
  | { type: 'image'; startMouseX: number; startMouseY: number; startOffsetX: number; startOffsetY: number }
  | { type: 'text'; id: string; textOffX: number; textOffY: number }

type Props = {
  image: HTMLImageElement
  gradient: GradientPreset
  padding: number
  borderRadius: number
  transform: Transform
  textElements: TextElement[]
  selectedTextId: string | null
  editingTextId: string | null
  onOffsetChange: (x: number, y: number) => void
  onTextMove: (id: string, x: number, y: number) => void
  onTextSelect: (id: string | null) => void
  onTextEditStart: (id: string) => void
  onTextEditEnd: () => void
  onTextContentChange: (id: string, text: string) => void
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.arcTo(x + w, y, x + w, y + radius, radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
  ctx.lineTo(x + radius, y + h)
  ctx.arcTo(x, y + h, x, y + h - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.closePath()
}

const ImageCanvas = forwardRef<ImageCanvasRef, Props>(function ImageCanvas(
  {
    image, gradient, padding, borderRadius, transform,
    textElements, selectedTextId, editingTextId,
    onOffsetChange, onTextMove, onTextSelect,
    onTextEditStart, onTextEditEnd, onTextContentChange,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const dimsRef = useRef({ width: 1, height: 1 })
  const [dims, setDims] = useState({ width: 1, height: 1 })
  const [editOverlay, setEditOverlay] = useState<EditOverlay | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [hoverCursor, setHoverCursor] = useState<'grab' | 'move'>('grab')

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imgW = image.naturalWidth
    const imgH = image.naturalHeight
    const padFrac = padding / 100

    const skewXRad = transform.skewX * Math.PI / 180
    const skewYRad = transform.skewY * Math.PI / 180
    const rotRad   = transform.rotate * Math.PI / 180

    const diagLen  = Math.sqrt(imgW ** 2 + imgH ** 2)
    const rotExtra = Math.ceil(diagLen * Math.abs(Math.sin(rotRad)) + 10)
    const skewXExtra = Math.ceil(Math.abs(Math.tan(skewXRad)) * imgH)
    const skewYExtra = Math.ceil(Math.abs(Math.tan(skewYRad)) * imgW)

    const canvasW = Math.round(imgW * (1 + 2 * padFrac)) + skewXExtra * 2 + rotExtra * 2
    const canvasH = Math.round(imgH * (1 + 2 * padFrac)) + skewYExtra * 2 + rotExtra * 2

    if (canvas.width !== canvasW || canvas.height !== canvasH) {
      canvas.width  = canvasW
      canvas.height = canvasH
      canvas.style.aspectRatio = `${canvasW} / ${canvasH}`
      canvas.style.width  = '100%'
      canvas.style.height = 'auto'
      if (dimsRef.current.width !== canvasW || dimsRef.current.height !== canvasH) {
        dimsRef.current = { width: canvasW, height: canvasH }
        setDims({ width: canvasW, height: canvasH })
      }
    }

    gradient.draw(ctx, canvasW, canvasH)

    const cx = canvasW / 2 + transform.offsetX
    const cy = canvasH / 2 + transform.offsetY
    const halfW = imgW / 2
    const halfH = imgH / 2

    ctx.save()
    ctx.translate(cx, cy)
    if (transform.rotate !== 0) ctx.rotate(rotRad)
    if (transform.skewX !== 0 || transform.skewY !== 0) {
      ctx.transform(1, Math.tan(skewYRad), Math.tan(skewXRad), 1, 0, 0)
    }
    drawRoundRect(ctx, -halfW, -halfH, imgW, imgH, borderRadius)
    ctx.clip()
    ctx.drawImage(image, -halfW, -halfH, imgW, imgH)
    ctx.restore()

    const visibleText = textElements.filter(el => el.id !== editingTextId)
    if (visibleText.length > 0) {
      try {
        await Promise.all(visibleText.map(el =>
          document.fonts.load(
            `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize}px "${el.fontFamily}"`,
          ),
        ))
      } catch { /* fallback to system font */ }

      for (const el of visibleText) {
        ctx.save()
        ctx.font = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}${el.fontSize}px "${el.fontFamily}", sans-serif`
        ctx.fillStyle = el.color
        ctx.textBaseline = 'top'
        ctx.fillText(el.text, el.x, el.y)
        ctx.restore()
      }
    }
  }, [image, gradient, padding, borderRadius, transform, textElements, editingTextId])

  useEffect(() => { render() }, [render])

  /* Compute edit overlay position when editingTextId changes */
  useEffect(() => {
    if (!editingTextId) { setEditOverlay(null); return }
    const el = textElements.find(t => t.id === editingTextId)
    if (!el) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = rect.width / canvas.width
    setEditOverlay({
      id: editingTextId,
      x: rect.left + el.x * scale,
      y: rect.top + el.y * scale,
      fontSize: el.fontSize * scale,
      fontFamily: el.fontFamily,
      bold: el.bold,
      italic: el.italic,
      color: el.color,
    })
  }, [editingTextId, textElements])

  useEffect(() => {
    if (editOverlay) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editOverlay])

  useImperativeHandle(ref, () => ({
    download() {
      const canvas = canvasRef.current
      if (!canvas) return
      const link = document.createElement('a')
      link.download = 'screenshotter.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    },
    getCanvasSize() {
      return { width: canvasRef.current?.width ?? 800, height: canvasRef.current?.height ?? 600 }
    },
  }))

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const findHitText = (x: number, y: number) => {
    for (const el of [...textElements].reverse()) {
      const estW = Math.max(el.text.length, 1) * el.fontSize * 0.58 + 16
      const estH = el.fontSize * 1.35
      if (x >= el.x - 8 && x <= el.x + estW && y >= el.y - 4 && y <= el.y + estH) {
        return el
      }
    }
    return null
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editingTextId) { onTextEditEnd(); return }
    const pos = getCanvasPos(e)
    const hit = findHitText(pos.x, pos.y)
    if (hit) {
      onTextSelect(hit.id)
      dragRef.current = { type: 'text', id: hit.id, textOffX: pos.x - hit.x, textOffY: pos.y - hit.y }
    } else {
      onTextSelect(null)
      dragRef.current = { type: 'image', startMouseX: pos.x, startMouseY: pos.y, startOffsetX: transform.offsetX, startOffsetY: transform.offsetY }
    }
    e.currentTarget.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e)
    if (dragRef.current) {
      if (dragRef.current.type === 'image') {
        const { startMouseX, startMouseY, startOffsetX, startOffsetY } = dragRef.current
        onOffsetChange(startOffsetX + (pos.x - startMouseX), startOffsetY + (pos.y - startMouseY))
      } else {
        onTextMove(dragRef.current.id, pos.x - dragRef.current.textOffX, pos.y - dragRef.current.textOffY)
      }
      return
    }
    // hover: update cursor based on what's under the pointer
    const hit = findHitText(pos.x, pos.y)
    const next = hit ? 'move' : 'grab'
    if (next !== hoverCursor) setHoverCursor(next)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    dragRef.current = null
    // restore hover cursor so it reflects current position immediately
    const pos = getCanvasPos(e)
    const hit = findHitText(pos.x, pos.y)
    const next = hit ? 'move' : 'grab'
    setHoverCursor(next)
    e.currentTarget.style.cursor = next
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e)
    const hit = findHitText(pos.x, pos.y)
    if (hit) onTextEditStart(hit.id)
  }

  /* Selection indicator dimensions (approximate) */
  const selEl = !editingTextId ? textElements.find(t => t.id === selectedTextId) : undefined
  const selW = selEl ? Math.max(selEl.text.length, 1) * selEl.fontSize * 0.58 + 20 : 0
  const selH = selEl ? selEl.fontSize * 1.35 + 8 : 0
  const handles = selEl
    ? [
        [selEl.x - 10,          selEl.y - 4         ],
        [selEl.x - 10 + selW,   selEl.y - 4         ],
        [selEl.x - 10,          selEl.y - 4 + selH  ],
        [selEl.x - 10 + selW,   selEl.y - 4 + selH  ],
      ]
    : []

  const editEl = textElements.find(t => t.id === editingTextId)

  return (
    <div style={{ position: 'relative', lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={(e) => { dragRef.current = null; e.currentTarget.style.cursor = editingTextId ? 'text' : 'grab' }}
        onDoubleClick={handleDoubleClick}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: '12px',
          boxShadow: 'var(--canvas-shadow)',
          cursor: editingTextId ? 'text' : hoverCursor,
          userSelect: 'none',
        }}
      />

      {/* Selection SVG overlay */}
      {selEl && (
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
            borderRadius: '12px',
          }}
          viewBox={`0 0 ${dims.width} ${dims.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x={selEl.x - 10}
            y={selEl.y - 4}
            width={selW}
            height={selH}
            fill="var(--accent-soft)"
            stroke="var(--accent-70)"
            strokeWidth={Math.max(1.5, dims.width / 600)}
            strokeDasharray="7 5"
            rx={4}
          />
          {handles.map(([hx, hy], i) => (
            <rect key={i} x={hx - 4} y={hy - 4} width={8} height={8} rx={2} fill="var(--accent)" />
          ))}
        </svg>
      )}

      {/* Edit input overlay (fixed, over canvas text) */}
      {editOverlay && editEl && (
        <input
          ref={editInputRef}
          value={editEl.text}
          onChange={(e) => onTextContentChange(editOverlay.id, e.target.value)}
          onBlur={() => { setEditOverlay(null); onTextEditEnd() }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              e.preventDefault()
              setEditOverlay(null)
              onTextEditEnd()
            }
          }}
          style={{
            position: 'fixed',
            left: editOverlay.x,
            top: editOverlay.y,
            fontSize: `${editOverlay.fontSize}px`,
            fontFamily: `"${editOverlay.fontFamily}", sans-serif`,
            fontWeight: editOverlay.bold ? 700 : 400,
            fontStyle: editOverlay.italic ? 'italic' : 'normal',
            color: editOverlay.color,
            background: 'var(--overlay-sm)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1.5px solid var(--accent-70)',
            borderRadius: '4px',
            outline: 'none',
            padding: '1px 6px',
            minWidth: '60px',
            zIndex: 9999,
            lineHeight: '1.2',
            boxShadow: '0 0 0 3px var(--accent-soft)',
          }}
        />
      )}
    </div>
  )
})

export default ImageCanvas
