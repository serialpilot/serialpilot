<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-regex</h1>
<p align="center"><em>Split a serial stream on a regular expression.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-regex">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-regex"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-regex?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-regex"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-regex?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-regex"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-regex?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-regex?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that splits incoming data on a regular expression rather than a fixed delimiter. Handy for protocols whose record separators vary (e.g. one of `\r`, `\n`, or `\r\n`).

```bash
npm install @serialpilot/parser-regex
```

## Usage

```js
const { SerialPilot, RegexParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new RegexParser({ regex: /\r?\n/ }))
parser.on('data', console.log)
```

## API

### `new RegexParser({ regex, encoding })`

| Option     | Type     | Default  | Description                              |
| ---------- | -------- | -------- | ---------------------------------------- |
| `regex`    | RegExp   | —        | Required. Pattern to split records on.   |
| `encoding` | string   | `'utf8'` | Text encoding for emitted strings.       |

See the [SerialPilot README](../../README.md) for the full set of parsers.
