---
title: "CLI tools"
description: "Three small binaries — list, terminal, repl — for the things you'd otherwise script ad hoc. Install them per-project with npm i or globally with npm i -g; they all use the same N-API bindings as the library."
order: 4
group: reference
---

<h2 id="install">Install</h2>
<pre data-lang="shell"><code><span class="c-c"># once, globally</span>
<span class="c-p">$</span> npm install -g @serialpilot/list @serialpilot/terminal @serialpilot/repl

<span class="c-c"># or per-project; they're already there if you installed `serialpilot`</span>
<span class="c-p">$</span> npx serialpilot-list --format json</code></pre>

<h2 id="list"><code>serialpilot-list</code></h2>
<p>Enumerate every serial port the OS knows about. The fastest way to verify your device is even visible.</p>
<pre data-lang="shell"><code><span class="c-p">$</span> serialpilot-list
/dev/tty.usbmodem1421    USB-VID_2341&amp;PID_0043       Arduino LLC
/dev/tty.Bluetooth-Incoming-Port

<span class="c-p">$</span> serialpilot-list --format json
[{<span class="c-s">"path"</span>:<span class="c-s">"/dev/tty.usbmodem1421"</span>,<span class="c-s">"manufacturer"</span>:<span class="c-s">"Arduino LLC"</span>,...}]

<span class="c-p">$</span> serialpilot-list --format jsonl   <span class="c-c"># one JSON object per line</span></code></pre>
<table>
<thead><tr><th>Flag</th><th>Default</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>-f</code>, <code>--format</code></td><td><code>text</code></td><td>One of <code>text</code>, <code>json</code>, <code>jsonl</code> / <code>jsonline</code>.</td></tr>
<tr><td><code>-h</code>, <code>--help</code></td><td>—</td><td>Show usage.</td></tr>
</tbody>
</table>
<p>Pipe the JSON output into <code>jq</code> for ad-hoc filtering:</p>
<pre data-lang="shell"><code><span class="c-p">$</span> serialpilot-list --format json | jq <span class="c-s">'.[] | select(.manufacturer | test("arduino"; "i"))'</span></code></pre>

<h2 id="terminal"><code>serialpilot-terminal</code></h2>
<p>An interactive console for talking to a port. Connect, type, see live response, exit on <kbd>Ctrl-C</kbd>.</p>
<pre data-lang="shell"><code><span class="c-p">$</span> serialpilot-terminal --list
<span class="c-c"># shows ports and exits</span>

<span class="c-p">$</span> serialpilot-terminal -p /dev/tty.usbmodem1421 -b 115200
<span class="c-c"># interactive — bytes you type are sent, bytes received print live</span></code></pre>
<table>
<thead><tr><th>Flag</th><th>Default</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>-l</code>, <code>--list</code></td><td>—</td><td>List ports and exit.</td></tr>
<tr><td><code>-p</code>, <code>--path</code></td><td>—</td><td>Required when not listing.</td></tr>
<tr><td><code>-b</code>, <code>--baud</code></td><td>—</td><td>Required when not listing.</td></tr>
<tr><td><code>--databits</code></td><td><code>8</code></td><td>5 / 6 / 7 / 8.</td></tr>
<tr><td><code>--parity</code></td><td><code>none</code></td><td><code>none</code> · <code>even</code> · <code>odd</code> · <code>mark</code> · <code>space</code>.</td></tr>
<tr><td><code>--stopbits</code></td><td><code>1</code></td><td>1 · 1.5 · 2.</td></tr>
<tr><td><code>--no-echo</code></td><td>—</td><td>Don't print characters as you type them.</td></tr>
<tr><td><code>--flow-ctl</code></td><td>—</td><td><code>XONOFF</code> · <code>RTSCTS</code>.</td></tr>
</tbody>
</table>

<h2 id="repl"><code>serialpilot-repl</code></h2>
<p>A scriptable Node REPL with <code>SerialPilot</code> and a connected <code>port</code> already in scope. The fastest way to poke at a device interactively.</p>
<pre data-lang="shell"><code><span class="c-p">$</span> serialpilot-repl
<span class="c-c"># globals: SerialPilot, SerialPilotMock, path, port</span>
&gt; port = <span class="c-k">new</span> SerialPilot({ path: <span class="c-s">'/dev/tty.usbmodem1421'</span>, baudRate: <span class="c-n">9600</span> })
&gt; port.<span class="c-t">on</span>(<span class="c-s">'data'</span>, console.log)
&gt; port.<span class="c-t">write</span>(<span class="c-s">'PING\n'</span>)</code></pre>
<p>Set the <code>DEBUG</code> environment variable to trace internals:</p>
<pre data-lang="shell"><code><span class="c-p">$</span> DEBUG=serialpilot* serialpilot-repl</code></pre>

<h2 id="scripting">Scripting tips</h2>
<ul>
<li>Pair <code>serialpilot-list --format json</code> with <code>jq</code> to drive shell scripts off device fingerprints.</li>
<li>Run <code>serialpilot-terminal --no-echo</code> when piping into a logfile so you don't double-record what you typed.</li>
<li>The repl honours <code>NODE_OPTIONS</code> — pass <code>--inspect</code> to attach a debugger.</li>
</ul>

<div class="page-foot">
<a href="/serialpilot/docs/mocking"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Mocking</span></a>
<a href="/serialpilot/docs/errors"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Errors</span></a>
</div>
