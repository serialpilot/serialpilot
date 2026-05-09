const { SerialPilot, ReadlineParser } = require('../')

async function main() {
  const port = await SerialPilot.openByDevice({
    vendorId: '0403',
    productId: '6001',
    baudRate: 9600,
  })
  const parser = port.pipe(new ReadlineParser())
  parser.on('data', (line) => {
    console.log('Barcode scanned:', line)
  })
}

main()