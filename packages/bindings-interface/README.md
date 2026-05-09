<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/bindings-interface</h1>
<p align="center"><em>TypeScript surface every SerialPilot binding implements.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-interface">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-interface"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/bindings-interface?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-interface"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/bindings-interface?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/bindings-interface"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/bindings-interface?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/bindings-interface?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

TypeScript interface every SerialPilot binding implements. Import this if you're authoring a custom binding (a virtual port, a TCP-bridged port, an alternative native backend) — or just for the shared error classes.

## Install

```sh
npm install @serialpilot/bindings-interface
```

## Usage

```ts
import type { BindingInterface } from '@serialpilot/bindings-interface'
import { CancelledError, PortNotFoundError } from '@serialpilot/bindings-interface'

const MyBinding: BindingInterface = {
  async list() { /* … */ },
  async open(options) { /* … */ },
}
```

The error classes (`PortNotFoundError`, `PermissionDeniedError`, `DisconnectedError`, `CancelledError`, `TimeoutError`, …) are also re-exported from the meta `serialpilot` package.

See the [SerialPilot package matrix](https://github.com/riteshrana/serialpilot#readme) for how the layers fit together.
