const { SerialPilot, SerialPilotError, PortNotFoundError, PermissionDeniedError } = require('../')

async function main() {
  try {
    const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
    port.on('open', () => {
      console.log('Port opened')
      port.write('hello\n')
    })
    port.on('data', (data) => {
      console.log('Received:', data.toString())
    })
    port.on('disconnect', (info) => {
      console.log('Device disconnected:', info.path)
    })
  } catch (err) {
    if (err instanceof PortNotFoundError) {
      console.error('Port not found:', err.message)
      console.error('Advice:', err.advice)
    } else if (err instanceof PermissionDeniedError) {
      console.error('Permission denied:', err.message)
      console.error('Advice:', err.advice)
    } else if (err instanceof SerialPilotError) {
      console.error('Serial error:', err.code, err.message)
      console.error('Advice:', err.advice)
    } else {
      console.error('Unexpected error:', err)
    }
  }
}

main()