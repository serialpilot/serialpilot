---
"serialpilot": patch
"@serialpilot/serialpilot": patch
"@serialpilot/binding-mock": patch
"@serialpilot/bindings-cpp": patch
"@serialpilot/bindings-interface": patch
"@serialpilot/command-queue": patch
"@serialpilot/list": patch
"@serialpilot/parser-byte-length": patch
"@serialpilot/parser-cctalk": patch
"@serialpilot/parser-delimiter": patch
"@serialpilot/parser-inter-byte-timeout": patch
"@serialpilot/parser-packet-length": patch
"@serialpilot/parser-readline": patch
"@serialpilot/parser-ready": patch
"@serialpilot/parser-regex": patch
"@serialpilot/parser-slip-encoder": patch
"@serialpilot/parser-spacepacket": patch
"@serialpilot/parser-start-end": patch
"@serialpilot/reconnect": patch
"@serialpilot/repl": patch
"@serialpilot/stream": patch
"@serialpilot/terminal": patch
---

Polish pass for v1.0.1:

- Add `@serialpilot/serialpilot`, a scoped alias for the unscoped `serialpilot` umbrella so the package shows up under the @serialpilot npm org.
- Add a one-line `description` to every package.json that was missing one — npm pages now show the actual purpose instead of raw `<p align="center">` HTML from the README.
- Fix broken logo paths in every package README (`website/assets/serialpilot-logo.png` → `assets/serialpilot-logo.png`).
