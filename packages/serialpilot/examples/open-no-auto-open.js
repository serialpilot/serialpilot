// When disabling open immediately.
const { SerialPilot, SerialPilotError } = require('serialpilot')
const port = new SerialPilot({ path: '/dev/tty-usbserial1', autoOpen: false })

// If you write before the port is opened the write will be queued
// Since there is no callback any write errors will be emitted on an error event
port.write('main screen turn on')

// Quit on any error
port.on('error', err => {
  if (err instanceof SerialPilotError && err.advice) {
    console.error(`${err.code}: ${err.message}`)
    console.error(`Advice: ${err.advice}`)
  } else {
    console.error(err.message)
  }
  process.exit(1)
})

port.open(err => {
  if (err) {
    return console.log('Error opening port: ', err.message)
  }
})
