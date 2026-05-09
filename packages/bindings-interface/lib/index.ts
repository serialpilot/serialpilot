export interface BindingInterface<T extends BindingPortInterface = BindingPortInterface, R extends OpenOptions = OpenOptions, P extends PortInfo = PortInfo> {
  list(): Promise<P[]>
  open(options: R): Promise<T>
}

export interface BindingPortInterface {
  readonly openOptions: Required<OpenOptions>
  isOpen: boolean
  close(): Promise<void>
  read(buffer: Buffer, offset: number, length: number): Promise<{ buffer: Buffer, bytesRead: number }>
  write(buffer: Buffer): Promise<void>
  update(options: UpdateOptions): Promise<void>
  set(options: SetOptions): Promise<void>
  get(): Promise<PortStatus>
  getBaudRate(): Promise<{ baudRate: number }>
  flush(): Promise<void>
  drain(): Promise<void>
}

export interface BindingsErrorInterface extends Error {
  canceled?: boolean
}

export interface OpenOptions {
  path: string
  baudRate: number
  dataBits?: 5 | 6 | 7 | 8
  lock?: boolean
  stopBits?: 1 | 1.5 | 2
  parity?: string
  rtscts?: boolean
  xon?: boolean
  xoff?: boolean
  xany?: boolean
  hupcl?: boolean
}

export type OpenOptionsFromBinding<Binding> = Binding extends BindingInterface<any, infer T> ? T : never

export interface PortInfo {
  path: string
  manufacturer: string | undefined
  serialNumber: string | undefined
  pnpId: string | undefined
  locationId: string | undefined
  productId: string | undefined
  vendorId: string | undefined
}

export type PortInfoFromBinding<Binding> = Binding extends BindingInterface<any, any, infer T> ? T : never

export type PortInterfaceFromBinding<Binding> = Binding extends BindingInterface<infer T> ? T : never

export interface PortStatus {
  cts: boolean
  dsr: boolean
  dcd: boolean
}

export interface SetOptions {
  brk?: boolean
  cts?: boolean
  dsr?: boolean
  dtr?: boolean
  rts?: boolean
}

export interface UpdateOptions {
  baudRate: number
}

export * from './errors.js'
