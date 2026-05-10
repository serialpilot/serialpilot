# Change Log

## 1.0.1

### Patch Changes

- 48dc58d: Polish pass for v1.0.1:

  - Add `@serialpilot/serialpilot`, a scoped alias for the unscoped `serialpilot` umbrella so the package shows up under the @serialpilot npm org.
  - Add a one-line `description` to every package.json that was missing one — npm pages now show the actual purpose instead of raw `<p align="center">` HTML from the README.
  - Fix broken logo paths in every package README (`website/assets/serialpilot-logo.png` → `assets/serialpilot-logo.png`).

- Updated dependencies [48dc58d]
  - @serialpilot/binding-mock@1.0.1
  - @serialpilot/bindings-cpp@1.0.1
  - @serialpilot/bindings-interface@1.0.1
  - @serialpilot/parser-byte-length@1.0.1
  - @serialpilot/parser-cctalk@1.0.1
  - @serialpilot/parser-delimiter@1.0.1
  - @serialpilot/parser-inter-byte-timeout@1.0.1
  - @serialpilot/parser-packet-length@1.0.1
  - @serialpilot/parser-readline@1.0.1
  - @serialpilot/parser-ready@1.0.1
  - @serialpilot/parser-regex@1.0.1
  - @serialpilot/parser-slip-encoder@1.0.1
  - @serialpilot/parser-spacepacket@1.0.1
  - @serialpilot/parser-start-end@1.0.1
  - @serialpilot/stream@1.0.1

All notable changes to this project will be documented in this file.

## 1.0.0 (2026-05-08)

- Initial release of `serialpilot` v1.0.0.
