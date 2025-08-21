import confetti from 'canvas-confetti'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function fireStarConfetti(origin?: { x: number; y: number }, funModeEnabled = true) {
  if (prefersReducedMotion() || !funModeEnabled) return
  
  // Fallback: if shapeFromPath is unavailable, just fire normal confetti
  const hasShapeFromPath = typeof (confetti as any).shapeFromPath === 'function'
  let shapes: any[] = []
  
  if (hasShapeFromPath) {
    const star = (confetti as any).shapeFromPath({
      path: 'M16 0 L20 10 L32 12 L22 20 L24 32 L16 26 L8 32 L10 20 L0 12 L12 10 Z'
    })
    shapes = [star]
  }
  
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 45,
    gravity: 0.9,
    ticks: 200,
    scalar: 0.9,
    origin: origin ?? { x: 0.5, y: 0.45 },
    shapes: shapes.length ? shapes : undefined,
    colors: ['#fbbf24', '#a78bfa', '#7dd3fc', '#a3e635', '#fda4af']
  })
}

export function fireMultipleStarConfetti(funModeEnabled = true) {
  if (prefersReducedMotion() || !funModeEnabled) return
  
  // Fire from multiple origins for extra celebration
  setTimeout(() => fireStarConfetti({ x: 0.25, y: 0.6 }, funModeEnabled), 0)
  setTimeout(() => fireStarConfetti({ x: 0.75, y: 0.6 }, funModeEnabled), 150)
  setTimeout(() => fireStarConfetti({ x: 0.5, y: 0.4 }, funModeEnabled), 300)
}
