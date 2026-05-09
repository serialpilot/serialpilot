# Unsafe Boundary Invariants

This document records invariants for unsafe-heavy modules.

## `src/windows/com.rs`

- `HANDLE` values must be valid for the lifetime of `COMPort`.
- `Drop` must close each owned handle exactly once.
- Cloned handles from `DuplicateHandle` must preserve access rights and ownership boundaries.

## `src/windows/dcb.rs`

- `DCB` layout and bitfield manipulation must match Windows ABI expectations.
- Getter/setter paths must only write documented fields before `SetCommState`.

## `src/posix/ioctl.rs`

- File descriptors passed to ioctl wrappers must be valid and open.
- ioctl request constants must match target-platform ABI.

## `src/posix/tty.rs`

- `RawFd` ownership and drop semantics must avoid double-close.
- Termios read/write operations must preserve OS-managed state assumptions.
