# Changelog

## 1.0.1

### Patch Changes

- 48dc58d: Polish pass for v1.0.1:

  - Add `@serialpilot/serialpilot`, a scoped alias for the unscoped `serialpilot` umbrella so the package shows up under the @serialpilot npm org.
  - Add a one-line `description` to every package.json that was missing one — npm pages now show the actual purpose instead of raw `<p align="center">` HTML from the README.
  - Fix broken logo paths in every package README (`website/assets/serialpilot-logo.png` → `assets/serialpilot-logo.png`).

- Updated dependencies [48dc58d]
  - @serialpilot/bindings-interface@1.0.1
  - @serialpilot/stream@1.0.1

## 1.0.0 (2026-05-09)

- Initial @serialpilot/reconnect package
- Auto-reconnect wrapper for SerialPilotStream
- Configurable reconnect interval, backoff, and max attempts
- Device filter support for reconnecting by device attributes
