const { SerialPilot } = require('../')
const port = process.env.TEST_PORT
// number of bytes to send
const size = 512

if (!port) {
  console.error('Please pass TEST_PORT environment variable')
  process.exit(1)
}

const serialPilot = new SerialPilot(port, err => {
  if (err) {
    throw err
  }
})

serialPilot.on('open', () => {
  console.log('serialPilot opened')
})

const largeMessage = Buffer.alloc(size, '!')
console.log(`Writting data dength: ${largeMessage.length} B`)
serialPilot.write(largeMessage, () => {
  console.log('Write callback returned')
})

console.log('Calling drain')
serialPilot.drain(() => {
  console.log('Drain callback returned')
})
