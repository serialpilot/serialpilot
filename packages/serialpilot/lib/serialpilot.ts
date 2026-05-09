import { ErrorCallback, OpenOptions, SerialPilotStream, StreamOptions } from '@serialpilot/stream'
import { autoDetect, AutoDetectTypes, OpenOptionsFromBinding, PortInfo } from '@serialpilot/bindings-cpp'
import { DeviceFilter, PortNotFoundError } from '@serialpilot/bindings-interface'
import { ByteLengthParser } from '@serialpilot/parser-byte-length'
import { CCTalkParser } from '@serialpilot/parser-cctalk'
import { DelimiterParser } from '@serialpilot/parser-delimiter'
import { InterByteTimeoutParser } from '@serialpilot/parser-inter-byte-timeout'
import { PacketLengthParser } from '@serialpilot/parser-packet-length'
import { ReadlineParser } from '@serialpilot/parser-readline'
import { ReadyParser } from '@serialpilot/parser-ready'
import { RegexParser } from '@serialpilot/parser-regex'
import { SlipDecoder, SlipEncoder } from '@serialpilot/parser-slip-encoder'
import { SpacePacketParser } from '@serialpilot/parser-spacepacket'
import { StartEndParser } from '@serialpilot/parser-start-end'

const DetectedBinding = autoDetect()

export type SerialPilotOpenOptions<T extends AutoDetectTypes> = Omit<StreamOptions<T>, 'binding'> & OpenOptionsFromBinding<T>

export class SerialPilot<T extends AutoDetectTypes = AutoDetectTypes> extends SerialPilotStream<T> {
  static list = DetectedBinding.list
  static readonly binding = DetectedBinding

  static readonly parsers = {
    ByteLength: ByteLengthParser,
    CCTalk: CCTalkParser,
    Delimiter: DelimiterParser,
    InterByteTimeout: InterByteTimeoutParser,
    PacketLength: PacketLengthParser,
    Readline: ReadlineParser,
    Ready: ReadyParser,
    Regex: RegexParser,
    SlipEncoder,
    SlipDecoder,
    SpacePacket: SpacePacketParser,
    StartEnd: StartEndParser,
  }

  constructor(options: SerialPilotOpenOptions<T>, openCallback?: ErrorCallback) {
    const opts: OpenOptions<T> = {
      binding: DetectedBinding as T,
      ...options,
    }
    super(opts, openCallback)
  }

  static async findPorts(filter: DeviceFilter): Promise<PortInfo[]> {
    const ports = await DetectedBinding.list()
    return ports.filter(port => {
      if (filter.vendorId !== undefined) {
        if (!matchField(port.vendorId, filter.vendorId)) return false
      }
      if (filter.productId !== undefined) {
        if (!matchField(port.productId, filter.productId)) return false
      }
      if (filter.serialNumber !== undefined) {
        if (!matchField(port.serialNumber, filter.serialNumber)) return false
      }
      if (filter.manufacturer !== undefined) {
        if (!matchField(port.manufacturer, filter.manufacturer)) return false
      }
      if (filter.path !== undefined) {
        if (!matchField(port.path, filter.path)) return false
      }
      return true
    })
  }

  static async openByDevice<TAutoDetect extends AutoDetectTypes = AutoDetectTypes>(
    options: Omit<SerialPilotOpenOptions<TAutoDetect>, 'path'> & DeviceFilter & { required?: boolean },
  ): Promise<SerialPilot<TAutoDetect> | undefined> {
    const { required = true, ...filter } = options
    const ports = await SerialPilot.findPorts(filter)
    if (ports.length === 0) {
      if (required) {
        throw new PortNotFoundError(undefined, options.baudRate)
      }
      return undefined
    }
    const portOptions = { ...options, path: ports[0].path } as SerialPilotOpenOptions<TAutoDetect>
    return new SerialPilot(portOptions)
  }
}

function matchField(value: string | undefined, filter: string | RegExp): boolean {
  if (value === undefined) return false
  if (typeof filter === 'string') {
    return value.toLowerCase() === filter.toLowerCase()
  }
  return filter.test(value)
}
