#!/usr/bin/env -S npx tsx

// outputs the path to an Arduino to stdout or an error to stderror

import { autoDetect } from '@serialpilot/bindings-cpp'
autoDetect()
  .list()
  .then(ports => {
    const port = ports.find(port => /arduino/i.test(port.manufacturer))
    if (!port) {
      console.error('Arduino Not found')
      process.exit(1)
    }
    console.log(port.path)
  })
