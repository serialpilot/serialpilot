<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">serialpilot</h1>
<p align="center"><em>Access serial ports with JavaScript. Linux, macOS, and Windows.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/serialpilot">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/serialpilot"><img alt="npm" src="https://img.shields.io/npm/v/serialpilot?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/serialpilot"><img alt="downloads" src="https://img.shields.io/npm/dm/serialpilot?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/serialpilot"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/serialpilot?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/serialpilot?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
  <a href="https://buymeacoffee.com/ritesh.rana"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black"></a>
</p>

---

The meta package — native bindings, stream wrapper, and every parser re-exported. Most projects only need this one.

## Install

```sh
npm install serialpilot
```

## Usage

```js
import { SerialPilot, ReadlineParser } from 'serialpilot'

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 115200 })
const lines = port.pipe(new ReadlineParser({ delimiter: '\n' }))
lines.on('data', line => console.log(line))

port.write('PING\n')
```

Discover ports with `SerialPilot.list()` or pin to a fingerprint with `SerialPilot.findPorts({ vendorId: '2341' })`.

See the full API and recipes at the [SerialPilot docs](https://github.com/serialpilot/serialpilot#readme).
