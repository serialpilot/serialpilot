<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-slip-encoder</h1>
<p align="center"><em>RFC 1055 SLIP framing — encode and decode self-delimiting binary frames.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-slip-encoder">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-slip-encoder"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-slip-encoder?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-slip-encoder"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-slip-encoder?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-slip-encoder"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-slip-encoder?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-slip-encoder?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Streams that encode and decode [SLIP](https://datatracker.ietf.org/doc/html/rfc1055) (Serial Line Internet Protocol) framing — useful for sending self-delimiting binary frames over a serial link (esp. ESP-IDF firmware tools, embedded MCUs).

```bash
npm install @serialpilot/parser-slip-encoder
```

## Usage

```js
const { SerialPilot, SlipEncoder, SlipDecoder } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })

const decoder = port.pipe(new SlipDecoder())
decoder.on('data', frame => console.log('frame:', frame))

const encoder = new SlipEncoder()
encoder.pipe(port)
encoder.write(Buffer.from([0x01, 0x02, 0xc0])) // 0xc0 escaped automatically
```

## API

`SlipEncoder` and `SlipDecoder` are Transform streams that operate on Buffers. Both honor the standard SLIP byte values (`END=0xC0`, `ESC=0xDB`, `ESC_END=0xDC`, `ESC_ESC=0xDD`).

See the [SerialPilot README](../../README.md) for the full set of parsers.
