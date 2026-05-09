---
title: "Getting started"
description: "Install the package, open a port, read a line. If everything works, you'll see your device's first message inside five minutes — and if it doesn't, the troubleshooting checklist at the bottom covers the usual suspects."
order: 1
group: start
---

<h2 id="requirements">Requirements</h2>
<ul>
<li><strong>Node.js ≥ 20.</strong> SerialPilot uses native bindings compiled against modern N-API.</li>
<li><strong>Linux, macOS, or Windows.</strong> Prebuilt binaries ship for the common architectures; on anything exotic, the package falls back to a source build (needs a C++ toolchain).</li>
<li><strong>OS-level access.</strong> On Linux that means your user is in the <code>dialout</code> group; on macOS and Windows there's nothing to configure.</li>
</ul>

<h2 id="install">Install</h2>
<pre data-lang="shell"><code><span class="c-p">$</span> npm install serialpilot</code></pre>
<p>That single package pulls in the native bindings, the stream wrapper, and every parser. If you want to hand-pick what you depend on:</p>
<pre data-lang="shell"><code><span class="c-p">$</span> npm install @serialpilot/bindings-cpp @serialpilot/stream
<span class="c-p">$</span> npm install @serialpilot/parser-readline</code></pre>

<h2 id="hello-port">Hello, port</h2>
<p>The shortest useful program — list available ports, open one, write a byte, and read whatever comes back as lines:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-c">// 1. discover</span>
<span class="c-k">const</span> ports = <span class="c-k">await</span> SerialPilot.<span class="c-t">list</span>()
console.log(ports)

<span class="c-c">// 2. open</span>
<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({
path: <span class="c-s">'/dev/tty.usbmodem1421'</span>,
baudRate: <span class="c-n">115200</span>,
})

<span class="c-c">// 3. parse incoming bytes into lines</span>
<span class="c-k">const</span> lines = port.pipe(<span class="c-k">new</span> <span class="c-t">ReadlineParser</span>({ delimiter: <span class="c-s">'\n'</span> }))
lines.<span class="c-t">on</span>(<span class="c-s">'data'</span>, line =&gt; console.log(<span class="c-s">'&lt;-'</span>, line))

<span class="c-c">// 4. write</span>
port.<span class="c-t">write</span>(<span class="c-s">'PING\n'</span>)</code></pre>

<p>That's the whole shape of the library — every other feature wraps these four moves: discover, open, parse, write.</p>

<h2 id="anatomy">Anatomy of a port</h2>
<p>A <code>SerialPilot</code> instance is a Node.js Duplex stream that wraps a <em>binding</em>:</p>
<pre data-lang="text"><code>┌──────────────────────────────────────────────┐
│  your code                                   │
│   port.write(...)        port.on('data',...) │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  SerialPilot (Duplex stream)           │  │
│  │  high-water marks · backpressure · ↑↓  │  │
│  └────────────────────────────────────────┘  │
│                  │                           │
│  ┌────────────────────────────────────────┐  │
│  │  Binding  (bindings-cpp / mock / rust) │  │
│  │  open · close · read · write · drain   │  │
│  └────────────────────────────────────────┘  │
│                  │                           │
│           operating system                   │
└──────────────────────────────────────────────┘</code></pre>
<p>You almost never reach for the binding directly — but knowing it's there explains how mocking works, why prebuilds matter, and where to look when an error mentions a system call.</p>

<h2 id="without-hardware">Try it without hardware</h2>
<p>You can run the example above with no device plugged in by swapping the binding for the mock:</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilotMock, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>
<span class="c-k">import</span> { MockBinding } <span class="c-k">from</span> <span class="c-s">'@serialpilot/binding-mock'</span>

MockBinding.<span class="c-t">createPort</span>(<span class="c-s">'/dev/ROBOT'</span>, { echo: <span class="c-k">true</span> })

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilotMock</span>({ path: <span class="c-s">'/dev/ROBOT'</span>, baudRate: <span class="c-n">9600</span> })
<span class="c-k">const</span> lines = port.pipe(<span class="c-k">new</span> <span class="c-t">ReadlineParser</span>({ delimiter: <span class="c-s">'\n'</span> }))
lines.<span class="c-t">on</span>(<span class="c-s">'data'</span>, line =&gt; console.log(line.<span class="c-t">toString</span>()))

port.<span class="c-t">write</span>(<span class="c-s">'hello\n'</span>) <span class="c-c">// echo: lines emits 'hello'</span></code></pre>
<p>The same parsers work against a mock and against silicon — that's the whole point of the abstraction. See <a href="/serialpilot/docs/mocking">Testing &amp; mocking</a> for the deeper version.</p>

<h2 id="cli">Discover ports from your shell</h2>
<p>Sometimes the fastest path is the terminal. <code>serialpilot</code> ships three small CLIs:</p>
<pre data-lang="shell"><code><span class="c-p">$</span> npx serialpilot-list --format json
[{<span class="c-s">"path"</span>:<span class="c-s">"/dev/tty.usbmodem1421"</span>,<span class="c-s">"manufacturer"</span>:<span class="c-s">"Arduino LLC"</span>}]

<span class="c-p">$</span> npx serialpilot-terminal -p /dev/tty.usbmodem1421 -b 115200
<span class="c-c"># interactive console — type, see live response</span>

<span class="c-p">$</span> npx serialpilot-repl -p /dev/tty.usbmodem1421
<span class="c-c"># scriptable Node REPL with `port` and `SerialPilot` in scope</span></code></pre>

<h2 id="troubleshooting">When things don't work</h2>
<table>
<thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>PortNotFoundError</code></td><td>Path is wrong or device unplugged</td><td><code>SerialPilot.list()</code> to enumerate; or use <code>findPorts({ vendorId: '…' })</code></td></tr>
<tr><td><code>PermissionDeniedError</code></td><td>Linux user not in <code>dialout</code></td><td><code>sudo usermod -aG dialout $USER</code> &amp; log out / back in</td></tr>
<tr><td><code>PortBusyError</code></td><td>Arduino IDE / PuTTY / screen has the port</td><td>Close the other app; only one process can hold the port</td></tr>
<tr><td>Garbled bytes</td><td>Baud rate mismatch</td><td>9600 / 115200 are the usual; consult the device datasheet</td></tr>
<tr><td>Native build fails on install</td><td>No prebuild for your arch + no toolchain</td><td>Install Xcode CLT / build-essential / Visual Studio C++ Build Tools</td></tr>
</tbody>
</table>

<div class="callout">
<strong>Tip</strong>
Many Arduino-class boards reset when a serial connection opens. If your first <code>write()</code> seems to vanish, pipe through <a href="/serialpilot/docs/parsers#ready"><code>ReadyParser</code></a> and wait for the boot banner before you start sending.
</div>

<div class="page-foot">
<a href="/serialpilot/docs">
<span class="page-foot__lbl">← Back</span>
<span class="page-foot__title">Documentation overview</span>
</a>
<a href="/serialpilot/docs/api">
<span class="page-foot__lbl">Next →</span>
<span class="page-foot__title">Core API</span>
</a>
</div>
