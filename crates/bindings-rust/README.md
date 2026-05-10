<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/website/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

<h1 align="center">serialpilot-rust</h1>
<p align="center"><em>Cross-platform serial port library for Rust — blocking I/O for POSIX and Windows.</em></p>

<p align="center">
  <a href="https://crates.io/crates/serialpilot-rust">crates.io</a> ·
  <a href="https://docs.rs/serialpilot-rust">docs.rs</a> ·
  <a href="https://github.com/serialpilot/serialpilot">GitHub</a> ·
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <a href="https://crates.io/crates/serialpilot-rust"><img alt="crates.io" src="https://img.shields.io/crates/v/serialpilot-rust?style=flat-square&color=orange&logo=rust&logoColor=white"></a>
  <a href="https://crates.io/crates/serialpilot-rust"><img alt="downloads" src="https://img.shields.io/crates/d/serialpilot-rust?style=flat-square"></a>
  <a href="https://docs.rs/serialpilot-rust"><img alt="docs.rs" src="https://img.shields.io/docsrs/serialpilot-rust?style=flat-square&logo=docs.rs"></a>
  <a href="https://www.rust-lang.org"><img alt="MSRV" src="https://img.shields.io/badge/MSRV-1.80%2B-CE412B?style=flat-square&logo=rust&logoColor=white"></a>
  <a href="https://github.com/serialpilot/serialpilot/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-yellow?style=flat-square"></a>
</p>

---

`SerialPilot Rust` is a cross-platform serial port library for Rust with a stable,
blocking I/O API for POSIX and Windows systems.

## Status

- Package name: `serialpilot-rust`
- Version: `1.0.0`
- Author: Ritesh Rana <contact@riteshrana.engineer>
- MSRV: Rust `1.80.0`

## Compatibility and Support Policy

- Backward compatibility is the default policy for public API behavior.
- Breaking API changes require a major version bump and migration notes.
- Rust toolchain support follows an MSRV policy documented in `TESTING.md`.
- Platform support tiers are documented in `doc/platforms.md`.

## Usage

```rust
let ports = serialpilot_rust::available_ports().expect("No ports found!");
for p in ports {
    println!("{}", p.port_name);
}
```

```rust
use std::time::Duration;

let port = serialpilot_rust::new("/dev/ttyUSB0", 115_200)
    .timeout(Duration::from_millis(10))
    .open()
    .expect("Failed to open port");
```

## Async Interoperability

This crate intentionally preserves a synchronous core API. For async runtimes,
use ecosystem adapters such as `tokio-serial` or `mio-serial` around the same
serial device workflows.

## Quality Gates

CI enforces formatting, clippy warnings-as-errors, test execution, and supply
chain checks (`cargo deny`). Hardware tests are kept as explicit/manual runs.

## License

Licensed under the MIT License.
