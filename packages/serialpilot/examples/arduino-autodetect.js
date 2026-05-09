const { SerialPilot } = require('../')

async function main() {
  const ports = await SerialPilot.findPorts({ manufacturer: /arduino/i })
  if (ports.length === 0) {
    console.error('No Arduino found')
    return
  }
  console.log('Found Arduino:', ports[0])
  const port = new SerialPilot({ path: ports[0].path, baudRate: 9600 })
  port.on('open', () => {
    console.log('Connected to Arduino')
    port.write('hello\n')
  })
  port.on('data', (data) => {
    console.log('Received:', data.toString())
  })
}

main()