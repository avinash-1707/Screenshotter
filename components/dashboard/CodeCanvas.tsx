'use client'

import { useRef, forwardRef, useImperativeHandle } from 'react'
import Prism from 'prismjs'
import { toPng } from 'html-to-image'
import type { GradientPreset } from '@/lib/gradients'

// Core: markup, css, clike are bundled; javascript must be explicit for dependent grammars
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-yaml'

export type CodeCanvasRef = {
  download: () => Promise<void>
}

export const LANGUAGE_META: Record<string, { label: string; ext: string; prismKey: string }> = {
  javascript: { label: 'JavaScript', ext: 'js',   prismKey: 'javascript' },
  typescript: { label: 'TypeScript', ext: 'ts',   prismKey: 'typescript' },
  jsx:        { label: 'JSX',        ext: 'jsx',  prismKey: 'jsx'        },
  tsx:        { label: 'TSX',        ext: 'tsx',  prismKey: 'tsx'        },
  python:     { label: 'Python',     ext: 'py',   prismKey: 'python'     },
  rust:       { label: 'Rust',       ext: 'rs',   prismKey: 'rust'       },
  go:         { label: 'Go',         ext: 'go',   prismKey: 'go'         },
  html:       { label: 'HTML',       ext: 'html', prismKey: 'markup'     },
  css:        { label: 'CSS',        ext: 'css',  prismKey: 'css'        },
  json:       { label: 'JSON',       ext: 'json', prismKey: 'json'       },
  bash:       { label: 'Bash',       ext: 'sh',   prismKey: 'bash'       },
  sql:        { label: 'SQL',        ext: 'sql',  prismKey: 'sql'        },
  java:       { label: 'Java',       ext: 'java', prismKey: 'java'       },
  swift:      { label: 'Swift',      ext: 'swift',prismKey: 'swift'      },
  kotlin:     { label: 'Kotlin',     ext: 'kt',   prismKey: 'kotlin'     },
  c:          { label: 'C',          ext: 'c',    prismKey: 'c'          },
  cpp:        { label: 'C++',        ext: 'cpp',  prismKey: 'cpp'        },
  ruby:       { label: 'Ruby',       ext: 'rb',   prismKey: 'ruby'       },
  php:        { label: 'PHP',        ext: 'php',  prismKey: 'php'        },
  yaml:       { label: 'YAML',       ext: 'yml',  prismKey: 'yaml'       },
}

type Props = {
  code: string
  language: string
  filename: string
  gradient: GradientPreset
  padding: number       // 0–60
  borderRadius: number  // 0–80
  codeTheme: 'dark' | 'light'
}

const MONO = 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

const CodeCanvas = forwardRef<CodeCanvasRef, Props>(function CodeCanvas(
  { code, language, filename, gradient, padding, borderRadius, codeTheme },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    async download() {
      const el = containerRef.current
      if (!el) return
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        width: el.scrollWidth,
        height: el.scrollHeight,
        filter: (node) => {
          if (node instanceof Element && node.hasAttribute('data-no-capture')) return false
          return true
        },
      })
      const a = document.createElement('a')
      a.download = 'screenshotter-code.png'
      a.href = dataUrl
      a.click()
    },
  }))

  const meta = LANGUAGE_META[language]
  const prismKey = meta?.prismKey ?? language
  const grammar = Prism.languages[prismKey]
  const codeText = code || '// Start typing your code here…'

  const escaped = codeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  let highlighted = escaped
  if (grammar) {
    try {
      highlighted = Prism.highlight(codeText, grammar, prismKey)
    } catch {
      highlighted = escaped
    }
  }

  const lineCount = (codeText.match(/\n/g)?.length ?? 0) + 1
  const lineNums = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')

  const padPx = Math.round(28 + (padding / 60) * 96) // 28 → 124 px

  const isDark = codeTheme === 'dark'
  const titleBg     = isDark ? '#252742' : '#e6e8f2'
  const titleBorder = isDark ? 'rgba(0,0,0,0.40)' : 'rgba(0,0,0,0.10)'
  const titleText   = isDark ? '#535a85' : '#8590aa'
  const shadow      = isDark
    ? '0 32px 96px rgba(0,0,0,0.80), 0 4px 24px rgba(0,0,0,0.55)'
    : '0 32px 80px rgba(0,0,0,0.20), 0 4px 20px rgba(0,0,0,0.10)'

  return (
    <div
      ref={containerRef}
      style={{
        background: gradient.css,
        padding: `${padPx}px`,
        borderRadius: 0,
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="code-window"
        data-theme={codeTheme}
        style={{
          borderRadius: `${Math.max(borderRadius, 4)}px`,
          overflow: 'hidden',
          boxShadow: shadow,
        }}
      >
        {/* ── Title bar ── */}
        <div
          style={{
            background: titleBg,
            borderBottom: `1px solid ${titleBorder}`,
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            position: 'relative',
            userSelect: 'none',
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '7px', flexShrink: 0, zIndex: 1 }}>
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
            <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840', display: 'block' }} />
          </div>

          {/* Filename centered */}
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              fontFamily: MONO,
              color: titleText,
              letterSpacing: '0.025em',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {`${filename || 'untitled'}.${meta?.ext ?? language}`}
          </span>
        </div>

        {/* ── Code body ── */}
        <div
          style={{
            background: 'var(--cw-bg)',
            display: 'flex',
            padding: '20px 0',
          }}
        >
          {/* Line numbers column */}
          <pre
            aria-hidden="true"
            style={{
              margin: 0,
              padding: '0 16px 0 20px',
              fontFamily: MONO,
              fontSize: '13px',
              lineHeight: '1.7',
              color: 'var(--cw-ln)',
              userSelect: 'none',
              textAlign: 'right',
              flexShrink: 0,
              borderRight: '1px solid var(--cw-sep)',
            }}
          >
            {lineNums}
          </pre>

          {/* Highlighted code */}
          <pre
            style={{
              margin: 0,
              flex: 1,
              padding: '0 28px',
              fontFamily: MONO,
              fontSize: '13px',
              lineHeight: '1.7',
              color: 'var(--cw-text)',
              tabSize: 2,
              overflowX: 'auto',
              whiteSpace: 'pre',
            }}
          >
            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
          </pre>
        </div>
      </div>
    </div>
  )
})

export default CodeCanvas
