---
title: "Parsers"
description: "Every parser is a Node Transform stream. You pipe a port into one, listen for data, and you get framed messages instead of a chaotic byte stream. Pick the parser that matches your protocol's framing strategy."
order: 2
group: reference
---

<h2 id="cheatsheet">Pick a parser</h2>
<table>
<thead><tr><th>If your protocol…</th><th>Use</th></tr></thead>
<tbody>
<tr><td>ends each message with a newline</td><td><a href="#readline"><code>ReadlineParser</code></a></td></tr>
<tr><td>uses any other byte sequence as a separator</td><td><a href="#delimiter"><code>DelimiterParser</code></a></td></tr>
<tr><td>has fixed-size messages</td><td><a href="#byte-length"><code>ByteLengthParser</code></a></td></tr>
<tr><td>splits on a regex (mixed line endings, e.g. <code>\r?\n</code>)</td><td><a href="#regex"><code>RegexParser</code></a></td></tr>
<tr><td>length-prefixes each packet</td><td><a href="#packet-length"><code>PacketLengthParser</code></a></td></tr>
<tr><td>relies on inter-byte silence (Modbus RTU)</td><td><a href="#inter-byte"><code>InterByteTimeoutParser</code></a></td></tr>
<tr><td>prints a banner before it's ready</td><td><a href="#ready"><code>ReadyParser</code></a></td></tr>
<tr><td>frames binary with SLIP escapes</td><td><a href="#slip"><code>SlipEncoder/Decoder</code></a></td></tr>
<tr><td>brackets data with start/end markers</td><td><a href="#start-end"><code>StartEndParser</code></a></td></tr>
<tr><td>is ccTalk (coin/bill validators)</td><td><a href="#cctalk"><code>CCTalkParser</code></a></td></tr>
<tr><td>is CCSDS Space Packet</td><td><a href="#spacepacket"><code>SpacePacketParser</code></a></td></tr>
</tbody>
</table>

<hr>

<h2 id="readline"><code>ReadlineParser</code></h2>
<p>Emits one string per line. The line-oriented sweet spot for most Arduino-class boards.</p>
<pre data-lang="javascript"><code><span class="c-k">import</span> { SerialPilot, ReadlineParser } <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: <span class="c-s">'/dev/ttyUSB0'</span>, baudRate: <span class="c-n">9600</span> })
<span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadlineParser</span>({ delimiter: <span class="c-s">'\r\n'</span> }))
parser.<span class="c-t">on</span>(<span class="c-s">'data'</span>, line =&gt; console.log(line))</code></pre>
<table><thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>delimiter</code></td><td><code>string | Buffer</code></td><td><code>'\n'</code></td><td>Line terminator.</td></tr>
<tr><td><code>encoding</code></td><td><code>string</code></td><td><code>'utf8'</code></td><td>Text encoding for emitted strings.</td></tr>
<tr><td><code>includeDelimiter</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Whether emitted lines keep the delimiter.</td></tr>
</tbody></table>

<hr>

<h2 id="delimiter"><code>DelimiterParser</code></h2>
<p>Generic version of <code>ReadlineParser</code> — split on any byte sequence and emit Buffers (or strings if you set <code>encoding</code> downstream).</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">DelimiterParser</span>({
delimiter: Buffer.<span class="c-t">from</span>([<span class="c-n">0xAA</span>, <span class="c-n">0x55</span>]),
}))</code></pre>
<table><thead><tr><th>Option</th><th>Type</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>delimiter</code></td><td><code>string | Buffer | number[]</code></td><td>Required. Length ≥ 1.</td></tr>
<tr><td><code>includeDelimiter</code></td><td><code>boolean</code></td><td>Default <code>false</code>.</td></tr>
</tbody></table>

<hr>

<h2 id="byte-length"><code>ByteLengthParser</code></h2>
<p>Emits a Buffer every time a fixed number of bytes have been received.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ByteLengthParser</span>({ length: <span class="c-n">8</span> }))
parser.<span class="c-t">on</span>(<span class="c-s">'data'</span>, buf =&gt; console.log(buf)) <span class="c-c">// 8 bytes each time</span></code></pre>
<p>Throws if <code>length</code> is missing, zero, or negative.</p>

<hr>

<h2 id="regex"><code>RegexParser</code></h2>
<p>Like <code>ReadlineParser</code>, but the splitter is a RegExp. Useful when devices send mixed line endings:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">RegexParser</span>({ regex: /\r?\n/ }))</code></pre>
<table><thead><tr><th>Option</th><th>Type</th><th>Default</th></tr></thead><tbody>
<tr><td><code>regex</code></td><td><code>RegExp</code></td><td>required</td></tr>
<tr><td><code>encoding</code></td><td><code>string</code></td><td><code>'utf8'</code></td></tr>
</tbody></table>

<hr>

<h2 id="packet-length"><code>PacketLengthParser</code></h2>
<p>For protocols that prefix each packet with its length. Reads the length field at a configured offset and waits for the full packet to land before emitting.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">PacketLengthParser</span>({
delimiter: <span class="c-n">0xa5</span>,        <span class="c-c">// header byte</span>
packetOverhead: <span class="c-n">5</span>,      <span class="c-c">// non-payload bytes</span>
lengthBytes: <span class="c-n">1</span>,         <span class="c-c">// size of the length field</span>
lengthOffset: <span class="c-n">2</span>,        <span class="c-c">// offset of the length field</span>
maxLen: <span class="c-n">0xff</span>,
}))</code></pre>
<table><thead><tr><th>Option</th><th>Default</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>delimiter</code></td><td><code>0xaa</code></td><td>Header byte that starts a packet.</td></tr>
<tr><td><code>packetOverhead</code></td><td><code>2</code></td><td>Bytes outside the payload.</td></tr>
<tr><td><code>lengthBytes</code></td><td><code>1</code></td><td>Size of the length field.</td></tr>
<tr><td><code>lengthOffset</code></td><td><code>1</code></td><td>Position of the length field.</td></tr>
<tr><td><code>maxLen</code></td><td><code>0xff</code></td><td>Largest valid packet — guards against runaway frames.</td></tr>
</tbody></table>

<hr>

<h2 id="inter-byte"><code>InterByteTimeoutParser</code></h2>
<p>Emits buffered data when the line stays quiet for <code>interval</code> milliseconds. Modbus RTU's classic "3.5-character silence" framing fits here.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">InterByteTimeoutParser</span>({ interval: <span class="c-n">30</span> }))</code></pre>
<table><thead><tr><th>Option</th><th>Default</th><th>Notes</th></tr></thead><tbody>
<tr><td><code>interval</code></td><td>required</td><td>Milliseconds of silence (≥ 1).</td></tr>
<tr><td><code>maxBufferSize</code></td><td><code>65536</code></td><td>Bytes buffered before forced emit.</td></tr>
</tbody></table>

<hr>

<h2 id="ready"><code>ReadyParser</code></h2>
<p>Buffers everything until a configured ready sequence arrives, then emits <code>ready</code> and forwards bytes from that point on. Most Arduino-class boards print a banner on reset; this parser tells you when they're done.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">ReadyParser</span>({ delimiter: <span class="c-s">'READY'</span> }))
parser.<span class="c-t">on</span>(<span class="c-s">'ready'</span>, () =&gt; port.<span class="c-t">write</span>(<span class="c-s">'PING\n'</span>))
parser.<span class="c-t">on</span>(<span class="c-s">'data'</span>, console.log) <span class="c-c">// data after the banner</span></code></pre>

<hr>

<h2 id="slip"><code>SlipEncoder</code> / <code>SlipDecoder</code></h2>
<p>Two complementary streams that implement <a href="https://datatracker.ietf.org/doc/html/rfc1055" rel="noopener">RFC 1055 SLIP framing</a>. Common in ESP-IDF tools and embedded MCUs.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> decoder = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">SlipDecoder</span>())
decoder.<span class="c-t">on</span>(<span class="c-s">'data'</span>, frame =&gt; console.log(<span class="c-s">'frame:'</span>, frame))

<span class="c-k">const</span> encoder = <span class="c-k">new</span> <span class="c-t">SlipEncoder</span>()
encoder.<span class="c-t">pipe</span>(port)
encoder.<span class="c-t">write</span>(Buffer.<span class="c-t">from</span>([<span class="c-n">0x01</span>, <span class="c-n">0x02</span>, <span class="c-n">0xc0</span>])) <span class="c-c">// 0xc0 escaped automatically</span></code></pre>
<p>Both honour the standard SLIP byte values: <code>END=0xC0</code>, <code>ESC=0xDB</code>, <code>ESC_END=0xDC</code>, <code>ESC_ESC=0xDD</code>.</p>

<hr>

<h2 id="start-end"><code>StartEndParser</code></h2>
<p>Emits the bytes between a configured start delimiter and a configured end delimiter. Suits NMEA, custom binary frames, or anything that uses opening/closing markers.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">StartEndParser</span>({
startDelimiter: Buffer.<span class="c-t">from</span>([<span class="c-n">0xa5</span>]),
endDelimiter: Buffer.<span class="c-t">from</span>([<span class="c-n">0x5a</span>]),
}))</code></pre>

<hr>

<h2 id="cctalk"><code>CCTalkParser</code></h2>
<p>Parses the <a href="https://en.wikipedia.org/wiki/CcTalk" rel="noopener">ccTalk protocol</a> used by coin acceptors and bill validators in vending and gaming hardware. Emits each fully-received frame as a Buffer.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">CCTalkParser</span>())
parser.<span class="c-t">on</span>(<span class="c-s">'data'</span>, frame =&gt; console.log(frame))</code></pre>

<hr>

<h2 id="spacepacket"><code>SpacePacketParser</code></h2>
<p>Parses CCSDS Space Packet framing — the international standard used by spacecraft telemetry/telecommand links. Emits objects with parsed primary header fields and the payload buffer.</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> parser = port.<span class="c-t">pipe</span>(<span class="c-k">new</span> <span class="c-t">SpacePacketParser</span>())
parser.<span class="c-t">on</span>(<span class="c-s">'data'</span>, packet =&gt; {
console.log(packet.header.apid, packet.data)
})</code></pre>
<p>Header fields exposed: <code>version</code>, <code>type</code>, <code>secondaryHeaderFlag</code>, <code>apid</code>, <code>sequenceFlags</code>, <code>sequenceCount</code>, <code>length</code>.</p>

<hr>

<h2 id="custom">Writing your own</h2>
<p>A parser is just a Node Transform stream. Roll your own by extending <code>stream.Transform</code> and implementing <code>_transform(chunk, _, cb)</code> — most of the parsers above are under 100 lines of source.</p>

<div class="page-foot">
<a href="/serialpilot/docs/api"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Core API</span></a>
<a href="/serialpilot/docs/mocking"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Mocking</span></a>
</div>
