export type TextElement = {
  id: string
  text: string
  fontFamily: string
  fontSize: number
  color: string
  bold: boolean
  italic: boolean
  x: number
  y: number
}

export type Transform = {
  skewX: number
  skewY: number
  rotate: number
  offsetX: number
  offsetY: number
}

export const TEXT_FONTS = [
  { id: 'syne', name: 'Syne', family: 'Syne' },
  { id: 'dm-sans', name: 'DM Sans', family: 'DM Sans' },
  { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display' },
  { id: 'space-mono', name: 'Space Mono', family: 'Space Mono' },
  { id: 'bebas', name: 'Bebas Neue', family: 'Bebas Neue' },
  { id: 'pacifico', name: 'Pacifico', family: 'Pacifico' },
]

export const TEXT_COLORS = [
  '#ffffff', '#000000', '#2dd4bf', '#a78bfa',
  '#f472b6', '#fb923c', '#fbbf24', '#34d399',
]

export const DEFAULT_TRANSFORM: Transform = {
  skewX: 0,
  skewY: 0,
  rotate: 0,
  offsetX: 0,
  offsetY: 0,
}
