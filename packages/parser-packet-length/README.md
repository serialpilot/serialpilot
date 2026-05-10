<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-packet-length</h1>
<p align="center"><em>Length-prefixed packet framing — read the length field, wait for the full packet, emit.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-packet-length">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-packet-length"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-packet-length?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-packet-length"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-packet-length?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-packet-length"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-packet-length?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-packet-length?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream for protocols that prefix each packet with its length. Reads the length field at a configured offset and emits a complete packet once that many bytes have been received.

```bash
npm install @serialpilot/parser-packet-length
```

## Usage

```js
const { SerialPilot, PacketLengthParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new PacketLengthParser({
  delimiter: 0xa5,        // packet header byte
  packetOverhead: 5,      // bytes outside the payload
  lengthBytes: 1,         // size of the length field
  lengthOffset: 2,        // byte offset of the length field
  maxLen: 0xff,           // largest valid packet
}))
parser.on('data', console.log)
```

## API

### `new PacketLengthParser(options)`

| Option           | Type   | Default | Description                                |
| ---------------- | ------ | ------- | ------------------------------------------ |
| `delimiter`      | number | `0xaa`  | Header byte that begins each packet.       |
| `packetOverhead` | number | `2`     | Non-payload bytes per packet.              |
| `lengthBytes`    | number | `1`     | Size of the length field in bytes.         |
| `lengthOffset`   | number | `1`     | Byte offset of the length field.           |
| `maxLen`         | number | `0xff`  | Maximum allowed packet length.             |

See the [SerialPilot README](../../README.md) for the full set of parsers.
