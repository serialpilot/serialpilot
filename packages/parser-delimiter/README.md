<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-delimiter</h1>
<p align="center"><em>Emit data each time a configured delimiter is received.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-delimiter">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-delimiter"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-delimiter?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-delimiter"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-delimiter?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-delimiter"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-delimiter?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-delimiter?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that emits data each time a delimiter is received in the stream.

```bash
npm install @serialpilot/parser-delimiter
```

## Usage

```js
const { SerialPilot, DelimiterParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new DelimiterParser({ delimiter: '\n' }))
parser.on('data', console.log)
```

## API

### `new DelimiterParser({ delimiter, includeDelimiter })`

| Option             | Type                            | Default | Description                                              |
| ------------------ | ------------------------------- | ------- | -------------------------------------------------------- |
| `delimiter`        | `string \| Buffer \| number[]`  | —       | Required. Bytes that delimit messages (length >= 1).     |
| `includeDelimiter` | boolean                         | `false` | Whether emitted chunks include the delimiter.            |

See the [SerialPilot README](../../README.md) for the full set of parsers.
