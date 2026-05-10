<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-start-end</h1>
<p align="center"><em>Emit only the bytes between configured start and end byte sequences.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-start-end">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-start-end"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-start-end?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-start-end"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-start-end?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-start-end"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-start-end?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-start-end?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that emits data only when bracketed by configured start and end byte sequences. Useful for protocols whose frames begin with a header marker and finish with a trailer (NMEA, custom binary frames).

```bash
npm install @serialpilot/parser-start-end
```

## Usage

```js
const { SerialPilot, StartEndParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new StartEndParser({
  startDelimiter: Buffer.from([0xa5]),
  endDelimiter: Buffer.from([0x5a]),
}))
parser.on('data', frame => console.log(frame))
```

## API

### `new StartEndParser({ startDelimiter, endDelimiter, includeDelimiter })`

| Option             | Type                | Default | Description                                              |
| ------------------ | ------------------- | ------- | -------------------------------------------------------- |
| `startDelimiter`   | `Buffer \| string`  | —       | Required. Byte sequence that opens a frame.              |
| `endDelimiter`     | `Buffer \| string`  | —       | Required. Byte sequence that closes a frame.             |
| `includeDelimiter` | boolean             | `false` | Whether emitted chunks include the start/end markers.    |

See the [SerialPilot README](../../README.md) for the full set of parsers.
