# Modbus RTU with Command Queue

Use `@serialpilot/command-queue` for Modbus RTU communication.

## Basic Setup

```js
const { SerialPilot } = require('serialpilot')
const { SerialCommandQueue } = require('@serialpilot/command-queue')

const port = new SerialPilot({
  path: '/dev/ttyUSB0',
  baudRate: 9600,
  dataBits: 8,
  parity: 'even',
  stopBits: 1,
})
const queue = new SerialCommandQueue({ port, timeout: 500 })
```

## Command Pattern

```js
const response = await queue.command(':010300000001F8\r\n')
console.log('Modbus response:', response)
```

## Production Tips

- Use `parity: 'even'` for Modbus RTU
- Set appropriate timeout (500ms-3000ms based on baud rate)
- Use `retryCount: 3` for noisy industrial environments
- Use `expect` pattern for response validation:

```js
const response = await queue.command('AT+CSQ', { expect: /OK/ })
```