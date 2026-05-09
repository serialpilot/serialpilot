# Arduino Auto-Detect and Communication

## Find your Arduino

Use `SerialPilot.findPorts()` to locate Arduino boards by manufacturer:

```js
const { SerialPilot } = require('serialpilot')

const ports = await SerialPilot.findPorts({ manufacturer: /arduino/i })
const port = new SerialPilot({ path: ports[0].path, baudRate: 115200 })
```

## Common Baud Rates

- Arduino Uno/Nano/Mega: 9600 or 115200
- ESP8266/ESP32: 115200

## Handshake Pattern

Many Arduinos reset on serial connect. Wait for a ready signal:

```js
const { SerialPilot, ReadyParser } = require('serialpilot')

const port = new SerialPilot({ path: '/dev/ttyACM0', baudRate: 115200 })
const parser = port.pipe(new ReadyParser({ delimiter: 'READY' }))

parser.on('ready', () => {
  console.log('Arduino ready!')
  port.write('PING\n')
})
```