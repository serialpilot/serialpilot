---
title: "Core API"
description: "The SerialPilot class is a Node.js Duplex stream — read it, write to it, pipe it. Everything below is exposed from the top-level serialpilot package; subpackages mirror the same names if you prefer to install à la carte."
order: 1
group: reference
---

<h2 id="import">Import</h2>
<pre data-lang="javascript"><code><span class="c-c">// CommonJS</span>
<span class="c-k">const</span> { SerialPilot, ReadlineParser } = <span class="c-t">require</span>(<span class="c-s">'serialpilot'</span>)

<span class="c-c">// ESM / TypeScript</span>
<span class="c-k">import</span> { SerialPilot, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span></code></pre>

<h2 id="ctor"><code>new SerialPilot(options, callback?)</code></h2>
<p>Open a port. Returns a Duplex stream that emits <code>open</code> when the underlying device is ready.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({
path: <span class="c-s">'/dev/ttyUSB0'</span>,
baudRate: <span class="c-n">115200</span>,
dataBits: <span class="c-n">8</span>,
parity: <span class="c-s">'none'</span>,
stopBits: <span class="c-n">1</span>,
})</code></pre>

<h3 id="options">Constructor options</h3>
<table>
<thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>path</code></td><td><code>string</code></td><td>—</td><td>Required. Device path (e.g. <code>/dev/ttyUSB0</code>, <code>COM3</code>).</td></tr>
<tr><td><code>baudRate</code></td><td><code>number</code></td><td>—</td><td>Required. <code>9600</code>, <code>115200</code>, etc.</td></tr>
<tr><td><code>dataBits</code></td><td><code>5 | 6 | 7 | 8</code></td><td><code>8</code></td><td></td></tr>
<tr><td><code>parity</code></td><td><code>'none' | 'even' | 'odd' | 'mark' | 'space'</code></td><td><code>'none'</code></td><td>Modbus RTU usually wants <code>'even'</code>.</td></tr>
<tr><td><code>stopBits</code></td><td><code>1 | 1.5 | 2</code></td><td><code>1</code></td><td></td></tr>
<tr><td><code>autoOpen</code></td><td><code>boolean</code></td><td><code>true</code></td><td>If <code>false</code>, call <code>port.open()</code> manually.</td></tr>
<tr><td><code>highWaterMark</code></td><td><code>number</code></td><td><code>65536</code></td><td>Stream buffer size in bytes.</td></tr>
<tr><td><code>endOnClose</code></td><td><code>boolean</code></td><td><code>false</code></td><td>End the stream when the port closes.</td></tr>
<tr><td><code>rtscts</code> / <code>xon</code> / <code>xoff</code> / <code>xany</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Hardware / software flow control.</td></tr>
<tr><td><code>hupcl</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Hang up on close (Unix).</td></tr>
<tr><td><code>binding</code></td><td>BindingInterface</td><td>auto-detect</td><td>Override for tests; see <a href="/serialpilot/docs/mocking">Mocking</a>.</td></tr>
</tbody>
</table>
<p>The optional second argument is a callback fired after the port opens (or fails to). If you prefer promises, listen for the <code>open</code> event instead.</p>

<h2 id="static">Static methods</h2>

<h3 id="static-list"><code>SerialPilot.list()</code></h3>
<p>Resolves to an array of every serial port the OS knows about. Each entry has <code>path</code>, <code>manufacturer</code>, <code>serialNumber</code>, <code>vendorId</code>, <code>productId</code>, <code>pnpId</code>, and <code>locationId</code> (any of which may be <code>undefined</code>).</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> ports = <span class="c-k">await</span> SerialPilot.<span class="c-t">list</span>()</code></pre>

<h3 id="static-find"><code>SerialPilot.findPorts(filter)</code></h3>
<p>Like <code>list()</code> but filters the result. The filter accepts strings (case-insensitive equality) or regular expressions:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> arduinos = <span class="c-k">await</span> SerialPilot.<span class="c-t">findPorts</span>({
manufacturer: /arduino/i,
})

<span class="c-k">const</span> byVid = <span class="c-k">await</span> SerialPilot.<span class="c-t">findPorts</span>({
vendorId: <span class="c-s">'2341'</span>,
productId: <span class="c-s">'0043'</span>,
})</code></pre>
<p>Filter keys: <code>vendorId</code>, <code>productId</code>, <code>serialNumber</code>, <code>manufacturer</code>, <code>path</code>.</p>

<h3 id="static-open-by-device"><code>SerialPilot.openByDevice(options)</code></h3>
<p>Discovery and open in a single call. Useful when the path may shift (different USB host, different OS) but the device fingerprint stays put.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> port = <span class="c-k">await</span> SerialPilot.<span class="c-t">openByDevice</span>({
vendorId: <span class="c-s">'2341'</span>,
baudRate: <span class="c-n">115200</span>,
required: <span class="c-k">true</span>, <span class="c-c">// throws PortNotFoundError if no match (default)</span>
})</code></pre>
<p>Pass <code>required: false</code> to receive <code>undefined</code> instead of throwing when no port matches.</p>

<h3 id="static-parsers"><code>SerialPilot.parsers</code></h3>
<p>A static record of every parser, in case you'd rather not import them by name:</p>
<pre data-lang="javascript"><code>SerialPilot.parsers.Readline
SerialPilot.parsers.Delimiter
SerialPilot.parsers.ByteLength
SerialPilot.parsers.Regex
SerialPilot.parsers.PacketLength
SerialPilot.parsers.InterByteTimeout
SerialPilot.parsers.Ready
SerialPilot.parsers.SlipEncoder
SerialPilot.parsers.SlipDecoder
SerialPilot.parsers.CCTalk
SerialPilot.parsers.SpacePacket
SerialPilot.parsers.StartEnd</code></pre>

<h2 id="instance">Instance methods</h2>
<table>
<thead><tr><th>Method</th><th>Returns</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>port.write(data, encoding?, cb?)</code></td><td><code>boolean</code></td><td>Standard Writable. Returns <code>false</code> when the buffer is full — wait for <code>drain</code>.</td></tr>
<tr><td><code>port.read(size?)</code></td><td><code>Buffer | null</code></td><td>Standard Readable.</td></tr>
<tr><td><code>port.pipe(stream)</code></td><td>destination</td><td>Pipe into a parser or any Writable.</td></tr>
<tr><td><code>port.open(cb?)</code></td><td><code>void</code></td><td>Only needed when constructed with <code>autoOpen: false</code>.</td></tr>
<tr><td><code>port.close(cb?)</code></td><td><code>void</code></td><td>Closes and emits <code>close</code>.</td></tr>
<tr><td><code>port.update(options, cb?)</code></td><td><code>void</code></td><td>Change baud rate without closing.</td></tr>
<tr><td><code>port.set(options, cb?)</code></td><td><code>void</code></td><td>Toggle DTR / RTS / BRK / DSR / CTS lines.</td></tr>
<tr><td><code>port.get(cb)</code></td><td><code>void</code></td><td>Read CTS / DSR / DCD line state.</td></tr>
<tr><td><code>port.flush(cb?)</code></td><td><code>void</code></td><td>Discard buffered data on both directions.</td></tr>
<tr><td><code>port.drain(cb?)</code></td><td><code>void</code></td><td>Wait for the OS write buffer to empty.</td></tr>
<tr><td><code>port.isOpen</code></td><td><code>boolean</code></td><td>Property, not a method.</td></tr>
</tbody>
</table>

<h2 id="events">Events</h2>
<table>
<thead><tr><th>Event</th><th>Payload</th><th>When</th></tr></thead>
<tbody>
<tr><td><code>open</code></td><td>—</td><td>Fired once, when the port is ready for I/O.</td></tr>
<tr><td><code>data</code></td><td><code>Buffer</code></td><td>Bytes from the device. Inherited from Readable.</td></tr>
<tr><td><code>drain</code></td><td>—</td><td>The internal write buffer has emptied.</td></tr>
<tr><td><code>close</code></td><td><code>err?</code></td><td>Port has closed; an Error indicates a disconnect.</td></tr>
<tr><td><code>error</code></td><td><code>Error</code></td><td>Anything went wrong. See <a href="/serialpilot/docs/errors">Errors</a>.</td></tr>
<tr><td><code>end</code></td><td>—</td><td>The stream's read side ended.</td></tr>
</tbody>
</table>

<h2 id="patterns">Common patterns</h2>

<h3 id="open-promise">Open as a promise</h3>
<pre data-lang="javascript"><code><span class="c-k">function</span> <span class="c-t">openPort</span>(opts) {
<span class="c-k">return new</span> <span class="c-t">Promise</span>((resolve, reject) =&gt; {
<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>(opts)
port.<span class="c-t">once</span>(<span class="c-s">'open'</span>, () =&gt; resolve(port))
port.<span class="c-t">once</span>(<span class="c-s">'error'</span>, reject)
})
}</code></pre>

<h3 id="close-promise">Close as a promise</h3>
<pre data-lang="javascript"><code><span class="c-k">await new</span> <span class="c-t">Promise</span>((res, rej) =&gt;
port.<span class="c-t">close</span>(err =&gt; err ? rej(err) : res())
)</code></pre>

<h3 id="backpressure">Honour backpressure</h3>
<pre data-lang="javascript"><code><span class="c-k">if</span> (!port.<span class="c-t">write</span>(buf)) {
<span class="c-k">await new</span> <span class="c-t">Promise</span>(res =&gt; port.<span class="c-t">once</span>(<span class="c-s">'drain'</span>, res))
}</code></pre>

<div class="callout">
<strong>Heads up</strong>
<code>SerialPilot</code> extends <a href="https://nodejs.org/api/stream.html#class-streamduplex" rel="noopener">Node's Duplex</a>, so anything that works on a stream — async iteration, pipeline, finished — works here too.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/getting-started"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Getting started</span></a>
<a href="/serialpilot/docs/parsers"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Parsers</span></a>
</div>
