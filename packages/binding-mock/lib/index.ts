import debugFactory from 'debug'
import { BindingInterface, BindingPortInterface, OpenOptions, PortInfo, SetOptions, UpdateOptions, PortStatus, CancelledError } from '@serialpilot/bindings-interface'

const debug = debugFactory('serialpilot/binding-mock')

let ports: Record<string, MockPortInternal> = {}
let serialNumber = 0

function resolveNextTick(): Promise<void> {
  return new Promise(resolve => process.nextTick(() => resolve()))
}

export { CancelledError } from '@serialpilot/bindings-interface'

export interface CreatePortOptions {
  echo?: boolean
  record?: boolean
  readyData?: Buffer
  maxReadSize?: number
  manufacturer?: string
  vendorId?: string
  productId?: string
  echoDelay?: number
  disconnectAfter?: { bytesWritten: number }
  respondTo?: { [pattern: string]: Buffer | ((data: Buffer) => Buffer) }
  periodicData?: { data: Buffer, intervalMs: number }
}

export interface MockPortInternal {
  data: Buffer
  echo: boolean
  record: boolean
  info: PortInfo
  maxReadSize: number
  readyData?: Buffer
  openOpt?: Required<OpenOptions>
  echoDelay?: number
  disconnectAfter?: { bytesWritten: number }
  respondTo?: { [pattern: string]: Buffer | ((data: Buffer) => Buffer) }
  bytesWrittenTotal: number
  periodicDataTimer?: ReturnType<typeof setInterval>
}

export interface MockBindingInterface extends BindingInterface<MockPortBinding> {
  reset(): void
  createPort(path: string, opt?: CreatePortOptions): void
}

export const MockBinding: MockBindingInterface = {
  reset() {
    ports = {}
    serialNumber = 0
  },

  createPort(path: string, options: CreatePortOptions = {}) {
    serialNumber++
    const optWithDefaults = {
      echo: false,
      record: false,
      manufacturer: 'The J5 Robotics Company',
      vendorId: undefined as string | undefined,
      productId: undefined as string | undefined,
      maxReadSize: 1024,
      ...options,
    }
    ports[path] = {
      data: Buffer.alloc(0),
      echo: optWithDefaults.echo,
      record: optWithDefaults.record,
      readyData: optWithDefaults.readyData,
      maxReadSize: optWithDefaults.maxReadSize,
      echoDelay: options.echoDelay,
      disconnectAfter: options.disconnectAfter,
      respondTo: options.respondTo,
      bytesWrittenTotal: 0,
      info: {
        path,
        manufacturer: optWithDefaults.manufacturer,
        serialNumber: `${serialNumber}`,
        pnpId: undefined,
        locationId: undefined,
        vendorId: optWithDefaults.vendorId,
        productId: optWithDefaults.productId,
      },
    }
    debug(serialNumber, 'created port', JSON.stringify({ path, opt: options }))
    if (options.periodicData) {
      ports[path].periodicDataTimer = setInterval(() => {
        // The port binding will handle this when open
      }, options.periodicData.intervalMs)
    }
  },

  async list() {
    debug(null, 'list')
    return Object.values(ports).map(port => port.info)
  },

  async open(options: OpenOptions) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new TypeError('"options" is not an object')
    }
    if (!options.path) {
      throw new TypeError('"path" is not a valid port')
    }
    if (!options.baudRate) {
      throw new TypeError('"baudRate" is not a valid baudRate')
    }

    const openOptions: Required<OpenOptions> = {
      dataBits: 8,
      lock: true,
      stopBits: 1,
      parity: 'none',
      rtscts: false,
      xon: false,
      xoff: false,
      xany: false,
      hupcl: true,
      ...options,
    }

    const { path } = openOptions
    debug(null, `open: opening path ${path}`)

    const port = ports[path]
    await resolveNextTick()

    if (!port) {
      throw new Error(`Port does not exist - please call MockBinding.createPort('${path}') first`)
    }

    const portSerialNumber = port.info.serialNumber
    if (port.openOpt?.lock) {
      debug(portSerialNumber, 'open: Port is locked cannot open')
      throw new Error('Port is locked cannot open')
    }

    debug(portSerialNumber, `open: opened path ${path}`)
    port.openOpt = { ...openOptions }
    return new MockPortBinding(port, openOptions)
  },
}

export class MockPortBinding implements BindingPortInterface {
  readonly openOptions: Required<OpenOptions>
  readonly port: MockPortInternal
  private pendingRead: ((err?: Error) => void) | null = null
  lastWrite: Buffer | null = null
  recording: Buffer = Buffer.alloc(0)
  writeOperation: Promise<void> | null = null
  isOpen: boolean = true
  serialNumber?: string

  constructor(port: MockPortInternal, openOptions: Required<OpenOptions>) {
    this.port = port
    this.openOptions = openOptions
    this.serialNumber = port.info.serialNumber

    if (port.readyData) {
      const data = port.readyData
      process.nextTick(() => {
        if (this.isOpen) {
          debug(this.serialNumber, 'emitting ready data')
          this.emitData(data)
        }
      })
    }
  }

  emitData(data: Buffer | string): void {
    if (!this.isOpen || !this.port) {
      throw new Error('Port must be open to pretend to receive data')
    }
    const bufferData = Buffer.isBuffer(data) ? data : Buffer.from(data)
    debug(this.serialNumber, 'emitting data - pending read:', Boolean(this.pendingRead))
    this.port.data = Buffer.concat([this.port.data, bufferData])
    if (this.pendingRead) {
      process.nextTick(this.pendingRead)
      this.pendingRead = null
    }
  }

  async close(): Promise<void> {
    debug(this.serialNumber, 'close')
    if (!this.isOpen) {
      throw new Error('Port is not open')
    }
    const port = this.port
    if (!port) {
      throw new Error('already closed')
    }
    port.openOpt = undefined
    port.data = Buffer.alloc(0)
    debug(this.serialNumber, 'port is closed')
    this.serialNumber = undefined
    this.isOpen = false
    if (this.pendingRead) {
      this.pendingRead(new CancelledError('port is closed'))
    }
  }

  async read(buffer: Buffer, offset: number, length: number): Promise<{ buffer: Buffer, bytesRead: number }> {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError('"buffer" is not a Buffer')
    }
    if (typeof offset !== 'number' || isNaN(offset)) {
      throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? 'NaN' : typeof offset}"`)
    }
    if (typeof length !== 'number' || isNaN(length)) {
      throw new TypeError(`"length" is not an integer got "${isNaN(length) ? 'NaN' : typeof length}"`)
    }
    if (buffer.length < offset + length) {
      throw new Error('buffer is too small')
    }
    if (!this.isOpen) {
      throw new Error('Port is not open')
    }

    debug(this.serialNumber, 'read', length, 'bytes')
    await resolveNextTick()

    if (!this.isOpen || !this.port) {
      throw new CancelledError('Read canceled')
    }

    if (this.port.data.length <= 0) {
      return new Promise<{ buffer: Buffer, bytesRead: number }>((resolve, reject) => {
        this.pendingRead = err => {
          if (err) {
            return reject(err)
          }
          this.read(buffer, offset, length).then(resolve, reject)
        }
      })
    }

    const lengthToRead = this.port.maxReadSize > length ? length : this.port.maxReadSize
    const data = this.port.data.slice(0, lengthToRead)
    const bytesRead = data.copy(buffer, offset)
    this.port.data = this.port.data.slice(lengthToRead)
    debug(this.serialNumber, 'read', bytesRead, 'bytes')
    return { bytesRead, buffer }
  }

  async write(buffer: Buffer): Promise<void> {
    if (!Buffer.isBuffer(buffer)) {
      throw new TypeError('"buffer" is not a Buffer')
    }
    if (!this.isOpen || !this.port) {
      debug('write', 'error port is not open')
      throw new Error('Port is not open')
    }

    debug(this.serialNumber, 'write', buffer.length, 'bytes')

    if (this.writeOperation) {
      throw new Error('Overlapping writes are not supported and should be queued by the serialpilot object')
    }

    this.writeOperation = (async () => {
      await resolveNextTick()
      if (!this.isOpen || !this.port) {
        throw new Error('Write canceled')
      }
      const data = (this.lastWrite = Buffer.from(buffer))
      if (this.port.record) {
        this.recording = Buffer.concat([this.recording, data])
      }
      if (this.port.echo) {
        const emitData = () => {
          if (this.isOpen) {
            this.emitData(data)
          }
        }
        if (this.port.echoDelay && this.port.echoDelay > 0) {
          setTimeout(emitData, this.port.echoDelay)
        } else {
          process.nextTick(emitData)
        }
      }
      // Handle respondTo simulation
      if (this.port.respondTo) {
        const dataStr = buffer.toString()
        for (const [pattern, responder] of Object.entries(this.port.respondTo)) {
          if (dataStr.includes(pattern) || new RegExp(pattern).test(dataStr)) {
            const responseData = typeof responder === 'function' ? responder(buffer) : responder
            process.nextTick(() => {
              if (this.isOpen) {
                this.emitData(responseData)
              }
            })
            break
          }
        }
      }
      // Track bytes written for disconnectAfter simulation
      this.port.bytesWrittenTotal = (this.port.bytesWrittenTotal ?? 0) + buffer.length
      if (this.port.disconnectAfter && this.port.bytesWrittenTotal >= this.port.disconnectAfter.bytesWritten) {
        process.nextTick(() => {
          if (this.isOpen) {
            this.close()
          }
        })
      }
      this.writeOperation = null
      debug(this.serialNumber, 'writing finished')
    })()
    return this.writeOperation
  }

  async update(options: UpdateOptions): Promise<void> {
    if (typeof options !== 'object') {
      throw TypeError('"options" is not an object')
    }
    if (typeof options.baudRate !== 'number') {
      throw new TypeError('"options.baudRate" is not a number')
    }
    debug(this.serialNumber, 'update')
    if (!this.isOpen || !this.port) {
      throw new Error('Port is not open')
    }
    await resolveNextTick()
    if (this.port.openOpt) {
      this.port.openOpt.baudRate = options.baudRate
    }
  }

  async set(options: SetOptions): Promise<void> {
    if (typeof options !== 'object') {
      throw new TypeError('"options" is not an object')
    }
    debug(this.serialNumber, 'set')
    if (!this.isOpen) {
      throw new Error('Port is not open')
    }
    await resolveNextTick()
  }

  async get(): Promise<PortStatus> {
    debug(this.serialNumber, 'get')
    if (!this.isOpen) {
      throw new Error('Port is not open')
    }
    await resolveNextTick()
    return {
      cts: true,
      dsr: false,
      dcd: false,
    }
  }

  async getBaudRate(): Promise<{ baudRate: number }> {
    debug(this.serialNumber, 'getBaudRate')
    if (!this.isOpen || !this.port) {
      throw new Error('Port is not open')
    }
    await resolveNextTick()
    if (!this.port.openOpt?.baudRate) {
      throw new Error('Internal Error')
    }
    return {
      baudRate: this.port.openOpt.baudRate,
    }
  }

  async flush(): Promise<void> {
    debug(this.serialNumber, 'flush')
    if (!this.isOpen || !this.port) {
      throw new Error('Port is not open')
    }
    await resolveNextTick()
    this.port.data = Buffer.alloc(0)
  }

  async drain(): Promise<void> {
    debug(this.serialNumber, 'drain')
    if (!this.isOpen) {
      throw new Error('Port is not open')
    }
    await this.writeOperation
    await resolveNextTick()
  }
}
