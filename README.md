# Screenshotter

Wrap screenshots and code snippets in beautiful gradient backgrounds. Adjust, annotate, and export at full resolution — no account needed.

## Features

### Two input modes
- **Image mode** — upload or paste any screenshot/image
- **Code mode** — paste code with syntax highlighting, filename, and a themed window frame

### Gradients
- **10 built-in gradient presets** — Aurora, Sunset, Midnight, Forest, Ocean, Candy, Dusk, Ice, and more
- Radial mesh, layered orbs, and conic blend styles; dark and light palettes

### Code highlighting
- **20 languages** — JavaScript, TypeScript, JSX, TSX, Python, Rust, Go, HTML, CSS, JSON, Bash, SQL, Java, Swift, Kotlin, C, C++, Ruby, PHP, YAML
- Syntax coloring via Prism.js; dark/light code theme toggle
- Editable filename with auto extension suffix

### Transform & style controls
- **Padding** and **border radius** sliders
- **Transform controls** — skew X/Y, rotate, offset X/Y with preset shortcuts

### Text overlays
- Add multiple text elements; drag to reposition, double-click to edit inline
- Per-element font, color, and size controls

### Saved presets
- Save named presets (gradient + padding + transform + text layout) to localStorage
- Rename (double-click), delete with confirmation, one-click apply
- Relative timestamps ("2m ago", "3h ago")

### Export & input
- **Full-res PNG export** — canvas renders exactly what you see at the display size
- **Paste support** — ⌘V / Ctrl+V pastes images directly from clipboard
- Drag-and-drop file upload

### Theming
- **Dark / light mode** — full CSS variable system, toggled via sun/moon button

## Stack

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Animations | [motion/react](https://motion.dev/) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Syntax highlighting | [Prism.js](https://prismjs.com/) |
| Image export | [html-to-image](https://github.com/bubkoo/html-to-image) |
| Package manager | [Bun](https://bun.sh/) |
| Fonts | Syne (display) + Outfit (body) + JetBrains Mono (code) via `next/font` |

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
  dashboard/page.tsx     # Editor — image & code modes, all panel state
  globals.css            # Design tokens — full dark/light CSS variable system
  providers.tsx          # ThemeProvider wrapper
components/
  landing/               # Navbar, Hero, Features, GradientShowcase
  dashboard/
    ImageCanvas          # Canvas renderer for image mode (download, transform, text)
    CodeCanvas           # Syntax-highlighted code frame renderer
    GradientPicker       # Gradient preset selector
    TransformControls    # Skew, rotate, offset controls
    TextPanel            # Add/edit/delete text overlays
    CodePanel            # Language selector, filename input, code textarea
    PresetsPanel         # Save, load, rename, delete named presets
    Sliders              # Padding & border radius
    UploadZone           # Drag-and-drop / click-to-upload
  ui/                    # Slider, ThemeToggle, Logo
lib/
  gradients.ts           # 10 gradient presets with canvas draw functions
  presets.ts             # localStorage preset CRUD
  types.ts               # Shared types (TextElement, Transform) and constants
```

## License

MIT
