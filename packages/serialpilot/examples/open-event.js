// Open event example
const { SerialPilot, SerialPilotError } = require('serialpilot')
const port = new SerialPilot({ path: '/dev/tty-usbserial1', baudRate: 9600 })

port.on('open', () => {
  console.log('Port Opened')
})

port.on('error', (err) => {
  if (err instanceof SerialPilotError && err.advice) {
    console.error(`${err.code}: ${err.message}`)
    console.error(`Advice: ${err.advice}`)
  } else {
    console.error('Error:', err.message)
  }
})

port.write('main screen turn on', err => {
  if (err) {
    return console.log('Error: ', err.message)
  }
  console.log('message written')
})

port.on('data', data => {
  /* get a buffer of data from the serial port */
  console.log(data.toString())
})
