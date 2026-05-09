const { SerialPilot } = require('../')
const { SerialPilotReconnect } = require('@serialpilot/reconnect')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600, autoOpen: false })
const reconnect = new SerialPilotReconnect({
  port,
  reconnectInterval: 1000,
  maxReconnectAttempts: 10,
  backoffFactor: 1.5,
})

reconnect.on('reconnecting', (attempt) => console.log(`Reconnect attempt ${attempt}`))
reconnect.on('reconnected', () => console.log('Reconnected!'))
reconnect.on('reconnect-failed', () => console.log('All reconnect attempts failed'))

port.on('data', (data) => console.log('Data:', data.toString()))

reconnect.start()
port.open()