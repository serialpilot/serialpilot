# Production Reconnect Strategies

Real devices disconnect, reboot, or change USB paths. Use `@serialpilot/reconnect` for production reliability.

## Basic Reconnect

```js
const { SerialPilot } = require('serialpilot')
const { SerialPilotReconnect } = require('@serialpilot/reconnect')

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 9600, autoOpen: false })
const reconnect = new SerialPilotReconnect({ port })

reconnect.on('reconnecting', (attempt) => console.log(`Attempt ${attempt}`))
reconnect.on('reconnected', () => console.log('Connected'))
reconnect.on('reconnect-failed', () => console.log('Giving up'))

reconnect.start()
port.open()
```

## Reconnect by Device

When the USB path may change, use a device filter:

```js
const reconnect = new SerialPilotReconnect({
  port,
  deviceFilter: { vendorId: '2341' },
  backoffFactor: 1.5,
  maxReconnectAttempts: 20,
})
```

## Exponential Backoff

Set `backoffFactor` > 1 for exponential backoff:

```js
const reconnect = new SerialPilotReconnect({
  port,
  reconnectInterval: 500,    // start at 500ms
  backoffFactor: 2,            // double each attempt
  maxReconnectInterval: 30000, // cap at 30s
})
```