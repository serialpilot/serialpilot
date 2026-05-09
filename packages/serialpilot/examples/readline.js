// Use a Readline parser

const { SerialPilot, ReadlineParser, SerialPilotError } = require('serialpilot')

// Use a `\r\n` as a line terminator
const parser = new ReadlineParser({
  delimiter: '\r\n',
})

const port = new SerialPilot({
  path: '/dev/tty-usbserial1',
  baudRate: 57600,
})

port.pipe(parser)

port.on('open', () => console.log('Port open'))

port.on('error', (err) => {
  if (err instanceof SerialPilotError && err.advice) {
    console.error(`${err.code}: ${err.message}`)
    console.error(`Advice: ${err.advice}`)
  } else {
    console.error('Error:', err.message)
  }
})

parser.on('data', console.log)

port.write('ROBOT PLEASE RESPOND\n')

// The parser will emit any string response
