<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/reconnect</h1>
<p align="center"><em>Auto-reconnect wrapper for SerialPilot — survive cable yanks and device resets.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/reconnect">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/reconnect"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/reconnect?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/reconnect"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/reconnect?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/reconnect"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/reconnect?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/reconnect?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Auto-reconnect wrapper for SerialPilot.

## Usage

```js
const { SerialPilot } = require('serialpilot')
const { SerialPilotReconnect } = require('@serialpilot/reconnect')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600, autoOpen: false })
const reconnect = new SerialPilotReconnect({
  port,
  reconnectInterval: 1000,
  maxReconnectAttempts: 10,
  backoffFactor: 1.5,
})

reconnect.on('reconnecting', (attempt) => console.log(`Reconnect attempt ${attempt}`))
reconnect.on('reconnected', (attempt) => console.log(`Reconnected after ${attempt} attempts`))
reconnect.on('reconnect-failed', () => console.log('All reconnect attempts failed'))

reconnect.start()
port.open()
```

## API

### `new SerialPilotReconnect(options)`

- `port` — SerialPilotStream instance to manage
- `autoReconnect` — Enable auto-reconnect (default: `true`)
- `reconnectInterval` — ms between attempts (default: `1000`)
- `maxReconnectAttempts` — Maximum attempts (default: `Infinity`)
- `backoffFactor` — Exponential backoff multiplier (default: `1`)
- `maxReconnectInterval` — Cap for backoff in ms (default: `30000`)
- `deviceFilter` — DeviceFilter to use when searching for device on reconnect
- `onDisconnect` — Callback on disconnect
- `onReconnect` — Callback on successful reconnect
- `onReconnectFailed` — Callback when all attempts exhausted

### Events

- `reconnecting` — Emitted on each reconnect attempt
- `reconnected` — Emitted on successful reconnect
- `reconnect-failed` — Emitted when all attempts exhausted
- `disconnect` — Emitted when device disconnects

### Methods

- `start()` — Begin monitoring for disconnects
- `stop()` — Stop monitoring and cancel pending reconnection
- `forceReconnect()` — Immediately attempt reconnection
