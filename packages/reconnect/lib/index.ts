import { SerialPilotStream } from '@serialpilot/stream'
import { DeviceFilter, DisconnectInfo, PortInfo } from '@serialpilot/bindings-interface'
import { EventEmitter } from 'node:events'

function matchField(value: string | undefined, filter: string | RegExp): boolean {
  if (value === undefined) return false
  if (typeof filter === 'string') {
    return value.toLowerCase() === filter.toLowerCase()
  }
  return filter.test(value)
}

function applyFilter(ports: PortInfo[], filter: DeviceFilter): PortInfo[] {
  return ports.filter(port => {
    if (filter.vendorId !== undefined && !matchField(port.vendorId, filter.vendorId)) return false
    if (filter.productId !== undefined && !matchField(port.productId, filter.productId)) return false
    if (filter.serialNumber !== undefined && !matchField(port.serialNumber, filter.serialNumber)) return false
    if (filter.manufacturer !== undefined && !matchField(port.manufacturer, filter.manufacturer)) return false
    if (filter.path !== undefined && !matchField(port.path, filter.path)) return false
    return true
  })
}

export interface ReconnectOptions {
  port: SerialPilotStream
  autoReconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  backoffFactor?: number
  maxReconnectInterval?: number
  deviceFilter?: DeviceFilter
  onDisconnect?: (info: DisconnectInfo) => void
  onReconnect?: (attempt: number) => void
  onReconnectFailed?: () => void
}

export class SerialPilotReconnect extends EventEmitter {
  private _port: SerialPilotStream
  private _autoReconnect: boolean
  private _reconnectInterval: number
  private _maxReconnectAttempts: number
  private _backoffFactor: number
  private _maxReconnectInterval: number
  private _deviceFilter?: DeviceFilter
  private _reconnectAttempt: number = 0
  private _isReconnecting: boolean = false
  private _reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private _started: boolean = false
  private _onDisconnect?: (info: DisconnectInfo) => void
  private _onReconnect?: (attempt: number) => void
  private _onReconnectFailed?: () => void
  private _handleDisconnectBound: (info: DisconnectInfo) => void

  constructor(options: ReconnectOptions) {
    super()
    this._port = options.port
    this._autoReconnect = options.autoReconnect ?? true
    this._reconnectInterval = options.reconnectInterval ?? 1000
    this._maxReconnectAttempts = options.maxReconnectAttempts ?? Infinity
    this._backoffFactor = options.backoffFactor ?? 1
    this._maxReconnectInterval = options.maxReconnectInterval ?? 30000
    this._deviceFilter = options.deviceFilter
    this._onDisconnect = options.onDisconnect
    this._onReconnect = options.onReconnect
    this._onReconnectFailed = options.onReconnectFailed
    this._handleDisconnectBound = this._handleDisconnect.bind(this)
  }

  get isConnected(): boolean {
    return this._port.isOpen
  }

  get isReconnecting(): boolean {
    return this._isReconnecting
  }

  get reconnectAttempt(): number {
    return this._reconnectAttempt
  }

  get port(): SerialPilotStream {
    return this._port
  }

  start(): void {
    if (this._started) return
    this._started = true
    this._port.on('disconnect', this._handleDisconnectBound)
  }

  stop(): void {
    if (!this._started) return
    this._started = false
    this._port.removeListener('disconnect', this._handleDisconnectBound)
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = null
    }
    this._isReconnecting = false
    this._reconnectAttempt = 0
  }

  forceReconnect(): void {
    this._reconnectAttempt = 0
    this._isReconnecting = false
    if (this._reconnectTimer) {
      clearTimeout(this._reconnectTimer)
      this._reconnectTimer = null
    }
    this._attemptReconnect()
  }

  private _handleDisconnect(info: DisconnectInfo): void {
    if (this._onDisconnect) {
      this._onDisconnect(info)
    }
    this.emit('disconnect', info)
    if (this._autoReconnect) {
      this._scheduleReconnect()
    }
  }

  private _scheduleReconnect(): void {
    if (this._reconnectAttempt >= this._maxReconnectAttempts) {
      this._isReconnecting = false
      this.emit('reconnect-failed')
      if (this._onReconnectFailed) {
        this._onReconnectFailed()
      }
      return
    }

    const interval = Math.min(
      this._reconnectInterval * Math.pow(this._backoffFactor, this._reconnectAttempt),
      this._maxReconnectInterval,
    )

    this._reconnectTimer = setTimeout(() => {
      this._reconnectTimer = null
      this._attemptReconnect()
    }, interval)
  }

  private async _attemptReconnect(): Promise<void> {
    this._isReconnecting = true
    this._reconnectAttempt++
    this.emit('reconnecting', this._reconnectAttempt)

    try {
      const binding = this._port.settings.binding
      let portPath: string | undefined
      if (this._deviceFilter) {
        const ports = await binding.list()
        const filtered = applyFilter(ports as PortInfo[], this._deviceFilter)
        if (filtered.length > 0) {
          portPath = filtered[0].path
        }
      } else {
        portPath = this._port.path
        const ports = await binding.list()
        const found = ports.some(p => p.path === portPath)
        if (!found) {
          portPath = undefined
        }
      }

      if (!portPath) {
        throw new Error(`Device not found${this._deviceFilter ? ' matching filter' : ` at path ${this._port.path}`}`)
      }

      await new Promise<void>((resolve, reject) => {
        this._port.open(err => {
          if (err) reject(err)
          else resolve()
        })
      })

      const attemptCount = this._reconnectAttempt
      this._isReconnecting = false
      this._reconnectAttempt = 0
      this.emit('reconnected', attemptCount)
      if (this._onReconnect) {
        this._onReconnect(attemptCount)
      }
    } catch {
      this._scheduleReconnect()
    }
  }

  on(event: 'reconnecting', listener: (attempt: number) => void): this
  on(event: 'reconnected', listener: (attempt: number) => void): this
  on(event: 'reconnect-failed', listener: () => void): this
  on(event: 'disconnect', listener: (info: DisconnectInfo) => void): this
  on(event: string, listener: (...args: any[]) => void): this
  on(event: string, listener: (...args: any[]) => any): this {
    return super.on(event, listener)
  }
}
