/**
 * Deterministic seeded waveform synthesis for the hero oscilloscope.
 * Decorative — not driven by real data.
 *
 * Two traces:
 *  - tx (warm): bursty packets with a carrier ripple
 *  - rx (cool): slower, replies offset in time
 *
 * Sampled in screen coordinates; caller supplies width/height.
 */

export type Sample = { x: number, y: number }

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(0xC0FFEE)
const noiseTable = Array.from({ length: 1024 }, () => rand() * 2 - 1)

function noise(i: number) {
  return noiseTable[((i % 1024) + 1024) % 1024]!
}

/**
 * Generate one trace at time t (seconds).
 * @param phase  0 = tx (orange), 1 = rx (green)
 */
export function trace(width: number, height: number, t: number, phase: 0 | 1, samples = 240): Sample[] {
  const out: Sample[] = new Array(samples)
  const midY = height * 0.5
  const amp = height * 0.30
  const offset = phase === 0 ? -height * 0.12 : height * 0.12

  // burst envelope — two overlapping packets
  const burst = (x: number) => {
    const phaseShift = phase === 0 ? 0 : 0.42
    const u = (x + t * 0.18 + phaseShift) % 1
    const e1 = Math.exp(-Math.pow((u - 0.22) * 6, 2))
    const e2 = Math.exp(-Math.pow((u - 0.62) * 5, 2)) * 0.85
    return e1 + e2
  }

  for (let i = 0; i < samples; i++) {
    const u = i / (samples - 1)
    const x = u * width

    const env = burst(u)
    const carrier = Math.sin((u * 26 + t * (phase === 0 ? 2.4 : 1.7)) * Math.PI * 2)
    const detail = Math.sin((u * 70 + t * 3) * Math.PI * 2) * 0.18
    const grit = noise(Math.floor(i + t * 60)) * 0.06

    const v = env * (carrier * 0.85 + detail) + grit
    const y = midY + offset + v * amp
    out[i] = { x, y }
  }

  return out
}

export function pathFromSamples(samples: Sample[]): string {
  if (samples.length === 0) return ''
  let d = `M ${samples[0]!.x.toFixed(2)} ${samples[0]!.y.toFixed(2)}`
  for (let i = 1; i < samples.length; i++) {
    d += ` L ${samples[i]!.x.toFixed(2)} ${samples[i]!.y.toFixed(2)}`
  }
  return d
}
