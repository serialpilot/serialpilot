const { SerialPilot } = require('../')
const port = process.env.TEST_PORT

if (!port) {
  console.error('Please pass TEST_PORT environment variable')
  process.exit(1)
}

// var Binding = require('@serialpilot/binding-mock');
// Binding.createPort(port);
// SerialPilot.Binding = Binding;
// debugger;

const writeData = Buffer.alloc(50000, 1)

const serialPilot = new SerialPilot(port, {
  // baudRate: 115200
})

serialPilot.once('data', () => {
  console.log('writing', writeData.length, 'bytes of data')
  serialPilot.write(writeData)
})

let recieved = 0
serialPilot.on('data', data => {
  recieved += data.length
  if (recieved >= writeData.length) {
    serialPilot.close(() => {
      console.log('finished reading', recieved, 'bytes')
    })
  }
})
