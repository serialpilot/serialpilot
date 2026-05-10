<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-byte-length</h1>
<p align="center"><em>Emit a Buffer every time a fixed number of bytes arrives.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-byte-length">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-byte-length"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-byte-length?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-byte-length"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-byte-length?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-byte-length"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-byte-length?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-byte-length?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that emits data every time a fixed number of bytes have been received.

```bash
npm install @serialpilot/parser-byte-length
```

## Usage

```js
const { SerialPilot, ByteLengthParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new ByteLengthParser({ length: 8 }))
parser.on('data', console.log) // emits an 8-byte Buffer each time
```

## API

### `new ByteLengthParser({ length })`

| Option   | Type   | Description                                         |
| -------- | ------ | --------------------------------------------------- |
| `length` | number | Required. Number of bytes per emitted chunk (>= 1). |

Throws if `length` is missing, zero, negative, or non-numeric.

See the [SerialPilot README](../../README.md) for the full set of parsers.
