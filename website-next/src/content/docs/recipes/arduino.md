---
title: "Arduino"
description: "Find the board, open the port, wait for the boot banner, then talk. The full pattern in three short steps."
order: 1
group: recipes
---

<h2 id="find">1. Find the board</h2>
<p>Most Arduino-class boards report a recognisable manufacturer string. Match on it with <code>findPorts()</code>:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">const</span> ports = <span class="c-k">await</span> SerialPilot.<span class="c-t">findPorts</span>({ manufacturer: /arduino/i })
<span class="c-k">if</span> (ports.length === <span class="c-n">0</span>) <span class="c-k">throw new</span> <span class="c-t">Error</span>(<span class="c-s">'no Arduino found'</span>)

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: ports[<span class="c-n">0</span>].path, baudRate: <span class="c-n">115200</span> })</code></pre>
<p>If you know the exact device, match by <code>vendorId</code>/<code>productId</code> instead — they're stable across hosts and OSes.</p>

<h2 id="baud">2. Pick a baud rate</h2>
<table>
<thead><tr><th>Family</th><th>Common rates</th></tr></thead>
<tbody>
<tr><td>Arduino Uno / Nano / Mega</td><td>9600 or 115200</td></tr>
<tr><td>ESP8266 / ESP32</td><td>115200</td></tr>
<tr><td>Teensy</td><td>baud rate ignored — pick anything</td></tr>
</tbody>
</table>

<h2 id="ready">3. Wait for the boot banner</h2>
<p>Many boards reset on serial connect. The first bytes you write may vanish into the bootloader. Pipe through <code>ReadyParser</code> and wait for the device's banner before sending real traffic:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot, ReadyParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: <span class="c-s">'/dev/ttyACM0'</span>, baudRate: <span class="c-n">115200</span> })
<span class="c-k">const</span> ready = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadyParser</span>({ delimiter: <span class="c-s">'READY'</span> }))

ready.<span class="c-t">on</span>(<span class="c-s">'ready'</span>, () =&gt; {
console.log(<span class="c-s">'Arduino is up'</span>)
port.<span class="c-t">write</span>(<span class="c-s">'PING\n'</span>)
})</code></pre>
<p>Have your sketch print <code>READY\n</code> in <code>setup()</code>. Anything received before the banner is buffered; everything after flows as normal stream data.</p>

<h2 id="full">Putting it together</h2>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot, ReadyParser, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">const</span> [info] = <span class="c-k">await</span> SerialPilot.<span class="c-t">findPorts</span>({ manufacturer: /arduino/i })
<span class="c-k">if</span> (!info) <span class="c-k">throw new</span> <span class="c-t">Error</span>(<span class="c-s">'plug it in'</span>)

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: info.path, baudRate: <span class="c-n">115200</span> })
<span class="c-k">const</span> ready = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadyParser</span>({ delimiter: <span class="c-s">'READY'</span> }))
<span class="c-k">const</span> lines = ready.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadlineParser</span>({ delimiter: <span class="c-s">'\n'</span> }))

ready.<span class="c-t">on</span>(<span class="c-s">'ready'</span>, () =&gt; port.<span class="c-t">write</span>(<span class="c-s">'PING\n'</span>))
lines.<span class="c-t">on</span>(<span class="c-s">'data'</span>, line =&gt; console.log(<span class="c-s">'&lt;-'</span>, line))</code></pre>

<div class="callout">
<strong>Tip</strong>
If you can't change the firmware to print a banner, fall back to a simple delay: <code>setTimeout(() =&gt; port.write('PING\n'), 1500)</code>. Crude but reliable for stock Arduino bootloaders.
</div>

<div class="page-foot">
<a href="/serialpilot/docs"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">All recipes</span></a>
<a href="/serialpilot/docs/recipes/modbus-rtu"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Modbus RTU</span></a>
</div>
