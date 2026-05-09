---
title: "Testing & mocking"
description: "Hardware lies. Hardware is also slow, expensive, and not in CI. @serialpilot/binding-mock gives you a virtual port that behaves like the real one, so the same code paths — parsers, error handlers, reconnect logic — run in unit tests too."
order: 3
group: reference
---

<h2 id="why">Why mock instead of stub</h2>
<p>Stubbing the <code>SerialPilot</code> class itself is brittle: every change to its API ripples into every test. The mock binding sits one layer lower, where the surface is small and stable. Your code keeps using <code>SerialPilot</code> normally; only the byte-pump underneath swaps.</p>

<h2 id="serialpilotmock">Use <code>SerialPilotMock</code></h2>
<p>The simplest path is the pre-wired class:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilotMock, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>
<span class="c-k">import</span> { MockBinding } <span class="c-k">from</span> <span class="c-s">'@serialpilot/binding-mock'</span>

MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/ROBOT'</span>, { echo: <span class="c-k">true</span> })

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilotMock</span>({ path: <span class="c-s">'/dev/ROBOT'</span>, baudRate: <span class="c-n">9600</span> })
<span class="c-k">const</span> lines = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadlineParser</span>({ delimiter: <span class="c-s">'\n'</span> }))
lines.<span class="c-t">on</span>(<span class="c-s">'data'</span>, line =&gt; expect(line).toBe(<span class="c-s">'hello'</span>))

port.<span class="c-t">write</span>(<span class="c-s">'hello\n'</span>) <span class="c-c">// echo: lines emits 'hello'</span></code></pre>
<p><code>SerialPilotMock</code> is a <code>SerialPilot</code> with the mock binding bolted on at construction time — every other method works identically.</p>

<h2 id="createport"><code>MockBinding.createPort(path, options)</code></h2>
<p>Create a virtual port. Options:</p>
<table>
<thead><tr><th>Option</th><th>Type</th><th>Effect</th></tr></thead>
<tbody>
<tr><td><code>echo</code></td><td><code>boolean</code></td><td>Send writes back as reads (round-trip testing).</td></tr>
<tr><td><code>record</code></td><td><code>boolean</code></td><td>Keep every byte written so you can inspect with <code>port.binding.recording</code>.</td></tr>
<tr><td><code>readyData</code></td><td><code>Buffer</code></td><td>Push initial bytes after open — fakes a boot banner.</td></tr>
<tr><td><code>maxReadSize</code></td><td><code>number</code></td><td>Cap each read chunk (default 1024). Useful for backpressure tests.</td></tr>
<tr><td><code>manufacturer</code> / <code>vendorId</code> / <code>productId</code></td><td><code>string</code></td><td>What <code>list()</code> reports for this port.</td></tr>
<tr><td><code>echoDelay</code></td><td><code>number</code></td><td>Milliseconds before the echo arrives. Simulates baud-rate latency.</td></tr>
<tr><td><code>disconnectAfter</code></td><td><code>{ bytesWritten: number }</code></td><td>Trigger a disconnect after a write threshold — exercise reconnect code.</td></tr>
<tr><td><code>respondTo</code></td><td><code>{ [pattern]: Buffer | (data) =&gt; Buffer }</code></td><td>Programmable replies — match input, return output. Stub a whole protocol.</td></tr>
<tr><td><code>periodicData</code></td><td><code>{ data: Buffer, intervalMs: number }</code></td><td>Stream bytes at a fixed cadence. Sensor simulators.</td></tr>
</tbody>
</table>

<h2 id="patterns">Patterns</h2>

<h3 id="pattern-respond">Stub a request/response protocol</h3>
<pre data-lang="javascript"><code>MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/MODEM'</span>, {
respondTo: {
<span class="c-s">'AT\r\n'</span>:        Buffer.<span class="c-t">from</span>(<span class="c-s">'OK\r\n'</span>),
<span class="c-s">'AT+CSQ\r\n'</span>:    Buffer.<span class="c-t">from</span>(<span class="c-s">'+CSQ: 21,0\r\nOK\r\n'</span>),
},
})</code></pre>

<h3 id="pattern-disconnect">Force a disconnect mid-stream</h3>
<pre data-lang="javascript"><code>MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/FLAKY'</span>, {
echo: <span class="c-k">true</span>,
disconnectAfter: { bytesWritten: <span class="c-n">256</span> },
})

<span class="c-c">// after 256 bytes, the next read errors with DisconnectedError</span></code></pre>

<h3 id="pattern-banner">Fake a boot banner</h3>
<pre data-lang="javascript"><code>MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/ARDUINO'</span>, {
readyData: Buffer.<span class="c-t">from</span>(<span class="c-s">'READY\r\n'</span>),
})

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilotMock</span>({ path: <span class="c-s">'/dev/ARDUINO'</span>, baudRate: <span class="c-n">9600</span> })
<span class="c-k">const</span> ready = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadyParser</span>({ delimiter: <span class="c-s">'READY'</span> }))
ready.<span class="c-t">on</span>(<span class="c-s">'ready'</span>, () =&gt; <span class="c-c">/* go */</span>)</code></pre>

<h3 id="pattern-list">Make ports show up in <code>list()</code></h3>
<pre data-lang="javascript"><code>MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/ROBOT'</span>, { manufacturer: <span class="c-s">'Acme Robotics'</span> })
<span class="c-k">const</span> ports = <span class="c-k">await</span> MockBinding.<span class="c-t">list</span>() <span class="c-c">// includes /dev/ROBOT</span></code></pre>

<h2 id="reset">Cleaning up between tests</h2>
<p>Call <code>MockBinding.reset()</code> in a <code>beforeEach</code>/<code>afterEach</code> hook — every virtual port is wiped and the serial counter resets:</p>
<pre data-lang="javascript"><code>beforeEach(() =&gt; MockBinding.<span class="c-t">reset</span>())</code></pre>

<h2 id="errors">Test error paths</h2>
<p>Every <code>SerialPilotError</code> subclass works identically against the mock. Test that your code handles a port-busy or write-failed without unplugging anything:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { CancelledError } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilotMock</span>({ path: <span class="c-s">'/dev/ROBOT'</span>, baudRate: <span class="c-n">9600</span> })
<span class="c-k">const</span> pending = port.<span class="c-t">read</span>()
port.<span class="c-t">close</span>(() =&gt; {}) <span class="c-c">// pending operations get CancelledError</span></code></pre>

<div class="callout">
<strong>CI reminder</strong>
Tests that hit <code>/dev/tty*</code> or <code>COM*</code> will fail in CI. Anything that imports <code>serialpilot</code> works in CI as long as you use the mock binding for that test's port instance.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/parsers"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Parsers</span></a>
<a href="/serialpilot/docs/cli"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">CLI tools</span></a>
</div>
