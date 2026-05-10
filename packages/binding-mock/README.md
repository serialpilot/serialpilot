<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/binding-mock</h1>
<p align="center"><em>In-memory mock binding for SerialPilot tests — no hardware required.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/binding-mock">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/binding-mock"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/binding-mock?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/binding-mock"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/binding-mock?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/binding-mock"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/binding-mock?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/binding-mock?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

In-memory mock binding for SerialPilot. Drive your code without hardware — same parsers, same API, virtual port underneath.

## Install

```sh
npm install --save-dev @serialpilot/binding-mock
```

## Usage

```js
import { SerialPilotMock, ReadlineParser } from 'serialpilot'
import { MockBinding } from '@serialpilot/binding-mock'

MockBinding.createPort('/dev/ROBOT', { echo: true })

const port = new SerialPilotMock({ path: '/dev/ROBOT', baudRate: 9600 })
const lines = port.pipe(new ReadlineParser({ delimiter: '\n' }))
lines.on('data', line => console.log(line.toString()))

port.write('hello\n')  // echoes back, lines emits 'hello'
```

`createPort` accepts `echo`, `record`, `readyData`, `respondTo`, `disconnectAfter`, `periodicData`, and more — see the [mocking guide](https://github.com/serialpilot/serialpilot#readme).
