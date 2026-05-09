/**
 * Thin WebSerial wrapper + deterministic mock fallback.
 * Returns a unified async-iterable of decoded text lines for the demo.
 */

export type DemoLine = {
  ts: number;          // ms since open
  dir: 'tx' | 'rx';
  text: string;
};

export interface DemoStream {
  readonly mock: boolean;
  readonly portLabel: string;
  lines(): AsyncIterable<DemoLine>;
  close(): Promise<void>;
}

export function isWebSerialSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

/** Open a real port via WebSerial. Caller already gated this on support. */
export async function openRealPort(baudRate = 115200): Promise<DemoStream> {
  // @ts-expect-error -- navigator.serial is non-standard in TS lib
  const port: any = await navigator.serial.requestPort();
  await port.open({ baudRate });

  const info = port.getInfo?.() ?? {};
  const portLabel = `usb${info.usbVendorId ? ` ${info.usbVendorId.toString(16)}:${(info.usbProductId ?? 0).toString(16)}` : ''} @ ${baudRate}`;

  const t0 = performance.now();
  const decoder = new TextDecoderStream();
  const closer = port.readable.pipeTo(decoder.writable).catch(() => {});
  const reader = decoder.readable.getReader();

  let closed = false;
  let buf = '';

  async function* lines(): AsyncIterable<DemoLine> {
    try {
      while (!closed) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        buf += value;
        let i: number;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).replace(/\r$/, '');
          buf = buf.slice(i + 1);
          if (line.length) yield { ts: performance.now() - t0, dir: 'rx', text: line };
        }
      }
    } catch (_) {
      // swallow — close path will resolve
    }
  }

  return {
    mock: false,
    portLabel,
    lines,
    async close() {
      closed = true;
      try { await reader.cancel(); } catch (_) {}
      try { await port.close(); } catch (_) {}
      await closer;
    },
  };
}

/**
 * Deterministic in-browser mock that produces ccTalk-ish frames.
 * Uses setInterval — paused when document is hidden.
 */
export function openMockPort(): DemoStream {
  const t0 = performance.now();
  let timer: ReturnType<typeof setInterval> | null = null;
  let pushers: Array<(line: DemoLine) => void> = [];
  let closed = false;

  const queue: DemoLine[] = [];
  let resolveNext: ((line: DemoLine) => void) | null = null;

  function emit(line: DemoLine) {
    if (resolveNext) {
      const r = resolveNext;
      resolveNext = null;
      r(line);
    } else {
      queue.push(line);
    }
  }

  // Simulated session — handshake then periodic frames
  const script: Array<{ at: number; line: Omit<DemoLine, 'ts'> }> = [
    { at: 80,  line: { dir: 'tx', text: '$ open /dev/ROBOT 9600' } },
    { at: 220, line: { dir: 'rx', text: '[boot] firmware v1.4.2 — 64KB free' } },
    { at: 380, line: { dir: 'tx', text: 'PING' } },
    { at: 520, line: { dir: 'rx', text: 'PONG t=0.42ms' } },
  ];
  let scriptIdx = 0;

  // periodic heartbeats once script drains
  let heartbeat = 1;

  timer = setInterval(() => {
    if (closed) return;
    const t = performance.now() - t0;
    while (scriptIdx < script.length && script[scriptIdx]!.at <= t) {
      emit({ ts: t, ...script[scriptIdx]!.line });
      scriptIdx++;
    }
    if (scriptIdx >= script.length) {
      // every ~700ms emit a frame
      if (heartbeat % 7 === 0) {
        const v = (Math.sin(t / 800) * 0.5 + 0.5).toFixed(3);
        emit({ ts: t, dir: 'rx', text: `frame[${heartbeat.toString().padStart(4, '0')}]  v=${v}V  rssi=-${(40 + (heartbeat % 11)).toString()}dBm` });
      }
      heartbeat++;
    }
  }, 100);

  async function* lines(): AsyncIterable<DemoLine> {
    while (!closed) {
      if (queue.length) {
        yield queue.shift()!;
      } else {
        const next = await new Promise<DemoLine | null>((r) => {
          resolveNext = r as any;
          // closure-safe close: tick periodically to check
          const guard = setInterval(() => {
            if (closed) { clearInterval(guard); r(null); }
          }, 250);
        });
        if (next) yield next;
      }
    }
  }

  return {
    mock: true,
    portLabel: '/dev/ROBOT (simulated)',
    lines,
    async close() {
      closed = true;
      if (timer) clearInterval(timer);
      if (resolveNext) { const r = resolveNext; resolveNext = null; r(null as any); }
    },
  };
}
