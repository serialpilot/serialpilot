import { ErrorCallback, OpenOptions, SerialPilotStream } from '@serialpilot/stream'
import { MockBinding, MockBindingInterface } from '@serialpilot/binding-mock'

export type SerialPilotMockOpenOptions = Omit<OpenOptions<MockBindingInterface>, 'binding'>

export class SerialPilotMock extends SerialPilotStream<MockBindingInterface> {
  static list = MockBinding.list
  static readonly binding = MockBinding

  constructor(options: SerialPilotMockOpenOptions, openCallback?: ErrorCallback) {
    const opts: OpenOptions<MockBindingInterface> = {
      binding: MockBinding,
      ...options,
    }
    super(opts, openCallback)
  }
}
