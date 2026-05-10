<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">@serialpilot/bindings-cpp</h1>
<p align="center"><em>Native N-API bindings for SerialPilot, with prebuilds for Linux, macOS, and Windows.</em></p>

<p align="center">
  <a href="https://github.com/serialpilot/serialpilot#readme">Docs</a> ·
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-cpp">npm</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-cpp"><img alt="npm" src="https://img.shields.io/npm/v/@serialpilot/bindings-cpp?style=flat-square&color=cb3837&logo=npm&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/@serialpilot/bindings-cpp"><img alt="downloads" src="https://img.shields.io/npm/dm/@serialpilot/bindings-cpp?style=flat-square&color=blue"></a>
  <a href="https://bundlephobia.com/package/@serialpilot/bindings-cpp"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@serialpilot/bindings-cpp?style=flat-square&label=minzip"></a>
  <a href="https://www.typescriptlang.org"><img alt="types" src="https://img.shields.io/npm/types/@serialpilot/bindings-cpp?style=flat-square&color=3178C6&logo=typescript&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

[![codecov](https://codecov.io/gh/serialpilot/bindings-cpp/branch/main/graph/badge.svg?token=rsGeOmdnsV)](https://codecov.io/gh/serialpilot/bindings-cpp)
[![Test / Lint](https://github.com/serialpilot/bindings-cpp/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/serialpilot/bindings-cpp/actions/workflows/test.yml)

Access serial ports with JavaScript on Linux, macOS, and Windows.

## Quick Links

- [npm package](https://www.npmjs.com/package/@serialpilot/bindings-cpp)
- [Repository](https://github.com/serialpilot/bindings-cpp)
- [Issues](https://github.com/serialpilot/bindings-cpp/issues)

## Bindings

This package provides low-level hardware bindings. It can be used directly or through a higher-level interface.

- `@serialpilot/bindings-cpp` for Linux, macOS, and Windows bindings
- `@serialpilot/bindings-interface` for common binding interfaces
- `@serialpilot/binding-mock` for testing and mocking

## Developing

### Developing SerialPilot bindings

1. Clone this repo: `git clone git@github.com:serialpilot/bindings-cpp.git`
1. Run `npm install`
1. Run `npm test`
1. If you have a serial loopback device (TX to RX), run `TEST_PORT=/path/to/port npm test` for a more comprehensive suite. Default baud is 115200 and can be customized with `TEST_BAUD`.

## License

MIT, see [LICENSE](LICENSE).

## Code of Conduct

This project follows the [Nodebots Code of Conduct](http://nodebots.io/conduct.html).
