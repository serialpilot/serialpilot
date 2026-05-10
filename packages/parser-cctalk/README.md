<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-cctalk</h1>
<p align="center"><em>Parse the ccTalk protocol used by coin acceptors and bill validators.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-cctalk">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-cctalk"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-cctalk?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-cctalk"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-cctalk?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-cctalk"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-cctalk?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-cctalk?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream for parsing the [ccTalk protocol](https://en.wikipedia.org/wiki/CcTalk) used by coin acceptors and bill validators in vending machines and gaming hardware.

```bash
npm install @serialpilot/parser-cctalk
```

## Usage

```js
const { SerialPilot, CCTalkParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new CCTalkParser())
parser.on('data', frame => console.log(frame))
```

The parser emits each ccTalk frame as a Buffer when fully received.

See the [SerialPilot README](../../README.md) for the full set of parsers.
