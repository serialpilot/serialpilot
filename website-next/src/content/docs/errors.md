---
title: "Errors & reliability"
description: "Every error SerialPilot throws is a strongly-typed subclass of SerialPilotError with a stable code, a human message, and an actionable advice string. You can match on the class, on the code, or on both."
order: 5
group: reference
---

<h2 id="shape">Error shape</h2>
<table>
<thead><tr><th>Property</th><th>Type</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code>code</code></td><td><code>SerialPilotErrorCode</code></td><td>Stable enum-like string (e.g. <code>'PORT_NOT_FOUND'</code>).</td></tr>
<tr><td><code>message</code></td><td><code>string</code></td><td>Human-readable description.</td></tr>
<tr><td><code>advice</code></td><td><code>string</code></td><td>What to do about it.</td></tr>
<tr><td><code>path</code></td><td><code>string?</code></td><td>The port path involved, when known.</td></tr>
<tr><td><code>baudRate</code></td><td><code>number?</code></td><td>The baud rate, when known.</td></tr>
<tr><td><code>cause</code></td><td><code>Error?</code></td><td>The underlying OS error, when one exists.</td></tr>
</tbody>
</table>

<h2 id="catalog">Error catalogue</h2>
<table>
<thead><tr><th>Code</th><th>Class</th><th>Cause</th><th>Recovery</th></tr></thead>
<tbody>
<tr><td><code>PORT_NOT_FOUND</code></td><td><code>PortNotFoundError</code></td><td>Path wrong or device unplugged.</td><td>Re-enumerate; use <code>findPorts()</code>.</td></tr>
<tr><td><code>PERMISSION_DENIED</code></td><td><code>PermissionDeniedError</code></td><td>OS denied access to the device.</td><td>Linux: add user to <code>dialout</code>. macOS: grant in System Settings → Privacy.</td></tr>
<tr><td><code>PORT_BUSY</code></td><td><code>PortBusyError</code></td><td>Another process holds the port.</td><td>Close the other app (Arduino IDE, screen, PuTTY).</td></tr>
<tr><td><code>DISCONNECTED</code></td><td><code>DisconnectedError</code></td><td>Device unplugged mid-session.</td><td>Use <code>@serialpilot/reconnect</code> for resilient sessions.</td></tr>
<tr><td><code>OPEN_FAILED</code></td><td><code>OpenFailedError</code></td><td>Generic open failure (often follows a more specific error).</td><td>Inspect <code>err.cause</code> for the OS reason.</td></tr>
<tr><td><code>WRITE_FAILED</code></td><td><code>WriteFailedError</code></td><td>Wrote to a port that's gone.</td><td>Check <code>port.isOpen</code> before writing in flaky environments.</td></tr>
<tr><td><code>READ_FAILED</code></td><td><code>ReadFailedError</code></td><td>Read from a port that's gone.</td><td>Same as above.</td></tr>
<tr><td><code>CANCELLED</code></td><td><code>CancelledError</code></td><td>An in-flight operation was aborted.</td><td>Expected when calling <code>close()</code> with pending I/O — usually safe to ignore.</td></tr>
<tr><td><code>INVALID_ARGUMENT</code></td><td><code>InvalidArgumentError</code></td><td>Bad constructor args.</td><td>Validate <code>path</code> and <code>baudRate</code>.</td></tr>
<tr><td><code>TIMEOUT</code></td><td><code>TimeoutError</code></td><td>Operation exceeded its budget (mostly from <code>command-queue</code>).</td><td>Raise the timeout, retry, or check device responsiveness.</td></tr>
</tbody>
</table>

<h2 id="catching">Catching</h2>
<pre data-lang="javascript"><code><span class="c-k">import</span> {
SerialPilot,
SerialPilotError,
PortNotFoundError,
PermissionDeniedError,
PortBusyError,
DisconnectedError,
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

<h2 id="event">Error events</h2>
<p>Asynchronous failures arrive on the port's <code>error</code> event. <em>Always</em> attach a listener — an unhandled stream error crashes the Node process.</p>
<pre data-lang="javascript"><code>port.<span class="c-t">on</span>(<span class="c-s">'error'</span>, err =&gt; {
<span class="c-k">if</span> (err <span class="c-k">instanceof</span> <span class="c-t">DisconnectedError</span>) {
<span class="c-c">// trigger reconnect</span>
} <span class="c-k">else</span> {
log.<span class="c-t">error</span>({ code: err.code, advice: err.advice }, err.message)
}
})</code></pre>

<h2 id="strategies">Reliability strategies</h2>
<ul>
<li><strong>Auto-reconnect.</strong> Wrap your port with <a href="/serialpilot/docs/recipes/reconnect"><code>SerialPilotReconnect</code></a> in production. It handles cable yanks, USB-path reshuffles, and exponential backoff.</li>
<li><strong>Open-by-device.</strong> Use <code>SerialPilot.openByDevice({ vendorId, productId })</code> instead of pinning to a path — paths shift between hosts and OSes.</li>
<li><strong>Honour backpressure.</strong> If <code>port.write()</code> returns <code>false</code>, wait for <code>'drain'</code>. Continually writing past the high-water mark causes ballooning memory and ultimately <code>WRITE_FAILED</code>.</li>
<li><strong>Wrap promises.</strong> The constructor and <code>close()</code>/<code>open()</code> are callback-based; promisify them at the boundary so errors surface as rejections.</li>
<li><strong>Test with the mock.</strong> The same error classes work against <code>MockBinding</code>. Use <code>disconnectAfter</code> to assert your reconnect path runs.</li>
</ul>

<div class="callout callout--warn">
<strong>Gotcha</strong>
<code>CancelledError</code> is fired on every pending operation when you <code>close()</code> a port. That's normal — your code should ignore <code>CancelledError</code> in any catch block that could see one mid-shutdown.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/cli"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">CLI tools</span></a>
<a href="/serialpilot/docs/packages"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Package matrix</span></a>
</div>
