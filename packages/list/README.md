<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/list</h1>
<p align="center"><em>`serialpilot-list` — enumerate every serial port the OS knows about.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/list">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/list"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/list?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/list"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/list?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/list"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/list?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/list?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Enumerate every serial port the OS knows about — the fastest way to verify your device is visible.

## Install

```sh
npm install -g @serialpilot/list
```

## Usage

```sh
serialpilot-list
serialpilot-list --format json
serialpilot-list --format jsonl    # one JSON object per line
```

Pipe `--format json` into `jq` for ad-hoc filtering:

```sh
serialpilot-list --format json | jq '.[] | select(.manufacturer | test("arduino"; "i"))'
```

| Flag | Default | Notes |
|------|---------|-------|
| `-f`, `--format` | `text` | `text` / `json` / `jsonl` / `jsonline` |
| `-h`, `--help` | — | Show usage |
