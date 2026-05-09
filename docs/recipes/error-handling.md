# Error Handling

SerialPilot provides structured error classes with actionable advice.

## Error Catalog

| Code | Class | Cause | Advice |
|------|-------|-------|--------|
| PORT_NOT_FOUND | PortNotFoundError | Device unplugged or path wrong | Check connection, use findPorts() |
| PERMISSION_DENIED | PermissionDeniedError | Insufficient OS permissions | Linux: add to dialout group |
| PORT_BUSY | PortBusyError | Another app using the port | Close Arduino IDE, PuTTY, etc. |
| DISCONNECTED | DisconnectedError | Device unplugged during use | Use @serialpilot/reconnect |
| OPEN_FAILED | OpenFailedError | Generic open failure | Check path and permissions |
| WRITE_FAILED | WriteFailedError | Write during disconnect | Check port.isOpen |
| READ_FAILED | ReadFailedError | Read during disconnect | Check port.isOpen |
| CANCELLED | CancelledError | Operation canceled | Normal for mock bindings |
| INVALID_ARGUMENT | InvalidArgumentError | Bad constructor args | Check path and baudRate |
| TIMEOUT | TimeoutError | Operation timed out | Check device response |

## Example

```js
const { SerialPilot, PortNotFoundError, PermissionDeniedError, SerialPilotError } = require('serialpilot')

try {
  const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
} catch (err) {
  if (err instanceof PortNotFoundError) {
    console.error(err.advice)
  } else if (err instanceof SerialPilotError) {
    console.error(`${err.code}: ${err.message}`)
    console.error(`Advice: ${err.advice}`)
  }
}
```

## Error Properties

Every `SerialPilotError` instance has:

- `code` — `SerialPilotErrorCode` enum value
- `message` — Human-readable error description
- `advice` — Actionable suggestion for fixing the error
- `path` — Port path (when available)
- `baudRate` — Baud rate (when available)