<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/command-queue</h1>
<p align="center"><em>Request-response command queue — AT commands, Modbus RTU, half-duplex serial protocols.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/command-queue">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/command-queue"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/command-queue?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/command-queue"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/command-queue?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/command-queue"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/command-queue?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/command-queue?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Request-response command queue for SerialPilot. Useful for AT commands, Modbus RTU, and other serial protocols that require send-then-wait-for-response patterns.

## Usage

```js
const { SerialPilot } = require('serialpilot')
const { SerialCommandQueue } = require('@serialpilot/command-queue')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const modem = new SerialCommandQueue({ port, timeout: 3000, lineEnding: '\r\n' })

async function main() {
  const signal = await modem.command('AT+CSQ')
  console.log('Signal quality:', signal)
}

main()
```

## API

### `new SerialCommandQueue(options)`

- `port` — SerialPilotStream instance
- `timeout` — ms per command (default: `3000`)
- `lineEnding` — appended to each command (default: `'\r\n'`)
- `delimiter` — response line delimiter (default: `'\n'`)
- `retryCount` — retries on timeout (default: `0`)
- `retryDelay` — ms between retries (default: `1000`)

### Methods

- `command(cmd, options?)` — Send command, wait for response. Returns `Promise<string>`.
  - `options.timeout` — Override default timeout
  - `options.expect` — RegExp to match response
- `write(data)` — Write data without waiting for response

### Events

- `response` — `(command, response)` when a response is received
- `error` — `(error)` on timeout or other errors
- `idle` — When queue empties
