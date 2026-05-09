import sinon from 'sinon'
import { SerialPilotMock } from 'serialpilot'
import { SerialPilotReconnect } from './'
import { assert } from '../../../test/assert'

describe('SerialPilotReconnect', () => {
  beforeEach(() => {
    SerialPilotMock.binding.createPort('/dev/recon', { echo: false })
  })

  afterEach(() => {
    SerialPilotMock.binding.reset()
  })

  function openPort(): Promise<SerialPilotMock> {
    return new Promise((resolve, reject) => {
      const port = new SerialPilotMock({ path: '/dev/recon', baudRate: 9600 }, err => {
        if (err) reject(err)
        else resolve(port)
      })
    })
  }

  it('start() and stop() do not throw', async () => {
    const port = await openPort()
    const r = new SerialPilotReconnect({ port })
    r.start()
    r.start() // idempotent
    r.stop()
    r.stop() // idempotent
    port.close()
  })

  it('emits disconnect when port is destroyed', done => {
    let port: SerialPilotMock
    openPort().then(p => {
      port = p
      const r = new SerialPilotReconnect({ port, autoReconnect: false })
      r.start()
      r.on('disconnect', info => {
        assert.equal(info.path, '/dev/recon')
        r.stop()
        done()
      })
      // Fake a disconnect event
      port.emit('disconnect', { path: '/dev/recon', error: new Error('unplugged') })
    }).catch(done)
  })

  it('does not reconnect when autoReconnect is false', done => {
    openPort().then(port => {
      const r = new SerialPilotReconnect({ port, autoReconnect: false, reconnectInterval: 10 })
      r.start()
      const reconnectingSpy = sinon.spy()
      r.on('reconnecting', reconnectingSpy)
      port.emit('disconnect', { path: '/dev/recon' })
      setTimeout(() => {
        assert.isTrue(reconnectingSpy.notCalled)
        r.stop()
        port.close()
        done()
      }, 50)
    }).catch(done)
  })

  it('attempts reconnect and emits reconnecting event', done => {
    openPort().then(port => {
      const r = new SerialPilotReconnect({
        port,
        autoReconnect: true,
        reconnectInterval: 10,
        maxReconnectAttempts: 1,
      })
      r.start()
      let finished = false
      const finish = (err?: Error) => {
        if (finished) return
        finished = true
        r.stop()
        if (port.isOpen) port.close(() => done(err))
        else done(err)
      }
      r.on('reconnecting', attempt => {
        try { assert.equal(attempt, 1) } catch (e) { return finish(e as Error) }
      })
      r.on('reconnect-failed', () => finish())
      r.on('reconnected', () => finish())
      port.close(() => {
        port.emit('disconnect', { path: '/dev/recon' })
      })
    }).catch(done)
  })

  it('reconnected event passes the actual attempt count', done => {
    openPort().then(port => {
      const r = new SerialPilotReconnect({
        port,
        autoReconnect: true,
        reconnectInterval: 5,
        maxReconnectAttempts: 5,
      })
      r.start()
      let finished = false
      r.on('reconnected', attempt => {
        if (finished) return
        finished = true
        try {
          assert.equal(attempt, 1, 'first reconnect should report attempt=1, not 0')
        } catch (e) {
          r.stop()
          if (port.isOpen) port.close(() => done(e as Error))
          else done(e as Error)
          return
        }
        r.stop()
        if (port.isOpen) port.close(() => done())
        else done()
      })
      port.close(() => {
        port.emit('disconnect', { path: '/dev/recon' })
      })
    }).catch(done)
  })

  it('stop() cancels pending reconnect timer', done => {
    openPort().then(port => {
      const r = new SerialPilotReconnect({
        port,
        autoReconnect: true,
        reconnectInterval: 1000,
        maxReconnectAttempts: 5,
      })
      r.start()
      const reconnectingSpy = sinon.spy()
      r.on('reconnecting', reconnectingSpy)
      port.emit('disconnect', { path: '/dev/recon' })
      r.stop()
      setTimeout(() => {
        assert.isTrue(reconnectingSpy.notCalled, 'stop() should cancel pending reconnect')
        port.close()
        done()
      }, 50)
    }).catch(done)
  })

  it('emits reconnect-failed when maxReconnectAttempts exhausted', function (done) {
    this.timeout(2000)
    SerialPilotMock.binding.reset()
    // Don't create the port — reconnect will fail to find it
    const port = new SerialPilotMock({ path: '/dev/missing', baudRate: 9600, autoOpen: false })
    const r = new SerialPilotReconnect({
      port,
      autoReconnect: true,
      reconnectInterval: 5,
      maxReconnectAttempts: 2,
    })
    r.start()
    let reconnectingCount = 0
    r.on('reconnecting', () => { reconnectingCount++ })
    r.on('reconnect-failed', () => {
      assert.equal(reconnectingCount, 2, 'should attempt exactly maxReconnectAttempts times')
      r.stop()
      done()
    })
    port.emit('disconnect', { path: '/dev/missing' })
  })

  it('reconnectAttempt getter exposes current attempt count', async () => {
    const port = await openPort()
    const r = new SerialPilotReconnect({ port, autoReconnect: false })
    assert.equal(r.reconnectAttempt, 0)
    r.start()
    assert.equal(r.reconnectAttempt, 0)
    r.stop()
    port.close()
  })

  it('isConnected reflects port.isOpen', async () => {
    const port = await openPort()
    const r = new SerialPilotReconnect({ port })
    assert.isTrue(r.isConnected)
    await new Promise<void>(resolve => port.close(() => resolve()))
    assert.isFalse(r.isConnected)
  })
})
