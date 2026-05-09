import { SerialPilotStream } from '@serialpilot/stream'
import { ReadlineParser } from '@serialpilot/parser-readline'
import { TimeoutError } from '@serialpilot/bindings-interface'
import { EventEmitter } from 'node:events'

export interface CommandQueueOptions {
  port: SerialPilotStream
  timeout?: number
  lineEnding?: string
  delimiter?: string | Buffer
  retryCount?: number
  retryDelay?: number
}

export interface CommandOptions {
  timeout?: number
  expect?: RegExp
}

interface QueueItem {
  command: string
  options: CommandOptions
  resolve: (response: string) => void
  reject: (error: Error) => void
  retries: number
}

export class SerialCommandQueue extends EventEmitter {
  private readonly _port: SerialPilotStream
  private readonly _parser: ReadlineParser
  private readonly _timeout: number
  private readonly _lineEnding: string
  private readonly _retryCount: number
  private readonly _retryDelay: number
  private readonly _queue: QueueItem[] = []
  private _currentItem: QueueItem | null = null
  private _timeoutTimer: ReturnType<typeof setTimeout> | null = null
  private _idle: boolean = true

  constructor(options: CommandQueueOptions) {
    super()
    this._port = options.port
    this._timeout = options.timeout ?? 3000
    this._lineEnding = options.lineEnding ?? '\r\n'
    this._retryCount = options.retryCount ?? 0
    this._retryDelay = options.retryDelay ?? 1000

    this._parser = new ReadlineParser({ delimiter: options.delimiter ?? '\r\n' })
    this._port.pipe(this._parser)
    this._parser.on('data', (line: string) => this._handleResponse(line))
  }

  get pending(): number {
    return this._queue.length + (this._currentItem ? 1 : 0)
  }

  get isIdle(): boolean {
    return this._idle
  }

  async command(command: string, options?: CommandOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        command,
        options: options ?? {},
        resolve,
        reject,
        retries: this._retryCount,
      }
      this._queue.push(item)
      this._processQueue()
    })
  }

  write(data: string | Buffer): void {
    this._port.write(data)
  }

  private _processQueue(): void {
    if (this._currentItem) return

    const item = this._queue.shift()
    if (!item) {
      if (!this._idle) {
        this._idle = true
        this.emit('idle')
      }
      return
    }

    this._idle = false
    this._currentItem = item
    const timeout = item.options.timeout ?? this._timeout

    this._timeoutTimer = setTimeout(() => {
      this._handleTimeout()
    }, timeout)

    this._port.write(item.command + this._lineEnding)
  }

  private _handleResponse(line: string): void {
    if (!this._currentItem) return

    const item = this._currentItem
    const trimmedLine = line.trim()

    if (item.options.expect && !item.options.expect.test(trimmedLine)) {
      return
    }

    this._clearTimer()
    this._currentItem = null
    this.emit('response', item.command, trimmedLine)
    item.resolve(trimmedLine)
    this._processQueue()
  }

  private _handleTimeout(): void {
    if (!this._currentItem) return

    const item = this._currentItem
    this._currentItem = null

    if (item.retries > 0) {
      item.retries--
      setTimeout(() => {
        this._queue.unshift(item)
        this._processQueue()
      }, this._retryDelay)
    } else {
      const error = new TimeoutError(`Command timed out: ${item.command}`)
      // Only emit 'error' if a listener exists; rejection is the primary surface.
      if (this.listenerCount('error') > 0) {
        this.emit('error', error)
      }
      item.reject(error)
      this._processQueue()
    }
  }

  private _clearTimer(): void {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer)
      this._timeoutTimer = null
    }
  }

  on(event: 'response', listener: (command: string, response: string) => void): this
  on(event: 'error', listener: (error: Error) => void): this
  on(event: 'idle', listener: () => void): this
  on(event: string, listener: (...args: any[]) => void): this
  on(event: string, listener: (...args: any[]) => any): this {
    return super.on(event, listener)
  }
}
