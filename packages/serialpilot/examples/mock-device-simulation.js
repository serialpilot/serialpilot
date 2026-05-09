const { SerialPilotMock } = require('../')
const { ReadlineParser } = require('@serialpilot/parser-readline')

const { MockBinding } = SerialPilotMock.binding

MockBinding.createPort('/dev/ttyUSB0', {
  echo: true,
  readyData: Buffer.from('READY\r\n'),
  respondTo: {
    'AT': Buffer.from('OK\r\n'),
    'AT+CSQ': Buffer.from('+CSQ: 25,0\r\nOK\r\n'),
  },
})

const port = new SerialPilotMock({ path: '/dev/ttyUSB0', baudRate: 9600 })
const parser = port.pipe(new ReadlineParser())

parser.on('data', (line) => {
  console.log('Received:', line)
})

port.write('AT\r\n')
port.write('AT+CSQ\r\n')