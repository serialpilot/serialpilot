<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/parser-spacepacket</h1>
<p align="center"><em>CCSDS Space Packet framing for spacecraft telemetry/telecommand links.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/parser-spacepacket">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/parser-spacepacket"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/parser-spacepacket?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/parser-spacepacket"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/parser-spacepacket?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/parser-spacepacket"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/parser-spacepacket?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/parser-spacepacket?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

A Transform stream that parses [CCSDS Space Packet](https://public.ccsds.org/Pubs/133x0b2e1.pdf) framing — the international standard used by spacecraft telemetry/telecommand links (NASA, ESA, JAXA cubesat ground stations).

```bash
npm install @serialpilot/parser-spacepacket
```

## Usage

```js
const { SerialPilot, SpacePacketParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new SpacePacketParser())
parser.on('data', packet => {
  console.log(packet.header.apid, packet.data)
})
```

## API

The parser emits `SpacePacket` objects with parsed primary header fields (version, type, secondary-header flag, APID, sequence flags, sequence count, length) and the raw data payload.

See the [SerialPilot README](../../README.md) for the full set of parsers.
