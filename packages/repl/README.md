<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/repl</h1>
<p align="center"><em>`serialpilot-repl` — scriptable Node REPL with SerialPilot in scope.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/repl">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/repl"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/repl?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/repl"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/repl?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/repl"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/repl?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/repl?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Scriptable Node REPL with `SerialPilot` and `SerialPilotMock` already in scope — the fastest way to poke at a device interactively.

## Install

```sh
npm install -g @serialpilot/repl
```

## Usage

```sh
serialpilot-repl
```

```text
> port = new SerialPilot({ path: '/dev/tty.usbmodem1421', baudRate: 9600 })
> port.on('data', console.log)
> port.write('PING\n')
```

Set `DEBUG=serialpilot*` for per-binding tracing. The REPL honours `NODE_OPTIONS`, so `--inspect` works.
