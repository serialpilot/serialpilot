const { SerialPilot } = require('../')
const { SerialCommandQueue } = require('@serialpilot/command-queue')

async function main() {
  const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600 })
  const modem = new SerialCommandQueue({ port, timeout: 3000, lineEnding: '\r\n' })

  const signal = await modem.command('AT+CSQ')
  console.log('Signal quality:', signal)

  const imei = await modem.command('AT+GSN')
  console.log('IMEI:', imei)
}

main()