# Testing and Toolchain Policy

## MSRV Policy

- Current MSRV: Rust `1.80.0`
- MSRV changes are intentional and documented in changelog/release notes.
- CI runs on stable Rust for day-to-day validation.

## Required CI Gates

- `cargo fmt --all -- --check`
- `cargo clippy --workspace --all-targets -- -D warnings`
- `cargo check --workspace`
- `cargo test --workspace --all-targets`
- `cargo deny check advisories licenses bans sources`

## Hardware Test Policy

- Hardware-dependent tests remain feature-gated (`hardware-tests`).
- Non-hardware tests are mandatory in CI.
- Hardware tests are executed manually/on dedicated runners.

## Performance Baseline

- Benchmarks live in `benches/` and are run with Criterion.
- Regressions are tracked over time for enumeration and builder hot paths.
