---
title: "Error handling"
description: "SerialPilot's errors come with a stable code, a human message, and an actionable advice string. Treat them as data, not as flammable strings — your operations team will thank you."
order: 4
group: recipes
---

<h2 id="anatomy">Error anatomy</h2>
<p>Every <code>SerialPilotError</code> instance has:</p>
<ul>
<li><code>code</code> — a <code>SerialPilotErrorCode</code> enum value (e.g. <code>'PORT_NOT_FOUND'</code>).</li>
<li><code>message</code> — a human-readable description.</li>
<li><code>advice</code> — what to actually do about it.</li>
<li><code>path</code> / <code>baudRate</code> — context, when known.</li>
<li><code>cause</code> — the underlying OS error, when one exists.</li>
</ul>

<h2 id="catalog">Catalogue</h2>
<table>
<thead><tr><th>Code</th><th>Class</th><th>Cause</th><th>Advice</th></tr></thead>
<tbody>
<tr><td><code>PORT_NOT_FOUND</code></td><td><code>PortNotFoundError</code></td><td>Device unplugged or path wrong</td><td>Check the cable; use <code>findPorts()</code></td></tr>
<tr><td><code>PERMISSION_DENIED</code></td><td><code>PermissionDeniedError</code></td><td>Insufficient OS permissions</td><td>Linux: add user to <code>dialout</code></td></tr>
<tr><td><code>PORT_BUSY</code></td><td><code>PortBusyError</code></td><td>Another app is holding the port</td><td>Close Arduino IDE, screen, PuTTY, etc.</td></tr>
<tr><td><code>DISCONNECTED</code></td><td><code>DisconnectedError</code></td><td>Device unplugged mid-session</td><td>Use <a href="/serialpilot/docs/recipes/reconnect"><code>@serialpilot/reconnect</code></a></td></tr>
<tr><td><code>OPEN_FAILED</code></td><td><code>OpenFailedError</code></td><td>Generic open failure</td><td>Inspect <code>err.cause</code> for the OS reason</td></tr>
<tr><td><code>WRITE_FAILED</code></td><td><code>WriteFailedError</code></td><td>Wrote to a port that's gone</td><td>Check <code>port.isOpen</code>; honour backpressure</td></tr>
<tr><td><code>READ_FAILED</code></td><td><code>ReadFailedError</code></td><td>Read from a port that's gone</td><td>Same as above</td></tr>
<tr><td><code>CANCELLED</code></td><td><code>CancelledError</code></td><td>Operation aborted</td><td>Normal during <code>close()</code> — usually safe to ignore</td></tr>
<tr><td><code>INVALID_ARGUMENT</code></td><td><code>InvalidArgumentError</code></td><td>Bad constructor args</td><td>Validate <code>path</code> and <code>baudRate</code></td></tr>
<tr><td><code>TIMEOUT</code></td><td><code>TimeoutError</code></td><td>Operation took too long</td><td>Bump the timeout, retry, or check the device</td></tr>
</tbody>
</table>

<h2 id="catching">Catching at construction time</h2>
<pre data-lang="javascript"><code><span class="c-k">import</span> {
SerialPilot,
SerialPilotError,
PortNotFoundError,
PermissionDeniedError,
} <span class="c-k">from</span> <span class="c-s">'serialpilot'</span>

<span class="c-k">try</span> {
<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: <span class="c-s">'/dev/ttyUSB0'</span>, baudRate: <span class="c-n">9600</span> })
} <span class="c-k">catch</span> (err) {
<span class="c-k">if</span> (err <span class="c-k">instanceof</span> <span class="c-t">PortNotFoundError</span>) {
console.error(err.advice)
} <span class="c-k">else if</span> (err <span class="c-k">instanceof</span> <span class="c-t">PermissionDeniedError</span>) {
console.error(err.advice)
} <span class="c-k">else if</span> (err <span class="c-k">instanceof</span> <span class="c-t">SerialPilotError</span>) {
console.error(<span class="c-s">`${err.code}: ${err.message}`</span>)
console.error(<span class="c-s">`Advice: ${err.advice}`</span>)
}
}</code></pre>

<h2 id="async">Catching at runtime</h2>
<p>Asynchronous failures arrive on the port's <code>error</code> event. Always attach a listener — an unhandled stream <code>error</code> crashes the Node process:</p>
<pre data-lang="javascript"><code>port.<span class="c-t">on</span>(<span class="c-s">'error'</span>, err =&gt; {
<span class="c-k">if</span> (err <span class="c-k">instanceof</span> <span class="c-t">DisconnectedError</span>) {
<span class="c-c">// trigger reconnect logic, alert your fleet</span>
} <span class="c-k">else if</span> (err <span class="c-k">instanceof</span> <span class="c-t">CancelledError</span>) {
<span class="c-c">// pending operation cancelled by close() — usually fine</span>
} <span class="c-k">else</span> {
log.<span class="c-t">error</span>({ code: err.code, advice: err.advice }, err.message)
}
})</code></pre>

<h2 id="logging">Structured logging</h2>
<p>Treat the error like a record:</p>
<pre data-lang="javascript"><code>logger.<span class="c-t">error</span>({
code:     err.code,
path:     err.path,
baudRate: err.baudRate,
advice:   err.advice,
cause:    err.cause?.message,
}, err.message)</code></pre>
<p>Now your dashboards can group by <code>code</code> rather than free-text matching, and alerts can target specific failure modes.</p>

<div class="callout callout--warn">
<strong>Don't swallow CancelledError</strong>
…unless you mean to. It's expected during <code>close()</code>, but seeing it elsewhere usually means a <code>destroy()</code>/<code>abort()</code> happened mid-flight — which may or may not be a bug in your code.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/recipes/reconnect"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Reconnect</span></a>
<a href="/serialpilot/docs/recipes/electron"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Electron</span></a>
</div>
