<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-inter-byte-timeout</h1>
<p align="center"><em>Emit buffered data when no new bytes arrive for a configurable interval.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-inter-byte-timeout">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-inter-byte-timeout"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-inter-byte-timeout?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-inter-byte-timeout"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-inter-byte-timeout?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-inter-byte-timeout"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-inter-byte-timeout?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-inter-byte-timeout?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that emits buffered data when no new bytes have been received for a configurable interval. Useful for protocols whose frames are delimited by silence rather than a byte sequence (Modbus RTU, ASCII commands without trailing newline, etc.).

```bash
npm install @serialpilot/parser-inter-byte-timeout
```

## Usage

```js
const { SerialPilot, InterByteTimeoutParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new InterByteTimeoutParser({ interval: 30 }))
parser.on('data', console.log)
```

## API

### `new InterByteTimeoutParser({ interval, maxBufferSize })`

| Option          | Type   | Default | Description                                                  |
| --------------- | ------ | ------- | ------------------------------------------------------------ |
| `interval`      | number | —       | Required. Milliseconds of silence before emitting (>= 1).    |
| `maxBufferSize` | number | `65536` | Maximum bytes buffered before forcing emit.                  |

See the [SerialPilot README](../../README.md) for the full set of parsers.
