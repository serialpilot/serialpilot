---
title: "Production reconnect"
description: "Real devices come and go. They reboot mid-session, change USB paths between hosts, and survive fewer cable cycles than spec sheets claim. @serialpilot/reconnect wraps your port and brings it back when the world wobbles."
order: 3
group: recipes
---

<h2 id="basic">Basic reconnect</h2>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>
<span class="c-k">import</span> { SerialPilotReconnect } <span class="c-k">from</span> <span class="c-s">'@serialpilot/reconnect'</span>

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({
path: <span class="c-s">'/dev/ttyUSB0'</span>,
baudRate: <span class="c-n">9600</span>,
autoOpen: <span class="c-k">false</span>,
})

<span class="c-k">const</span> reconnect = <span class="c-k">new</span> <span class="c-t">SerialPilotReconnect</span>({ port })

reconnect.<span class="c-t">on</span>(<span class="c-s">'reconnecting'</span>, n =&gt; console.log(<span class="c-s">`attempt ${n}`</span>))
reconnect.<span class="c-t">on</span>(<span class="c-s">'reconnected'</span>,  n =&gt; console.log(<span class="c-s">`back after ${n} tries`</span>))
reconnect.<span class="c-t">on</span>(<span class="c-s">'reconnect-failed'</span>, () =&gt; console.error(<span class="c-s">'gave up'</span>))

reconnect.<span class="c-t">start</span>()
port.<span class="c-t">open</span>()</code></pre>
<p>Set <code>autoOpen: false</code> on the port — the reconnect wrapper takes over open/close orchestration, and you call <code>port.open()</code> once after starting the wrapper.</p>

<h2 id="by-device">Reconnect by device, not by path</h2>
<p>USB paths shift when devices replug into a different port. Pin to the device's fingerprint instead, and the wrapper finds it again wherever it shows up:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> reconnect = <span class="c-k">new</span> <span class="c-t">SerialPilotReconnect</span>({
port,
deviceFilter: { vendorId: <span class="c-s">'2341'</span> },
})</code></pre>

<h2 id="backoff">Exponential backoff</h2>
<p>Hammering a missing device every second wastes CPU and floods the OS log. Tell the wrapper to back off, with a sensible cap:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> reconnect = <span class="c-k">new</span> <span class="c-t">SerialPilotReconnect</span>({
port,
reconnectInterval: <span class="c-n">500</span>,        <span class="c-c">// start at 500 ms</span>
backoffFactor: <span class="c-n">2</span>,              <span class="c-c">// double each attempt</span>
maxReconnectInterval: <span class="c-n">30000</span>,   <span class="c-c">// cap at 30 s</span>
maxReconnectAttempts: <span class="c-n">20</span>,
})</code></pre>

<h2 id="options">Full options</h2>
<table>
<thead><tr><th>Option</th><th>Default</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>autoReconnect</code></td><td><code>true</code></td><td>Master switch.</td></tr>
<tr><td><code>reconnectInterval</code></td><td><code>1000</code></td><td>Milliseconds between attempts.</td></tr>
<tr><td><code>maxReconnectAttempts</code></td><td><code>Infinity</code></td><td>Cap before <code>reconnect-failed</code>.</td></tr>
<tr><td><code>backoffFactor</code></td><td><code>1</code></td><td>&gt;1 enables exponential backoff.</td></tr>
<tr><td><code>maxReconnectInterval</code></td><td><code>30000</code></td><td>Backoff ceiling.</td></tr>
<tr><td><code>deviceFilter</code></td><td>—</td><td><code>DeviceFilter</code> for find-by-fingerprint.</td></tr>
<tr><td><code>onDisconnect</code> / <code>onReconnect</code> / <code>onReconnectFailed</code></td><td>—</td><td>Imperative-style callbacks.</td></tr>
</tbody>
</table>

<h2 id="events">Events &amp; methods</h2>
<ul>
<li><strong>Events:</strong> <code>disconnect</code>, <code>reconnecting</code>, <code>reconnected</code>, <code>reconnect-failed</code>.</li>
<li><strong>Methods:</strong> <code>start()</code>, <code>stop()</code>, <code>forceReconnect()</code>.</li>
</ul>

<div class="callout">
<strong>Pair with the mock</strong>
Set <code>disconnectAfter: { bytesWritten: 256 }</code> on a <code>MockBinding</code> port to drive your reconnect path in unit tests. Real disconnect, no real hardware.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/recipes/modbus-rtu"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Modbus RTU</span></a>
<a href="/serialpilot/docs/recipes/error-handling"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Error handling</span></a>
</div>
