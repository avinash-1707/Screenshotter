'use client'

import { LANGUAGE_META } from './CodeCanvas'

const DEFAULT_SNIPPETS: Record<string, string> = {
  javascript: `const fibonacci = (n) => {\n  if (n <= 1) return n\n  return fibonacci(n - 1) + fibonacci(n - 2)\n}\n\nconst sequence = Array.from(\n  { length: 10 },\n  (_, i) => fibonacci(i)\n)\nconsole.log('Fibonacci:', sequence)`,
  typescript: `interface User {\n  id: number\n  name: string\n  email: string\n}\n\nasync function fetchUser(id: number): Promise<User> {\n  const res = await fetch(\`/api/users/\${id}\`)\n  if (!res.ok) throw new Error('User not found')\n  return res.json() as Promise<User>\n}`,
  python: `def fibonacci(n: int) -> list[int]:\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nsequence = fibonacci(10)\nprint(f"Fibonacci: {sequence}")`,
  rust: `fn fibonacci(n: u64) -> u64 {\n    match n {\n        0 => 0,\n        1 => 1,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}\n\nfn main() {\n    let seq: Vec<u64> = (0..10).map(fibonacci).collect();\n    println!("Fibonacci: {seq:?}");\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc fibonacci(n int) []int {\n\ta, b := 0, 1\n\tseq := make([]int, n)\n\tfor i := range seq {\n\t\tseq[i] = a\n\t\ta, b = b, a+b\n\t}\n\treturn seq\n}\n\nfunc main() {\n\tfmt.Println("Fibonacci:", fibonacci(10))\n}`,
  html: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width" />\n    <title>Hello World</title>\n    <link rel="stylesheet" href="styles.css" />\n  </head>\n  <body>\n    <h1 class="hero">Hello, World!</h1>\n    <script src="main.js"></script>\n  </body>\n</html>`,
  css: `:root {\n  --color-primary: #2dd4bf;\n  --color-bg: #070810;\n  --font-display: "Syne", sans-serif;\n}\n\n.hero {\n  font-family: var(--font-display);\n  font-size: clamp(2rem, 6vw, 5rem);\n  font-weight: 800;\n  background: linear-gradient(135deg, var(--color-primary), #a78bfa);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
  json: `{\n  "name": "screenshotter",\n  "version": "1.0.0",\n  "description": "Beautiful screenshot backgrounds",\n  "scripts": {\n    "dev": "next dev",\n    "build": "next build"\n  },\n  "dependencies": {\n    "next": "^16.0.0",\n    "react": "^19.0.0"\n  }\n}`,
}

export const LANGUAGE_LIST = Object.entries(LANGUAGE_META).map(([id, meta]) => ({
  id,
  label: meta.label,
}))

export function getDefaultSnippet(lang: string) {
  return DEFAULT_SNIPPETS[lang] ?? '// Start typing your code here…'
}

type Props = {
  code: string
  language: string
  filename: string
  onCodeChange: (code: string) => void
  onLanguageChange: (lang: string) => void
  onFilenameChange: (name: string) => void
}

export default function CodePanel({ code, language, filename, onCodeChange, onLanguageChange, onFilenameChange }: Props) {
  const meta = LANGUAGE_META[language]
  const ext = meta?.ext ?? language

  return (
    <div className="flex flex-col gap-4">
      {/* Language selector */}
      <div>
        <span
          className="text-xs font-semibold uppercase tracking-widest mb-2 block"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          Language
        </span>
        <div style={{ position: 'relative' }}>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{
              width: '100%',
              appearance: 'none',
              WebkitAppearance: 'none',
              padding: '9px 36px 9px 12px',
              borderRadius: '10px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-outfit)',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            {LANGUAGE_LIST.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          {/* chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}
          >
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Filename input */}
      <div>
        <span
          className="text-xs font-semibold uppercase tracking-widest mb-2 block"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          Filename
        </span>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            spellCheck={false}
            placeholder="untitled"
            style={{
              width: '100%',
              padding: '9px 12px',
              paddingRight: `${ext.length * 8 + 20}px`,
              borderRadius: '10px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", monospace',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-40)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
          />
          <span
            style={{
              position: 'absolute',
              right: 12,
              fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", monospace',
              fontSize: '13px',
              color: 'var(--muted)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            .{ext}
          </span>
        </div>
      </div>

      {/* Code textarea */}
      <div>
        <span
          className="text-xs font-semibold uppercase tracking-widest mb-2 block"
          style={{ fontFamily: 'var(--font-syne)', color: 'var(--muted)' }}
        >
          Code
        </span>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Paste your code here…"
          style={{
            width: '100%',
            height: '220px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-jetbrains-mono), "JetBrains Mono", "Fira Code", monospace',
            fontSize: '11.5px',
            lineHeight: '1.65',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.15s',
            caretColor: 'var(--accent)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-40)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
        />
      </div>
    </div>
  )
}
