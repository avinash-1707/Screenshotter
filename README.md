# Screenshotter

Wrap screenshots in beautiful gradient backgrounds. Adjust, annotate, and export at full resolution — no account needed.

![Screenshotter](https://og-image.vercel.app/Screenshotter.png)

## Features

- **10 gradient presets** — radial mesh, layered orbs, conic blends; dark and light
- **Transform controls** — skew, rotate, offset with preset shortcuts
- **Text overlay** — multiple fonts, colors, sizes; drag to reposition, double-click to edit inline
- **Padding & border radius** sliders
- **Full-res PNG export** — canvas renders exactly what you see
- **Dark / light mode** — full CSS variable system, toggled via sun/moon button
- **Paste support** — ⌘V / Ctrl+V pastes directly from clipboard

## Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [motion/react](https://motion.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Package manager | [Bun](https://bun.sh/) |
| Fonts | Syne (display) + Outfit (body) via `next/font` |

## Getting Started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx               # Landing page (server component)
  dashboard/page.tsx     # Editor
  globals.css            # Design tokens — full dark/light CSS variable system
  providers.tsx          # ThemeProvider wrapper
components/
  landing/               # Navbar, Hero, Features, GradientShowcase
  dashboard/             # ImageCanvas, TransformControls, TextPanel,
  │                        GradientPicker, Sliders, UploadZone
  ui/                    # Slider, ThemeToggle
lib/
  gradients.ts           # 10 gradient presets with canvas draw functions
  types.ts               # Shared types (TextElement, Transform) and constants
```

## License

MIT
