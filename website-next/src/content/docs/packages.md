---
title: "Package matrix"
description: "Twenty-one published packages, all version 1.0.0, all under the @serialpilot scope (with the exception of the meta package, which is just serialpilot). Install the meta package for the common case; cherry-pick when bundle size matters."
order: 6
group: reference
---

<h2 id="meta">Meta</h2>
<table>
<thead><tr><th>Package</th><th>What it does</th><th>Depends on</th></tr></thead>
<tbody>
<tr>
<td><a href="https://www.npmjs.com/package/serialpilot" rel="noopener"><code>serialpilot</code></a></td>
<td>Auto-detected bindings, the stream wrapper, every parser re-exported. Most projects only need this one.</td>
<td>everything below</td>
</tr>
</tbody>
</table>

<h2 id="bindings">Bindings</h2>
<table>
<thead><tr><th>Package</th><th>What it does</th></tr></thead>
<tbody>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/bindings-cpp" rel="noopener"><code>@serialpilot/bindings-cpp</code></a></td>
<td>Native N-API bindings. Ships with prebuilds for the common (OS, arch, Node) triples; falls back to a source build if none match.</td>
</tr>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/bindings-interface" rel="noopener"><code>@serialpilot/bindings-interface</code></a></td>
<td>The TypeScript interface every binding implements. Import this if you're writing your own backend (a virtual port, a TCP-bridged port, a CI mock).</td>
</tr>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/binding-mock" rel="noopener"><code>@serialpilot/binding-mock</code></a></td>
<td>In-memory binding for tests. Echo, record, periodic data, programmable responders. See <a href="/serialpilot/docs/mocking">Mocking</a>.</td>
</tr>
</tbody>
</table>
<p>A pure-Rust binding ships in the same monorepo as a Cargo crate at <code>crates/bindings-rust</code>. It's not on npm because it isn't a JavaScript package — use it from Rust projects directly.</p>

<h2 id="interface">Interfaces</h2>
<table>
<thead><tr><th>Package</th><th>What it does</th></tr></thead>
<tbody>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/stream" rel="noopener"><code>@serialpilot/stream</code></a></td>
<td>The Node.js Duplex stream wrapper that <code>SerialPilot</code> extends. Re-export it directly if you want a different binding without the parser bundle.</td>
</tr>
</tbody>
</table>

<h2 id="helpers">High-level helpers</h2>
<table>
<thead><tr><th>Package</th><th>What it does</th></tr></thead>
<tbody>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/reconnect" rel="noopener"><code>@serialpilot/reconnect</code></a></td>
<td>Auto-reconnect wrapper with exponential backoff and device-filter rediscovery. See the <a href="/serialpilot/docs/recipes/reconnect">recipe</a>.</td>
</tr>
<tr>
<td><a href="https://www.npmjs.com/package/@serialpilot/command-queue" rel="noopener"><code>@serialpilot/command-queue</code></a></td>
<td>Request/response over half-duplex links — AT commands, Modbus RTU, ccTalk. Per-command timeout, retry, regex match. See the <a href="/serialpilot/docs/recipes/modbus-rtu">Modbus recipe</a>.</td>
</tr>
</tbody>
</table>

<h2 id="cli-pkg">CLI</h2>
<table>
<thead><tr><th>Package</th><th>Binary</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/list" rel="noopener"><code>@serialpilot/list</code></a></td><td><code>serialpilot-list</code></td><td>Enumerate ports.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/terminal" rel="noopener"><code>@serialpilot/terminal</code></a></td><td><code>serialpilot-terminal</code></td><td>Interactive console.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/repl" rel="noopener"><code>@serialpilot/repl</code></a></td><td><code>serialpilot-repl</code></td><td>Scriptable Node REPL.</td></tr>
</tbody>
</table>

<h2 id="parsers-pkg">Parsers</h2>
<table>
<thead><tr><th>Package</th><th>Class</th><th>For</th></tr></thead>
<tbody>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-byte-length" rel="noopener"><code>parser-byte-length</code></a></td><td><code>ByteLengthParser</code></td><td>Fixed-size frames.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-cctalk" rel="noopener"><code>parser-cctalk</code></a></td><td><code>CCTalkParser</code></td><td>Coin/bill validators.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-delimiter" rel="noopener"><code>parser-delimiter</code></a></td><td><code>DelimiterParser</code></td><td>Split on byte sequence.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-inter-byte-timeout" rel="noopener"><code>parser-inter-byte-timeout</code></a></td><td><code>InterByteTimeoutParser</code></td><td>Quiescence-based framing.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-packet-length" rel="noopener"><code>parser-packet-length</code></a></td><td><code>PacketLengthParser</code></td><td>Length-prefixed packets.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-readline" rel="noopener"><code>parser-readline</code></a></td><td><code>ReadlineParser</code></td><td>Line-by-line text.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-ready" rel="noopener"><code>parser-ready</code></a></td><td><code>ReadyParser</code></td><td>Wait for sentinel.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-regex" rel="noopener"><code>parser-regex</code></a></td><td><code>RegexParser</code></td><td>Split on a pattern.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-slip-encoder" rel="noopener"><code>parser-slip-encoder</code></a></td><td><code>SlipEncoder</code> / <code>SlipDecoder</code></td><td>RFC 1055 SLIP framing.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-spacepacket" rel="noopener"><code>parser-spacepacket</code></a></td><td><code>SpacePacketParser</code></td><td>CCSDS Space Packet.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/parser-start-end" rel="noopener"><code>parser-start-end</code></a></td><td><code>StartEndParser</code></td><td>STX/ETX-style frames.</td></tr>
</tbody>
</table>

<h2 id="drivers">Drivers</h2>
<p>Higher-level device drivers live in the <a href="https://github.com/serialpilot/serialpilot-drivers"><code>serialpilot-drivers</code></a> monorepo. Each driver is a standalone npm package that takes a <code>Transport</code> (usually a <code>SerialPilot</code> instance) and emits typed events or provides a request/response API.</p>
<table>
<thead><tr><th>Package</th><th>Protocol</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-kit" rel="noopener"><code>@serialpilot/driver-kit</code></a></td><td>—</td><td>Shared building blocks: <code>Device</code> base class, <code>Transport</code> interface, <code>MockTransport</code>, <code>RequestQueue</code>, <code>LineBuffer</code>, <code>createLogger</code>.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-gps" rel="noopener"><code>@serialpilot/driver-gps</code></a></td><td>NMEA 0183</td><td>GPS receiver — GGA/RMC/GSA/GSV, typed <code>Fix</code> events.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-grbl" rel="noopener"><code>@serialpilot/driver-grbl</code></a></td><td>GRBL 1.1</td><td>CNC controller — typed status, command-queued G-code, real-time control.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-esp-flasher" rel="noopener"><code>@serialpilot/driver-esp-flasher</code></a></td><td>ESP ROM</td><td>ESP32/ESP8266 ROM-bootloader flasher — SLIP framing, chip detect, flash with progress.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-at" rel="noopener"><code>@serialpilot/driver-at</code></a></td><td>AT commands</td><td>Generic AT-command framework — cellular/LoRa/WiFi-via-AT modems.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-modbus-rtu" rel="noopener"><code>@serialpilot/driver-modbus-rtu</code></a></td><td>Modbus RTU</td><td>Industrial automation — read/write holding/input registers, CRC-16, typed errors.</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@serialpilot/driver-plantower" rel="noopener"><code>@serialpilot/driver-plantower</code></a></td><td>Plantower PM</td><td>PMS5003/PMS1003/PMS3003 particulate matter sensor — active-mode readings with checksum validation.</td></tr>
</tbody>
</table>

<h2 id="layering">How the layers fit</h2>
<pre data-lang="text"><code>┌─────────────────────────────────────────────────────┐
│  Drivers (GPS, GRBL, ESP, AT, Modbus, Plantower)    │
│  ↑ each takes a Transport, emits typed events       │
└─────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────┐
│  serialpilot      (meta — re-exports everything)    │
└─────────────────────────────────────────────────────┘
│            │             │
┌────▼────┐  ┌────▼────┐   ┌────▼────────────┐
│ stream  │  │ parsers │   │ helpers         │
│ Duplex  │  │ × 11    │   │ reconnect       │
│ wrapper │  │         │   │ command-queue   │
└────┬────┘  └─────────┘   └─────────────────┘
│
┌────▼─────────────────────────┐
│ bindings-interface           │
│  ↑ implemented by ↑          │
│ bindings-cpp · binding-mock  │
└──────────────────────────────┘</code></pre>

<h2 id="versioning">Versioning</h2>
<p>All <code>@serialpilot/*</code> packages are released in lock-step. A 1.x release of the meta package always pins exact 1.x versions of its dependencies — there is no scenario where you should mix-and-match minor versions across the scope.</p>

<h2 id="picking">Pick the smallest set</h2>
<p>If you're worried about install size or cold-start time:</p>
<ul>
<li>Just opening a port and reading raw bytes? <code>@serialpilot/bindings-cpp</code> + <code>@serialpilot/stream</code>.</li>
<li>Plus line-oriented protocols? Add <code>@serialpilot/parser-readline</code>.</li>
<li>Need the mock for tests but only in dev? <code>npm i -D @serialpilot/binding-mock</code>.</li>
<li>Production resilience? <code>@serialpilot/reconnect</code>.</li>
<li>Talking to a specific protocol? Install the relevant driver from <a href="https://github.com/serialpilot/serialpilot-drivers">serialpilot-drivers</a> — e.g. <code>@serialpilot/driver-modbus-rtu</code> for industrial equipment, or <code>@serialpilot/driver-gps</code> for GPS receivers.</li>
</ul>

<div class="page-foot">
<a href="/serialpilot/docs/errors"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Errors</span></a>
<a href="/serialpilot/docs"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Recipes</span></a>
</div>
