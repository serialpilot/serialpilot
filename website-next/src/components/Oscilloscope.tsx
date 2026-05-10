import { useEffect, useRef, useState } from 'preact/hooks'
import { trace } from '~/lib/waveform'

type Props = { samples?: number }

export default function Oscilloscope({ samples = 240 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const txRef = useRef<SVGPathElement>(null)
  const rxRef = useRef<SVGPathElement>(null)
  const txCrispRef = useRef<SVGPathElement>(null)
  const rxCrispRef = useRef<SVGPathElement>(null)
  const rafRef = useRef<number | null>(null)

  const [size, setSize] = useState({ w: 1200, h: 480 })
  const [crosshair, setCrosshair] = useState<{ x: number, y: number, t: number, v: number } | null>(null)
  const [running, setRunning] = useState(true)

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) setRunning(false)
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const r = entries[0]?.contentRect
      if (r) setSize({ w: Math.max(320, r.width), h: Math.max(240, r.height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setRunning(!!entry?.isIntersecting),
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = performance.now()

    const tick = (now: number) => {
      const t = (now - start) / 1000
      const tx = trace(size.w, size.h, t, 0, samples)
      const rx = trace(size.w, size.h, t, 1, samples)

      let dTx = `M ${tx[0]!.x.toFixed(1)} ${tx[0]!.y.toFixed(1)}`
      for (let i = 1; i < tx.length; i++) dTx += ` L ${tx[i]!.x.toFixed(1)} ${tx[i]!.y.toFixed(1)}`
      let dRx = `M ${rx[0]!.x.toFixed(1)} ${rx[0]!.y.toFixed(1)}`
      for (let i = 1; i < rx.length; i++) dRx += ` L ${rx[i]!.x.toFixed(1)} ${rx[i]!.y.toFixed(1)}`

      txRef.current?.setAttribute('d', dTx)
      rxRef.current?.setAttribute('d', dRx)
      txCrispRef.current?.setAttribute('d', dTx)
      rxCrispRef.current?.setAttribute('d', dRx)

      if (running && !reduced) rafRef.current = requestAnimationFrame(tick)
    }

    if (reduced) {
      // single static frame
      tick(start)
    } else if (running) {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [running, size.w, size.h, samples])

  const onPointerMove = (e: PointerEvent) => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const tMs = (x / r.width) * 50 // 0–50ms across width
    const v = 1 - (y / r.height) * 2 // -1..1
    setCrosshair({ x, y, t: tMs, v })
  }

  const onPointerLeave = () => setCrosshair(null)

  // grid lines
  const minor = Array.from({ length: 30 }, (_, i) => i)
  const majorX = Array.from({ length: 7 }, (_, i) => i)
  const majorY = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div
      ref={wrapRef}
      class="osc"
      onPointerMove={onPointerMove as any}
      onPointerLeave={onPointerLeave as any}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="osc-glow-tx" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="oklch(0.78 0.18 45)" stop-opacity="0.0" />
            <stop offset="50%" stop-color="oklch(0.78 0.18 45)" stop-opacity="0.45" />
            <stop offset="100%" stop-color="oklch(0.78 0.18 45)" stop-opacity="0.0" />
          </linearGradient>
          <filter id="osc-blur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Minor grid — 1/30 width, 1/12 height */}
        <g stroke="var(--osc-grid)" stroke-width="0.5">
          {minor.map(i => (
            <line x1={(size.w * i) / 30} x2={(size.w * i) / 30} y1="0" y2={size.h} />
          ))}
          {Array.from({ length: 12 }, (_, i) => i).map(i => (
            <line x1="0" x2={size.w} y1={(size.h * i) / 12} y2={(size.h * i) / 12} />
          ))}
        </g>
        {/* Major grid */}
        <g stroke="var(--osc-grid-hot)" stroke-width="0.8">
          {majorX.map(i => (
            <line x1={(size.w * i) / 6} x2={(size.w * i) / 6} y1="0" y2={size.h} />
          ))}
          {majorY.map(i => (
            <line x1="0" x2={size.w} y1={(size.h * i) / 4} y2={(size.h * i) / 4} />
          ))}
        </g>

        {/* glow pass */}
        <path ref={txRef as any} fill="none" stroke="var(--trace-tx)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#osc-blur)" opacity="0.55" />
        <path ref={rxRef as any} fill="none" stroke="var(--trace-rx)" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#osc-blur)" opacity="0.45" />
        {/* crisp pass — kept in lock-step with glow pass via shared rAF tick */}
        <path ref={txCrispRef as any} fill="none" stroke="var(--trace-tx)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
        <path ref={rxCrispRef as any} fill="none" stroke="var(--trace-rx)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />

        {crosshair && (
          <g pointer-events="none">
            <line x1={crosshair.x} x2={crosshair.x} y1="0" y2={size.h} stroke="var(--signal)" stroke-width="0.7" stroke-dasharray="4 4" opacity="0.7" />
            <line x1="0" x2={size.w} y1={crosshair.y} y2={crosshair.y} stroke="var(--signal)" stroke-width="0.7" stroke-dasharray="4 4" opacity="0.7" />
          </g>
        )}
      </svg>

      {crosshair && (
        <div class="osc-readout" style={{ left: Math.min(crosshair.x + 14, size.w - 160), top: Math.max(crosshair.y - 36, 8) }}>
          <span>
            t=
            {crosshair.t.toFixed(2)}
            ms
          </span>
          <span>
            v=
            {crosshair.v.toFixed(2)}
            V
          </span>
        </div>
      )}

      <style>
        {`
        .osc-readout {
          position: absolute;
          padding: 0.4rem 0.6rem;
          font: 500 11px/1 var(--font-chrome);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: oklch(0.10 0.02 260 / 0.85);
          color: oklch(0.96 0.015 80);
          border: 1px solid oklch(0.96 0.015 80 / 0.18);
          border-radius: 4px;
          display: grid;
          gap: 0.2rem;
          pointer-events: none;
        }
      `}
      </style>
    </div>
  )
}
