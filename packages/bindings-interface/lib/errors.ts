export enum SerialPilotErrorCode {
  PORT_NOT_FOUND = 'PORT_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PORT_BUSY = 'PORT_BUSY',
  DISCONNECTED = 'DISCONNECTED',
  OPEN_FAILED = 'OPEN_FAILED',
  WRITE_FAILED = 'WRITE_FAILED',
  READ_FAILED = 'READ_FAILED',
  CANCELLED = 'CANCELLED',
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  TIMEOUT = 'TIMEOUT',
}

export class SerialPilotError extends Error {
  readonly code: SerialPilotErrorCode
  readonly advice: string
  readonly path?: string
  readonly baudRate?: number

  constructor(message: string, code: SerialPilotErrorCode, advice: string, options?: { path?: string, baudRate?: number }) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.advice = advice
    this.path = options?.path
    this.baudRate = options?.baudRate
    Error.captureStackTrace?.(this, this.constructor)
  }
}

export class PortNotFoundError extends SerialPilotError {
  constructor(path?: string, baudRate?: number) {
    super(
      path ? `Port not found: ${path}` : 'No port found matching the filter criteria',
      SerialPilotErrorCode.PORT_NOT_FOUND,
      'The device may have been unplugged. Use SerialPilot.list() to see available ports, or enable auto-reconnect with @serialpilot/reconnect.',
      { path, baudRate },
    )
  }
}

export class PermissionDeniedError extends SerialPilotError {
  constructor(path?: string, baudRate?: number) {
    super(
      path ? `Permission denied: ${path}` : 'Permission denied opening port',
      SerialPilotErrorCode.PERMISSION_DENIED,
      'On Linux, add your user to the dialout group: sudo usermod -a -G dialout $USER, then log out and back in. On macOS, check System Preferences > Security & Privacy.',
      { path, baudRate },
    )
  }
}

export class PortBusyError extends SerialPilotError {
  constructor(path?: string, baudRate?: number) {
    super(
      path ? `Port is busy: ${path}` : 'Port is busy',
      SerialPilotErrorCode.PORT_BUSY,
      'Another application may be using this port. Close Arduino IDE, PuTTY, VS Code serial monitor, or other serial tools.',
      { path, baudRate },
    )
  }
}

export class DisconnectedError extends SerialPilotError {
  disconnected: true

  constructor(message: string, path?: string, baudRate?: number) {
    super(
      message,
      SerialPilotErrorCode.DISCONNECTED,
      'The serial device was disconnected. Enable auto-reconnect with @serialpilot/reconnect for production use.',
      { path, baudRate },
    )
    this.disconnected = true
  }
}

export class OpenFailedError extends SerialPilotError {
  constructor(path?: string, baudRate?: number) {
    super(
      path ? `Failed to open port: ${path}` : 'Failed to open port',
      SerialPilotErrorCode.OPEN_FAILED,
      'The port could not be opened. Check that the device is connected, the path is correct, and you have the necessary permissions.',
      { path, baudRate },
    )
  }
}

export class WriteFailedError extends SerialPilotError {
  constructor(path?: string) {
    super(
      'Write failed',
      SerialPilotErrorCode.WRITE_FAILED,
      'The write operation failed. The port may have been disconnected during the write.',
      { path },
    )
  }
}

export class ReadFailedError extends SerialPilotError {
  constructor(path?: string) {
    super(
      'Read failed',
      SerialPilotErrorCode.READ_FAILED,
      'The read operation failed. The port may have been disconnected during the read.',
      { path },
    )
  }
}

export class CancelledError extends SerialPilotError {
  canceled: true

  constructor(message: string = 'Operation canceled') {
    super(
      message,
      SerialPilotErrorCode.CANCELLED,
      'The operation was canceled.',
    )
    this.canceled = true
  }
}

export class InvalidArgumentError extends SerialPilotError {
  constructor(message: string, path?: string) {
    super(
      message,
      SerialPilotErrorCode.INVALID_ARGUMENT,
      'Check the arguments passed to the serial port constructor and open method.',
      { path },
    )
  }
}

export class TimeoutError extends SerialPilotError {
  constructor(message: string = 'Operation timed out', path?: string) {
    super(
      message,
      SerialPilotErrorCode.TIMEOUT,
      'The operation timed out. The device may be unresponsive or the connection may be unstable.',
      { path },
    )
  }
}

export interface DeviceFilter {
  vendorId?: string | RegExp
  productId?: string | RegExp
  serialNumber?: string | RegExp
  manufacturer?: string | RegExp
  path?: string | RegExp
}

export interface DisconnectInfo {
  path: string
  error?: Error
}
