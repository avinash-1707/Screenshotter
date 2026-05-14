export type GradientPreset = {
  id: string
  name: string
  css: string
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
}

function orb(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export const GRADIENTS: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    css: 'radial-gradient(ellipse 80% 80% at 20% 50%, rgba(18,194,233,.65) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 20%, rgba(246,79,89,.55) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 60% 85%, rgba(196,113,237,.65) 0%, transparent 60%), #0d1117',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0d1117'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.2, h * 0.5, w * 0.5, 'rgba(18,194,233,.65)')
      orb(ctx, w * 0.8, h * 0.2, w * 0.45, 'rgba(246,79,89,.55)')
      orb(ctx, w * 0.6, h * 0.85, w * 0.4, 'rgba(196,113,237,.65)')
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    css: 'radial-gradient(ellipse 80% 60% at 50% 105%, rgba(255,107,53,.9) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 10% 10%, rgba(201,24,74,.7) 0%, transparent 60%), radial-gradient(ellipse 30% 30% at 85% 30%, rgba(255,200,80,.45) 0%, transparent 60%), linear-gradient(135deg, #1a0a0f 0%, #2d0a22 50%, #1a0f0a 100%)',
    draw(ctx, w, h) {
      const base = ctx.createLinearGradient(0, 0, w, h)
      base.addColorStop(0, '#1a0a0f')
      base.addColorStop(0.5, '#2d0a22')
      base.addColorStop(1, '#1a0f0a')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.5, h * 1.05, w * 0.65, 'rgba(255,107,53,.9)')
      orb(ctx, w * 0.1, h * 0.1, w * 0.4, 'rgba(201,24,74,.7)')
      orb(ctx, w * 0.85, h * 0.3, w * 0.3, 'rgba(255,200,80,.45)')
    },
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    css: 'radial-gradient(ellipse 70% 70% at 30% 60%, rgba(0,188,212,.55) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 80% 30%, rgba(3,169,244,.5) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 95%, rgba(0,96,160,.4) 0%, transparent 60%), #010d18',
    draw(ctx, w, h) {
      ctx.fillStyle = '#010d18'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.3, h * 0.6, w * 0.5, 'rgba(0,188,212,.55)')
      orb(ctx, w * 0.8, h * 0.3, w * 0.45, 'rgba(3,169,244,.5)')
      orb(ctx, w * 0.5, h * 0.95, w * 0.3, 'rgba(0,96,160,.4)')
    },
  },
  {
    id: 'candy',
    name: 'Candy Cloud',
    css: 'radial-gradient(ellipse 80% 70% at 20% 30%, rgba(248,180,217,.75) 0%, transparent 60%), radial-gradient(ellipse 70% 80% at 80% 70%, rgba(196,181,253,.7) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 60% 5%, rgba(167,243,208,.55) 0%, transparent 60%), #fdf2f8',
    draw(ctx, w, h) {
      ctx.fillStyle = '#fdf2f8'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.2, h * 0.3, w * 0.55, 'rgba(248,180,217,.75)')
      orb(ctx, w * 0.8, h * 0.7, w * 0.5, 'rgba(196,181,253,.7)')
      orb(ctx, w * 0.6, h * 0.05, w * 0.35, 'rgba(167,243,208,.55)')
    },
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    css: 'radial-gradient(ellipse 80% 80% at 50% 100%, rgba(255,183,77,.85) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 20% 20%, rgba(255,138,101,.6) 0%, transparent 60%), linear-gradient(170deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    draw(ctx, w, h) {
      const base = ctx.createLinearGradient(0, 0, w * 0.3, h)
      base.addColorStop(0, '#1a1a2e')
      base.addColorStop(0.5, '#16213e')
      base.addColorStop(1, '#0f3460')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.5, h, w * 0.65, 'rgba(255,183,77,.85)')
      orb(ctx, w * 0.2, h * 0.2, w * 0.4, 'rgba(255,138,101,.6)')
    },
  },
  {
    id: 'void',
    name: 'Void',
    css: 'radial-gradient(ellipse 60% 60% at 30% 40%, rgba(88,28,135,.65) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 75% 70%, rgba(49,46,129,.55) 0%, transparent 70%), radial-gradient(ellipse 30% 30% at 60% 8%, rgba(124,58,237,.3) 0%, transparent 70%), #030305',
    draw(ctx, w, h) {
      ctx.fillStyle = '#030305'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.3, h * 0.4, w * 0.45, 'rgba(88,28,135,.65)')
      orb(ctx, w * 0.75, h * 0.7, w * 0.4, 'rgba(49,46,129,.55)')
      orb(ctx, w * 0.6, h * 0.08, w * 0.25, 'rgba(124,58,237,.3)')
    },
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    css: 'radial-gradient(ellipse 70% 70% at 80% 20%, rgba(252,129,148,.75) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 20% 80%, rgba(134,239,172,.65) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(251,113,133,.35) 0%, transparent 60%), #fff1f2',
    draw(ctx, w, h) {
      ctx.fillStyle = '#fff1f2'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.8, h * 0.2, w * 0.5, 'rgba(252,129,148,.75)')
      orb(ctx, w * 0.2, h * 0.8, w * 0.45, 'rgba(134,239,172,.65)')
      orb(ctx, w * 0.5, h * 0.5, w * 0.3, 'rgba(251,113,133,.35)')
    },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    css: 'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(186,230,253,.8) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 70%, rgba(147,197,253,.65) 0%, transparent 60%), linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%)',
    draw(ctx, w, h) {
      const base = ctx.createLinearGradient(0, 0, 0, h)
      base.addColorStop(0, '#f0f9ff')
      base.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.6, h * 0.2, w * 0.55, 'rgba(186,230,253,.8)')
      orb(ctx, w * 0.2, h * 0.7, w * 0.45, 'rgba(147,197,253,.65)')
    },
  },
  {
    id: 'neon',
    name: 'Neon City',
    css: 'radial-gradient(ellipse 60% 60% at 80% 30%, rgba(236,72,153,.65) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 20% 60%, rgba(6,182,212,.65) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 95%, rgba(99,102,241,.55) 0%, transparent 60%), #05060f',
    draw(ctx, w, h) {
      ctx.fillStyle = '#05060f'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.8, h * 0.3, w * 0.45, 'rgba(236,72,153,.65)')
      orb(ctx, w * 0.2, h * 0.6, w * 0.5, 'rgba(6,182,212,.65)')
      orb(ctx, w * 0.5, h * 0.95, w * 0.35, 'rgba(99,102,241,.55)')
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    css: 'radial-gradient(ellipse 70% 70% at 30% 30%, rgba(52,211,153,.55) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 70% 70%, rgba(16,185,129,.45) 0%, transparent 60%), linear-gradient(150deg, #022c22 0%, #064e3b 50%, #065f46 100%)',
    draw(ctx, w, h) {
      const base = ctx.createLinearGradient(0, 0, w * 0.5, h)
      base.addColorStop(0, '#022c22')
      base.addColorStop(0.5, '#064e3b')
      base.addColorStop(1, '#065f46')
      ctx.fillStyle = base
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.3, h * 0.3, w * 0.5, 'rgba(52,211,153,.55)')
      orb(ctx, w * 0.7, h * 0.7, w * 0.45, 'rgba(16,185,129,.45)')
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    css: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(99,102,241,.6) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 60%, rgba(59,130,246,.5) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 55% 95%, rgba(139,92,246,.4) 0%, transparent 60%), #02030e',
    draw(ctx, w, h) {
      ctx.fillStyle = '#02030e'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.3, h * 0.4, w * 0.5, 'rgba(99,102,241,.6)')
      orb(ctx, w * 0.8, h * 0.6, w * 0.45, 'rgba(59,130,246,.5)')
      orb(ctx, w * 0.55, h * 0.95, w * 0.3, 'rgba(139,92,246,.4)')
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    css: 'radial-gradient(ellipse 80% 70% at 50% 110%, rgba(251,146,60,.9) 0%, transparent 55%), radial-gradient(ellipse 60% 60% at 20% 20%, rgba(239,68,68,.65) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 10%, rgba(253,224,71,.45) 0%, transparent 60%), #0f0300',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0f0300'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.5, h * 1.1, w * 0.6, 'rgba(251,146,60,.9)')
      orb(ctx, w * 0.2, h * 0.2, w * 0.4, 'rgba(239,68,68,.65)')
      orb(ctx, w * 0.8, h * 0.1, w * 0.3, 'rgba(253,224,71,.45)')
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    css: 'radial-gradient(ellipse 80% 70% at 30% 30%, rgba(217,70,239,.65) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 70%, rgba(139,92,246,.6) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 60% 5%, rgba(244,63,94,.45) 0%, transparent 60%), #080010',
    draw(ctx, w, h) {
      ctx.fillStyle = '#080010'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.3, h * 0.3, w * 0.55, 'rgba(217,70,239,.65)')
      orb(ctx, w * 0.8, h * 0.7, w * 0.45, 'rgba(139,92,246,.6)')
      orb(ctx, w * 0.6, h * 0.05, w * 0.35, 'rgba(244,63,94,.45)')
    },
  },
  {
    id: 'steel',
    name: 'Steel',
    css: 'radial-gradient(ellipse 80% 60% at 25% 40%, rgba(148,163,184,.5) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 60%, rgba(100,116,139,.45) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 55% 100%, rgba(203,213,225,.3) 0%, transparent 60%), #060810',
    draw(ctx, w, h) {
      ctx.fillStyle = '#060810'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.25, h * 0.4, w * 0.5, 'rgba(148,163,184,.5)')
      orb(ctx, w * 0.8, h * 0.6, w * 0.45, 'rgba(100,116,139,.45)')
      orb(ctx, w * 0.55, h * 1.0, w * 0.3, 'rgba(203,213,225,.3)')
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    css: 'radial-gradient(ellipse 80% 70% at 20% 30%, rgba(251,207,232,.9) 0%, transparent 55%), radial-gradient(ellipse 70% 70% at 80% 65%, rgba(254,215,170,.75) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 60% 95%, rgba(249,168,212,.8) 0%, transparent 60%), #fff5f8',
    draw(ctx, w, h) {
      ctx.fillStyle = '#fff5f8'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.2, h * 0.3, w * 0.5, 'rgba(251,207,232,.9)')
      orb(ctx, w * 0.8, h * 0.65, w * 0.45, 'rgba(254,215,170,.75)')
      orb(ctx, w * 0.6, h * 0.95, w * 0.4, 'rgba(249,168,212,.8)')
    },
  },
  {
    id: 'lemon',
    name: 'Lemon Drop',
    css: 'radial-gradient(ellipse 80% 70% at 25% 30%, rgba(163,230,53,.7) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 70%, rgba(250,204,21,.65) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 55% 5%, rgba(74,222,128,.45) 0%, transparent 60%), #030a00',
    draw(ctx, w, h) {
      ctx.fillStyle = '#030a00'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.25, h * 0.3, w * 0.5, 'rgba(163,230,53,.7)')
      orb(ctx, w * 0.8, h * 0.7, w * 0.45, 'rgba(250,204,21,.65)')
      orb(ctx, w * 0.55, h * 0.05, w * 0.35, 'rgba(74,222,128,.45)')
    },
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    css: 'radial-gradient(ellipse 80% 70% at 25% 40%, rgba(251,113,133,.75) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 65%, rgba(45,212,191,.55) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 55% 5%, rgba(251,191,36,.5) 0%, transparent 60%), #0d0306',
    draw(ctx, w, h) {
      ctx.fillStyle = '#0d0306'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.25, h * 0.4, w * 0.5, 'rgba(251,113,133,.75)')
      orb(ctx, w * 0.8, h * 0.65, w * 0.45, 'rgba(45,212,191,.55)')
      orb(ctx, w * 0.55, h * 0.05, w * 0.35, 'rgba(251,191,36,.5)')
    },
  },
  {
    id: 'lilac',
    name: 'Lilac Dream',
    css: 'radial-gradient(ellipse 80% 70% at 25% 30%, rgba(196,181,253,.85) 0%, transparent 55%), radial-gradient(ellipse 70% 70% at 80% 70%, rgba(216,180,254,.75) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 55% 5%, rgba(167,243,208,.6) 0%, transparent 60%), #f7f3ff',
    draw(ctx, w, h) {
      ctx.fillStyle = '#f7f3ff'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.25, h * 0.3, w * 0.5, 'rgba(196,181,253,.85)')
      orb(ctx, w * 0.8, h * 0.7, w * 0.45, 'rgba(216,180,254,.75)')
      orb(ctx, w * 0.55, h * 0.05, w * 0.4, 'rgba(167,243,208,.6)')
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    css: 'radial-gradient(ellipse 80% 70% at 20% 35%, rgba(255,182,193,.8) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 65%, rgba(255,210,120,.7) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 55% 5%, rgba(255,150,170,.5) 0%, transparent 60%), #12050a',
    draw(ctx, w, h) {
      ctx.fillStyle = '#12050a'
      ctx.fillRect(0, 0, w, h)
      orb(ctx, w * 0.2, h * 0.35, w * 0.55, 'rgba(255,182,193,.8)')
      orb(ctx, w * 0.8, h * 0.65, w * 0.5, 'rgba(255,210,120,.7)')
      orb(ctx, w * 0.55, h * 0.05, w * 0.35, 'rgba(255,150,170,.5)')
    },
  },
]
