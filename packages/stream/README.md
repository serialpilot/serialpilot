<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/stream</h1>
<p align="center"><em>Node.js Duplex stream wrapper around any SerialPilot binding.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/stream">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/stream"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/stream?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/stream"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/stream?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/stream"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/stream?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/stream?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Node.js Duplex stream wrapper around any SerialPilot binding. The base class that `SerialPilot` extends — useful directly only if you want a stream over a custom binding.

## Install

```sh
npm install @serialpilot/stream @serialpilot/bindings-cpp
```

## Usage

```js
import { SerialPilotStream } from '@serialpilot/stream'
import { autoDetect } from '@serialpilot/bindings-cpp'

const port = new SerialPilotStream({
  binding: autoDetect(),
  path: '/dev/ttyUSB0',
  baudRate: 9600,
})

port.on('data', console.log)
port.write('PING\n')
```

Most users want the higher-level [`serialpilot`](https://www.npmjs.com/package/serialpilot) meta package instead.
