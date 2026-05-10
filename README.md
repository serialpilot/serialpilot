<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="assets/serialpilot-logo.png" width="180" height="180" alt="SerialPilot">
  </a>
</p>

<h1 align="center">SerialPilot</h1>
<p align="center"><em>Talk to hardware. From JavaScript.</em></p>
<p align="center">Cross-platform serial-port toolkit for Node.js — Linux, macOS, and Windows.</p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/serialpilot">npm</a> ·
  <a href="./CHANGELOG.md">Changelog</a> ·
  <a href="./CONTRIBUTING.md">Contributing</a> ·
  <a href="./LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot/actions/workflows/node-ci.yml"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/serialpilot/serialpilot/node-ci.yml?branch=main&style=flat-square&label=CI"></a>
  <a href="https://codecov.io/gh/serialpilot/serialpilot"><img alt="Coverage" src="https://img.shields.io/codecov/c/github/serialpilot/serialpilot?style=flat-square"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/serialpilot/serialpilot"><img alt="OpenSSF Scorecard" src="https://api.scorecard.dev/projects/github.com/serialpilot/serialpilot/badge"></a>
  <a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
  <a href="https://buymeacoffee.com/ritesh.rana"><img alt="Buy Me a Coffee" src="https://img.shields.io/badge/Buy%20me%20a%20coffee-%E2%98%95-FFDD00?style=flat-square&logo=buymeacoffee&logoColor=black"></a>
</p>

---

## Install

```sh
npm install serialpilot
```

```js
import { SerialPilot, ReadlineParser } from 'serialpilot'

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 115200 })
const lines = port.pipe(new ReadlineParser({ delimiter: '\n' }))
lines.on('data', line => console.log(line))

port.write('PING\n')
```

## Quick links

- [API documentation](https://github.com/serialpilot/serialpilot#readme)
- [Recipes](docs/recipes/) — Arduino, Modbus RTU, Electron, Docker, error handling, reconnect
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)

### Main package

- [`serialpilot`](packages/serialpilot) — chances are you're looking for this. Provides good defaults for most projects, but it's easy to mix and match the parts of SerialPilot you need.

### Bindings

The bindings provide a low-level interface to your serial port. They can be used standalone, but are usually paired with an interface.

- [`@serialpilot/bindings-cpp`](packages/bindings-cpp) — native C++/NAPI bindings for Linux, macOS, and Windows.
- [`@serialpilot/bindings-interface`](packages/bindings-interface) — TypeScript interface for authoring custom bindings.
- [`@serialpilot/binding-mock`](packages/binding-mock) — mock binding for testing.

### Rust crate

- [`serialpilot-rust`](crates/bindings-rust) — standalone, cross-platform pure-Rust serial port library. Built with `cargo`; not part of the npm workspace.

### Interfaces

Interfaces wrap a binding and expose a different API on top of it. Currently we ship a Node.js Stream interface.

- [`@serialpilot/stream`](packages/stream) — traditional Node.js Stream interface.

### High-level helpers

- [`@serialpilot/reconnect`](packages/reconnect) — auto-reconnect wrapper for resilient connections.
- [`@serialpilot/command-queue`](packages/command-queue) — request-response queue for AT commands, Modbus RTU, and similar protocols.

### Parsers

Parsers turn raw binary data into usable messages — converting bytes to text, emitting fully-formed chunks, validating protocols. Most parsers are Transform streams; Duplex streams and other interfaces are also supported.

- [`@serialpilot/parser-byte-length`](packages/parser-byte-length)
- [`@serialpilot/parser-cctalk`](packages/parser-cctalk)
- [`@serialpilot/parser-delimiter`](packages/parser-delimiter)
- [`@serialpilot/parser-inter-byte-timeout`](packages/parser-inter-byte-timeout)
- [`@serialpilot/parser-packet-length`](packages/parser-packet-length)
- [`@serialpilot/parser-readline`](packages/parser-readline)
- [`@serialpilot/parser-ready`](packages/parser-ready)
- [`@serialpilot/parser-regex`](packages/parser-regex)
- [`@serialpilot/parser-slip-encoder`](packages/parser-slip-encoder)
- [`@serialpilot/parser-spacepacket`](packages/parser-spacepacket)
- [`@serialpilot/parser-start-end`](packages/parser-start-end)

### CLI tools

- [`@serialpilot/list`](packages/list) — `serialpilot-list`, enumerate ports.
- [`@serialpilot/terminal`](packages/terminal) — `serialpilot-terminal`, interactive console.
- [`@serialpilot/repl`](packages/repl) — `serialpilot-repl`, scriptable Node REPL.

### Sister repos

- [`serialpilot-protocols`](https://github.com/serialpilot/serialpilot-protocols) — pure-function protocol codecs and matching Transform-stream parsers (CRC kit, COBS, HDLC, Modbus RTU framing). Browser-clean.
- [`serialpilot-drivers`](https://github.com/serialpilot/serialpilot-drivers) — ready-to-use device drivers: GPS/NMEA, GRBL, ESP flasher, AT modem, Modbus RTU, and Plantower PM sensors. Built on `@serialpilot/driver-kit`.

## Developing

1. Clone this repo: `git clone git@github.com:serialpilot/serialpilot.git`
2. Run `npm install` to install dependencies.
3. Run `npm test` to ensure everything is working.
4. Add dev dependencies to the root `package.json`; add package-specific dependencies to the package's own `package.json`.

## License

SerialPilot is [MIT licensed](LICENSE). See `LICENSE` for full copyright and license terms.

## Author

Ritesh Rana — [contact@riteshrana.engineer](mailto:contact@riteshrana.engineer)

If SerialPilot saves you a weekend, consider [buying me a coffee ☕](https://buymeacoffee.com/ritesh.rana).
