---
title: "Modbus RTU"
description: "Modbus RTU is a half-duplex, master/slave protocol over RS-485 (or RS-232). The command queue handles the send-then-wait dance for you, including timeouts and retries — exactly what flaky industrial wiring demands."
order: 2
group: recipes
---

<h2 id="setup">Setup</h2>
<p>Open the port with parity <code>even</code> — that's the Modbus RTU default. Then wrap it in a <code>SerialCommandQueue</code>:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>
<span class="c-k">import</span> { SerialCommandQueue } <span class="c-k">from</span> <span class="c-s">'@serialpilot/command-queue'</span>

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({
path: <span class="c-s">'/dev/ttyUSB0'</span>,
baudRate: <span class="c-n">9600</span>,
dataBits: <span class="c-n">8</span>,
parity: <span class="c-s">'even'</span>,
stopBits: <span class="c-n">1</span>,
})

<span class="c-k">const</span> queue = <span class="c-k">new</span> <span class="c-t">SerialCommandQueue</span>({ port, timeout: <span class="c-n">500</span> })</code></pre>

<h2 id="command">Send and wait</h2>
<p>Each call to <code>queue.command()</code> writes the request, waits for a response, and resolves with what came back. Subsequent calls queue up:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> response = <span class="c-k">await</span> queue.<span class="c-t">command</span>(<span class="c-s">':010300000001F8\r\n'</span>)
console.log(<span class="c-s">'Modbus response:'</span>, response)</code></pre>

<h2 id="expect">Validate the response shape</h2>
<p>Pass <code>expect</code> to require a particular pattern. The promise rejects if the response doesn't match — handy for protocols that interleave OK/ERROR replies:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> response = <span class="c-k">await</span> queue.<span class="c-t">command</span>(<span class="c-s">'AT+CSQ'</span>, { expect: /OK/ })</code></pre>

<h2 id="production">Production tips</h2>
<ul>
<li><strong>Timeouts:</strong> 500&nbsp;ms is fine for 9600&nbsp;bps; bump to 2–3&nbsp;s for 1200&nbsp;bps or noisy lines.</li>
<li><strong>Retries:</strong> set <code>retryCount: 3</code> on the queue when running over RS-485 with multiple devices on the bus.</li>
<li><strong>Parity matters:</strong> Modbus RTU is <code>even</code> by spec; some equipment uses <code>none</code> with two stop bits as a workaround.</li>
<li><strong>Inter-byte timing:</strong> if you need raw frames (no <code>\r\n</code> termination), pipe through <a href="/serialpilot/docs/parsers#inter-byte"><code>InterByteTimeoutParser</code></a> instead of relying on a delimiter.</li>
</ul>

<h2 id="options">Queue options</h2>
<table>
<thead><tr><th>Option</th><th>Default</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>timeout</code></td><td><code>3000</code></td><td>Milliseconds per command.</td></tr>
<tr><td><code>lineEnding</code></td><td><code>'\r\n'</code></td><td>Appended to each request.</td></tr>
<tr><td><code>delimiter</code></td><td><code>'\n'</code></td><td>Splits responses.</td></tr>
<tr><td><code>retryCount</code></td><td><code>0</code></td><td>Retries on timeout.</td></tr>
<tr><td><code>retryDelay</code></td><td><code>1000</code></td><td>Milliseconds between retries.</td></tr>
</tbody>
</table>

<h2 id="events">Events</h2>
<ul>
<li><code>response</code> — <code>(command, response)</code> when a request resolves.</li>
<li><code>error</code> — <code>(error)</code> on timeout or transport failure.</li>
<li><code>idle</code> — when the queue empties.</li>
</ul>

<div class="callout">
<strong>Crystal-ball debugging</strong>
<code>DEBUG=serialpilot* node script.js</code> turns on per-binding tracing — invaluable when a Modbus device looks idle but is actually replying with garbage.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/recipes/arduino"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Arduino</span></a>
<a href="/serialpilot/docs/recipes/reconnect"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Reconnect</span></a>
</div>
