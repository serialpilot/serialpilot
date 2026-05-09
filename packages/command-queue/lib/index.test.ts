import sinon from 'sinon'
import { SerialPilotMock } from 'serialpilot'
import { TimeoutError } from '@serialpilot/bindings-interface'
import { SerialCommandQueue } from './'
import { assert } from '../../../test/assert'

describe('SerialCommandQueue', () => {
  beforeEach(() => {
    SerialPilotMock.binding.createPort('/dev/cmdq', {
      echo: false,
      respondTo: {
        'AT\\b': Buffer.from('OK\r\n'),
        'AT\\+CSQ': Buffer.from('+CSQ: 23,99\r\nOK\r\n'),
        'PING': Buffer.from('PONG\r\n'),
      },
    })
  })

  afterEach(() => {
    SerialPilotMock.binding.reset()
  })

  function openPort(): Promise<SerialPilotMock> {
    return new Promise((resolve, reject) => {
      const port = new SerialPilotMock({ path: '/dev/cmdq', baudRate: 9600 }, err => {
        if (err) reject(err)
        else resolve(port)
      })
    })
  }

  it('resolves with the response line', async () => {
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 1000 })
    const response = await q.command('AT')
    assert.equal(response, 'OK')
    port.close()
  })

  it('processes commands in FIFO order', async () => {
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 1000 })
    const order: string[] = []
    const responses = await Promise.all([
      q.command('PING').then(r => { order.push('a'); return r }),
      q.command('AT').then(r => { order.push('b'); return r }),
      q.command('PING').then(r => { order.push('c'); return r }),
    ])
    assert.deepEqual(order, ['a', 'b', 'c'])
    assert.equal(responses[0], 'PONG')
    assert.equal(responses[1], 'OK')
    assert.equal(responses[2], 'PONG')
    port.close()
  })

  it('rejects with TimeoutError when no response arrives', async () => {
    SerialPilotMock.binding.reset()
    SerialPilotMock.binding.createPort('/dev/cmdq', { echo: false })
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 50 })
    try {
      await q.command('NOREPLY')
      assert.fail('Should have rejected')
    } catch (err) {
      assert.instanceOf(err, TimeoutError)
    }
    port.close()
  })

  it('retries on timeout up to retryCount', async () => {
    SerialPilotMock.binding.reset()
    SerialPilotMock.binding.createPort('/dev/cmdq', { echo: false })
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 30, retryCount: 2, retryDelay: 5 })
    try {
      await q.command('NOREPLY')
      assert.fail('Should have rejected after retries')
    } catch (err) {
      assert.instanceOf(err, TimeoutError)
    }
    port.close()
  })

  it('expect regex filters non-matching lines', async () => {
    SerialPilotMock.binding.reset()
    SerialPilotMock.binding.createPort('/dev/cmdq', {
      echo: false,
      respondTo: {
        STATUS: Buffer.from('echo\r\n+STATUS: ready\r\n'),
      },
    })
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 200 })
    const response = await q.command('STATUS', { expect: /^\+STATUS:/ })
    assert.equal(response, '+STATUS: ready')
    port.close()
  })

  it('emits idle when queue drains', async () => {
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 1000 })
    const idleSpy = sinon.spy()
    q.on('idle', idleSpy)
    await q.command('AT')
    await new Promise(r => setImmediate(r))
    assert.isTrue(idleSpy.calledOnce)
    port.close()
  })

  it('pending getter reflects queue length', async () => {
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 1000 })
    assert.equal(q.pending, 0)
    const p1 = q.command('AT')
    const p2 = q.command('AT')
    assert.equal(q.pending, 2)
    await Promise.all([p1, p2])
    assert.equal(q.pending, 0)
    port.close()
  })

  it('per-command timeout overrides default', async () => {
    SerialPilotMock.binding.reset()
    SerialPilotMock.binding.createPort('/dev/cmdq', { echo: false })
    const port = await openPort()
    const q = new SerialCommandQueue({ port, timeout: 5000 })
    const start = Date.now()
    try {
      await q.command('NOREPLY', { timeout: 30 })
      assert.fail('Should have rejected')
    } catch (err) {
      assert.instanceOf(err, TimeoutError)
      const elapsed = Date.now() - start
      assert.isBelow(elapsed, 1000, 'should respect per-command timeout, not default')
    }
    port.close()
  })
})
