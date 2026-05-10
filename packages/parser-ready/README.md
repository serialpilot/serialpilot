<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-ready</h1>
<p align="center"><em>Buffer until a configured sentinel arrives, then forward everything after it.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-ready">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-ready"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-ready?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-ready"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-ready?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-ready"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-ready?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-ready?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that buffers incoming data until a configured ready sequence has been received, then emits a `ready` event and forwards everything afterwards as plain stream data. Useful for boards (Arduino, ESP) that print a banner when they boot.

```bash
npm install @serialpilot/parser-ready
```

## Usage

```js
const { SerialPilot, ReadyParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new ReadyParser({ delimiter: 'READY' }))
parser.on('ready', () => console.log('Device is ready'))
parser.on('data', console.log) // data after the banner
```

## API

### `new ReadyParser({ delimiter })`

| Option      | Type               | Description                                  |
| ----------- | ------------------ | -------------------------------------------- |
| `delimiter` | `string \| Buffer` | Required. The byte sequence to wait for.     |

See the [SerialPilot README](../../README.md) for the full set of parsers.
