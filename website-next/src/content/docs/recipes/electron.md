---
title: "Electron"
description: "Native modules and Electron get along just fine — provided you put them in the right process and rebuild against Electron's V8. Two rules and three gotchas."
order: 5
group: recipes
---

<h2 id="install">Install &amp; rebuild</h2>
<pre data-lang="shell"><code><span class="c-p">$</span> npm install serialpilot @serialpilot/bindings-cpp
<span class="c-p">$</span> npm install --save-dev electron-rebuild
<span class="c-p">$</span> npx electron-rebuild</code></pre>
<p><code>electron-rebuild</code> compiles the native binding against the V8 ABI shipped with your installed Electron version. Run it after every Electron upgrade.</p>

<h2 id="main">Rule #1 — main process only</h2>
<p>Create <code>SerialPilot</code> instances in the main process. Don't reach for them from a renderer; you'll fight context isolation and lose.</p>
<pre data-lang="javascript"><code><span class="c-c">// main.js</span>
<span class="c-k">const</span> { SerialPilot } = <span class="c-t">require</span>(<span class="c-s">'serialpilot'</span>)
<span class="c-k">const</span> { ipcMain } = <span class="c-t">require</span>(<span class="c-s">'electron'</span>)

ipcMain.<span class="c-t">handle</span>(<span class="c-s">'list-ports'</span>, () =&gt; SerialPilot.<span class="c-t">list</span>())</code></pre>

<h2 id="bridge">Rule #2 — bridge through contextBridge</h2>
<p>Expose a small, audited surface to the renderer with <code>contextBridge</code>. Never set <code>nodeIntegration: true</code>:</p>
<pre data-lang="javascript"><code><span class="c-c">// preload.js</span>
<span class="c-k">const</span> { contextBridge, ipcRenderer } = <span class="c-t">require</span>(<span class="c-s">'electron'</span>)

contextBridge.<span class="c-t">exposeInMainWorld</span>(<span class="c-s">'serialpilot'</span>, {
listPorts: () =&gt; ipcRenderer.<span class="c-t">invoke</span>(<span class="c-s">'list-ports'</span>),
open:      (opts) =&gt; ipcRenderer.<span class="c-t">invoke</span>(<span class="c-s">'open-port'</span>, opts),
write:     (id, data) =&gt; ipcRenderer.<span class="c-t">invoke</span>(<span class="c-s">'port-write'</span>, id, data),
})</code></pre>

<h2 id="packaging">Packaging gotchas</h2>
<table>
<thead><tr><th>Tool</th><th>What to do</th></tr></thead>
<tbody>
<tr><td><code>electron-builder</code></td><td>Set <code>"npmRebuild": true</code> in <code>build</code>; it rebuilds natives for the target Electron during the packaging step.</td></tr>
<tr><td><code>electron-forge</code></td><td>Add <code>@electron/rebuild</code> as a maker plugin so each build picks up native changes.</td></tr>
</tbody>
</table>
<ul>
<li><strong>ASAR:</strong> exclude <code>@serialpilot/bindings-cpp</code> from the asar bundle (Node can't <code>require()</code> a <code>.node</code> file from inside an asar archive).</li>
<li><strong>Signing on macOS:</strong> the <code>.node</code> binary needs the <code>com.apple.security.cs.allow-jit</code> entitlement — most Electron projects already include this.</li>
<li><strong>Linux distribution:</strong> remind users to add themselves to <code>dialout</code> at first run, or your app gets <code>PermissionDeniedError</code> the moment it tries to open a port.</li>
</ul>

<h2 id="troubleshooting">Troubleshooting</h2>
<table>
<thead><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>"NODE_MODULE_VERSION mismatch"</td><td>Built for Node, not Electron's V8</td><td><code>npx electron-rebuild</code></td></tr>
<tr><td>App boots, but <code>list()</code> returns nothing</td><td>Sandbox blocks the binding</td><td>Disable sandbox for the main process or whitelist USB devices</td></tr>
<tr><td>Native module missing in packaged app</td><td>asar swallowed it</td><td>Add to <code>asarUnpack</code> in builder config</td></tr>
</tbody>
</table>

<div class="page-foot">
<a href="/serialpilot/docs/recipes/error-handling"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Error handling</span></a>
<a href="/serialpilot/docs/recipes/docker"><span class="page-foot__lbl">Next →</span><span class="page-foot__title">Docker</span></a>
</div>
