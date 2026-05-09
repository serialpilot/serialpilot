# Platform Compatibility Matrix

Support tiers:
- **Fully Tested**: validated in CI with non-hardware test suite.
- **Partially Tested**: core support exists; CI and/or hardware coverage is partial.
- **Best Effort**: implementation exists but automated validation is limited.

| Platform | Tier | Notes |
|---|---|---|
| Linux (glibc, libudev) | Fully Tested | Primary POSIX path with rich USB metadata |
| Linux (musl, non-libudev) | Partially Tested | Fallback enumeration path has reduced metadata |
| macOS | Fully Tested | Uses IOSSIOSPEED path for arbitrary baud rates |
| iOS | Partially Tested | Implemented with Apple-specific ioctl behavior |
| Windows (MSVC/GNU) | Fully Tested | COM backend via `windows-sys` |
| Android | Best Effort | Build-oriented support; limited automated runtime validation |
| FreeBSD/NetBSD/OpenBSD | Partially Tested / Best Effort | POSIX implementation exists, lower CI coverage |

## Platform Behavior Notes

- Linux: both `libudev` and non-`libudev` enumeration paths are supported.
- Apple platforms: `IOSSIOSPEED` is used for non-standard baud behavior.
- Windows: COM handle semantics remain synchronous and API-compatible.
