import { useEffect, useRef, useState } from 'preact/hooks'
import {
  type DemoLine,
  type DemoStream,
  isWebSerialSupported,
  openMockPort,
  openRealPort,
} from '~/lib/webserial'

type Status = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export default function WebSerialDemo() {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [baud, setBaud] = useState(115200)
  const [lines, setLines] = useState<DemoLine[]>([])
  const [usingMock, setUsingMock] = useState(false)
  const [portLabel, setPortLabel] = useState('')
  const streamRef = useRef<DemoStream | null>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSupported(isWebSerialSupported())
  }, [])

  useEffect(() => {
    consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight })
  }, [lines])

  async function pump(stream: DemoStream) {
    streamRef.current = stream
    setUsingMock(stream.mock)
    setPortLabel(stream.portLabel)
    setStatus('open')
    try {
      for await (const line of stream.lines()) {
        setLines(prev => {
          const next = [...prev, line]
          return next.length > 200 ? next.slice(-200) : next
        })
      }
    } catch (e: any) {
      setError(e?.message ?? 'Stream error')
      setStatus('error')
    }
  }

  async function connectReal() {
    setError(null)
    setStatus('connecting')
    try {
      const stream = await openRealPort(baud)
      await pump(stream)
    } catch (e: any) {
      setError(e?.message ?? 'Connection failed')
      setStatus('error')
    }
  }

  function tryMock() {
    setError(null)
    setLines([])
    const stream = openMockPort()
    pump(stream)
  }

  async function disconnect() {
    await streamRef.current?.close()
    streamRef.current = null
    setStatus('closed')
  }

  function clearConsole() {
    setLines([])
  }

  return (
    <div class="ws-demo">
      <div class="ws-demo__head">
        <div class="ws-demo__indicator" data-status={status}>
          <span class="ws-demo__dot" />
          <span class="ws-demo__status-label">
            {status === 'idle' && 'idle'}
            {status === 'connecting' && 'connecting…'}
            {status === 'open' && (usingMock ? 'mock stream open' : 'connected')}
            {status === 'closed' && 'closed'}
            {status === 'error' && 'error'}
          </span>
          {portLabel && <span class="ws-demo__port">{portLabel}</span>}
        </div>

        <div class="ws-demo__controls">
          <label class="ws-demo__field">
            <span>baud</span>
            <select
              value={String(baud)}
              onChange={(e: any) => setBaud(parseInt(e.currentTarget.value, 10))}
              disabled={status === 'open' || status === 'connecting'}
            >
              {[9600, 19200, 38400, 57600, 115200, 230400, 460800].map(b => (
                <option value={b}>{b}</option>
              ))}
            </select>
          </label>

          {status !== 'open' && supported && (
            <button class="btn btn--solid btn--sm" onClick={connectReal} disabled={status === 'connecting'}>
              {status === 'connecting' ? 'Requesting…' : 'Connect a real port'}
            </button>
          )}
          {status !== 'open' && (
            <button class="btn btn--ghost btn--sm" onClick={tryMock}>
              {supported ? 'Try a mock stream' : 'Run the demo (mock)'}
            </button>
          )}
          {status === 'open' && (
            <button class="btn btn--ghost btn--sm" onClick={disconnect}>Disconnect</button>
          )}
          {lines.length > 0 && status !== 'connecting' && (
            <button class="btn btn--ghost btn--sm" onClick={clearConsole}>Clear</button>
          )}
        </div>
      </div>

      {!supported && (
        <p class="ws-demo__notice">
          <strong>Heads up:</strong>
          {' '}
          WebSerial isn't supported in this browser
          (Safari and Firefox don't ship it yet). The mock stream below works
          everywhere and uses the same parser pipeline you'd run against a real
          port — no hardware required.
        </p>
      )}

      {error && <p class="ws-demo__notice ws-demo__notice--error">{error}</p>}

      <div class="ws-demo__console" ref={consoleRef as any} aria-live="polite" aria-label="Serial console output">
        {lines.length === 0
          ? (
              <p class="ws-demo__empty">— waiting for bytes —</p>
            )
          : (
              lines.map(l => (
                <div class={`ws-line ws-line--${l.dir}`}>
                  <span class="ws-line__ts">
                    {l.ts.toFixed(0).padStart(5, ' ')}
                    ms
                  </span>
                  <span class="ws-line__dir">{l.dir.toUpperCase()}</span>
                  <span class="ws-line__text">{l.text}</span>
                </div>
              ))
            )}
      </div>

      <style>
        {`
        .ws-demo {
          border: 1px solid var(--rule);
          border-radius: var(--radius-2);
          background: light-dark(oklch(0.13 0.018 260), oklch(0.10 0.018 260));
          color: oklch(0.92 0.015 80);
          overflow: hidden;
        }
        .ws-demo__head {
          display: flex;
          flex-wrap: wrap;
          gap: var(--s-3);
          align-items: center;
          justify-content: space-between;
          padding: var(--s-3) var(--s-4);
          background: oklch(0.96 0.015 80 / 0.04);
          border-bottom: 1px solid oklch(0.96 0.015 80 / 0.10);
        }
        .ws-demo__indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font: 500 var(--t-xs)/1 var(--font-chrome);
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: oklch(0.78 0.015 80 / 0.8);
        }
        .ws-demo__dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: oklch(0.78 0.015 80 / 0.4);
        }
        .ws-demo__indicator[data-status="connecting"] .ws-demo__dot { background: var(--trace-aux); animation: pulse 1.2s ease-in-out infinite; }
        .ws-demo__indicator[data-status="open"]       .ws-demo__dot { background: var(--trace-rx); box-shadow: 0 0 12px var(--trace-rx); }
        .ws-demo__indicator[data-status="error"]      .ws-demo__dot { background: var(--trace-err); }
        @keyframes pulse { 50% { opacity: 0.3; } }

        .ws-demo__port { color: oklch(0.78 0.015 80 / 0.5); margin-left: 0.6rem; text-transform: none; letter-spacing: 0; }

        .ws-demo__controls { display: inline-flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
        .ws-demo__field {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font: 500 var(--t-xs)/1 var(--font-chrome);
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: oklch(0.78 0.015 80 / 0.7);
        }
        .ws-demo__field select {
          background: oklch(0.10 0.018 260);
          color: oklch(0.92 0.015 80);
          border: 1px solid oklch(0.96 0.015 80 / 0.18);
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
          font: 500 var(--t-xs) var(--font-mono);
        }
        .btn--sm { padding: 0.55em 0.95em; font-size: var(--t-xs); }
        .ws-demo .btn--ghost { color: oklch(0.92 0.015 80); box-shadow: inset 0 0 0 1px oklch(0.96 0.015 80 / 0.2); background: transparent; }
        .ws-demo .btn--ghost:hover { background: oklch(0.96 0.015 80 / 0.08); }
        .ws-demo .btn--solid { background: var(--signal); color: oklch(0.10 0.018 260); }

        .ws-demo__notice {
          margin: 0;
          padding: var(--s-3) var(--s-4);
          font-size: var(--t-sm);
          color: oklch(0.92 0.015 80 / 0.75);
          background: oklch(0.96 0.015 80 / 0.04);
          border-bottom: 1px solid oklch(0.96 0.015 80 / 0.08);
        }
        .ws-demo__notice strong { color: var(--trace-tx); }
        .ws-demo__notice--error { color: var(--trace-err); }

        .ws-demo__console {
          height: 280px;
          overflow-y: auto;
          padding: var(--s-3);
          font: 400 var(--t-sm)/1.55 var(--font-mono);
          background:
            repeating-linear-gradient(to bottom, transparent 0, transparent 1.55em, oklch(0.96 0.015 80 / 0.02) 1.55em, oklch(0.96 0.015 80 / 0.02) 3.10em);
        }
        .ws-demo__empty {
          margin: 0;
          color: oklch(0.78 0.015 80 / 0.4);
          font-style: italic;
          padding: var(--s-3);
        }
        .ws-line {
          display: grid;
          grid-template-columns: 6ch 4ch 1fr;
          gap: 1ch;
          padding: 0.05rem 0;
          opacity: 0;
          animation: line-in 200ms var(--ease-out) forwards;
        }
        @keyframes line-in { to { opacity: 1; } }
        .ws-line__ts  { color: oklch(0.78 0.015 80 / 0.4); }
        .ws-line__dir { font-weight: 500; }
        .ws-line--tx .ws-line__dir { color: var(--trace-tx); }
        .ws-line--rx .ws-line__dir { color: var(--trace-rx); }
        .ws-line__text { color: oklch(0.96 0.015 80 / 0.92); white-space: pre-wrap; word-break: break-all; }
      `}
      </style>
    </div>
  )
}
