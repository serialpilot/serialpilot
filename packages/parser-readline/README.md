<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-readline</h1>
<p align="center"><em>Line-by-line text framing for serial streams.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-readline">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-readline"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-readline?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-readline"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-readline?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-readline"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-readline?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-readline?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that emits each line of text from the serial port. Built on top of `@serialpilot/parser-delimiter` with sensible defaults for line-oriented protocols.

```bash
npm install @serialpilot/parser-readline
```

## Usage

```js
const { SerialPilot, ReadlineParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', line => console.log(line))
```

## API

### `new ReadlineParser({ delimiter, encoding, includeDelimiter })`

| Option             | Type                   | Default     | Description                            |
| ------------------ | ---------------------- | ----------- | -------------------------------------- |
| `delimiter`        | `string \| Buffer`     | `'\n'`      | Line terminator.                       |
| `encoding`         | string                 | `'utf8'`    | Text encoding for emitted strings.     |
| `includeDelimiter` | boolean                | `false`     | Whether emitted lines include the delimiter. |

Strings are emitted; pipe through another stream if you need raw buffers.

See the [SerialPilot README](../../README.md) for the full set of parsers.
