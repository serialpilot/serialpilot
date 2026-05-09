<p align="center">
  <a href="https://github.com/riteshrana/serialpilot">
    <img src="https://raw.githubusercontent.com/riteshrana/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/terminal</h1>
<p align="center"><em>`serialpilot-terminal` — interactive console for talking to a serial port.</em></p>

<p align="center">
  <a href="https://github.com/riteshrana/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/terminal">npm</a> ·
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/terminal"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/terminal?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/terminal"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/terminal?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/terminal"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/terminal?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/terminal?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/riteshrana/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

Interactive serial console — connect, type, see live response. Exit on **Ctrl-C**.

## Install

```sh
npm install -g @serialpilot/terminal
```

## Usage

```sh
serialpilot-terminal --list
serialpilot-terminal -p /dev/tty.usbmodem1421 -b 115200
```

| Flag | Default | Notes |
|------|---------|-------|
| `-p`, `--path` | — | Device path (required unless `--list`) |
| `-b`, `--baud` | — | Baud rate (required unless `--list`) |
| `--databits` | `8` | 5 / 6 / 7 / 8 |
| `--parity` | `none` | `none` / `even` / `odd` / `mark` / `space` |
| `--stopbits` | `1` | 1 / 1.5 / 2 |
| `--no-echo` | — | Don't print characters as you type them |
| `--flow-ctl` | — | `XONOFF` / `RTSCTS` |

See the [CLI docs](https://github.com/riteshrana/serialpilot#readme) for full reference.
