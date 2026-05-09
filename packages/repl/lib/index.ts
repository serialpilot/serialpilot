#!/usr/bin/env node

import { promirepl } from 'promirepl'
import repl from 'repl'
import { SerialPilot, SerialPilotMock } from 'serialpilot'

async function findArduino() {
  const path = process.argv[2] || process.env.TEST_PORT
  const baudRate = Number(process.argv[3] || process.env.BAUDRATE) || 9600
  if (path && baudRate) {
    return { path, baudRate }
  }

  const ports = await SerialPilot.list()
  for (const port of ports) {
    if (/arduino/i.test(port.manufacturer || '')) {
      return { path: port.path, baudRate }
    }
  }
  throw new Error(
    'No arduinos found. You must specify a port to load.\n\nFor example:\n\tserialpilot-repl COM3\n\tserialpilot-repl /dev/tty.my-serialpilot',
  )
}

findArduino()
  .then(({ path, baudRate }: { path: string, baudRate: number }) => {
    console.log(`DEBUG=${process.env.DEBUG || ''} # enable debugging with DEBUG=serialpilot*`)
    console.log(`port = SerialPilot({ path: "${path}", baudRate: ${baudRate}, autoOpen: false })`)
    console.log('globals { SerialPilot, SerialPilotMock, path, port }')
    const port = new SerialPilot({ path, baudRate, autoOpen: false })
    const spRepl = repl.start({ prompt: '> ' })
    promirepl(spRepl)
    spRepl.context.SerialPilot = SerialPilot
    spRepl.context.SerialPilotMock = SerialPilotMock
    spRepl.context.path = path
    spRepl.context.port = port
  })
  .catch(e => {
    console.error(e.message)
    process.exit(1)
  })
