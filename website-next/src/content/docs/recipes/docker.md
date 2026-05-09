---
title: "Docker"
description: "Containers don't see USB devices unless you let them. Pass the device through with --device, fingerprint with udev rules, and find by VID/PID — paths are not your friend."
order: 6
group: recipes
---

<h2 id="dockerfile">A minimal Dockerfile</h2>
<pre data-lang="dockerfile"><code>FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]</code></pre>
<p>Nothing serial-specific here — the binding compiles itself during <code>npm install</code>. The <code>node:20</code> base already has the C++ toolchain.</p>

<h2 id="run">Run with a device</h2>
<pre data-lang="shell"><code><span class="c-p">$</span> docker run --device /dev/ttyUSB0 \
-e SERIAL_PORT=/dev/ttyUSB0 \
my-app</code></pre>
<p>The <code>--device</code> flag is the magic. Without it, your app sees an empty <code>/dev</code> and <code>SerialPilot.list()</code> returns nothing.</p>

<h2 id="multiple">Multiple devices</h2>
<pre data-lang="shell"><code><span class="c-p">$</span> docker run \
--device /dev/ttyUSB0 \
--device /dev/ttyACM0 \
-e SERIAL_PORT=/dev/ttyUSB0 \
my-app</code></pre>
<p>Repeat the flag for each device. There's no glob form — explicit beats implicit when only some <code>tty*</code> devices belong to your app.</p>

<h2 id="udev">udev rules for stable names</h2>
<p>Linux assigns device paths in plug order, so <code>/dev/ttyUSB0</code> can change between reboots. Pin a stable symlink with udev:</p>
<pre data-lang="shell"><code><span class="c-c"># /etc/udev/rules.d/99-serial.rules</span>
SUBSYSTEM==<span class="c-s">"tty"</span>, ATTRS{idVendor}==<span class="c-s">"2341"</span>, ATTRS{idProduct}==<span class="c-s">"0043"</span>, SYMLINK+=<span class="c-s">"arduino"</span>
SUBSYSTEM==<span class="c-s">"tty"</span>, ATTRS{idVendor}==<span class="c-s">"0403"</span>, ATTRS{idProduct}==<span class="c-s">"6001"</span>, SYMLINK+=<span class="c-s">"ftdi"</span></code></pre>
<p>Reload udev (<code>sudo udevadm control --reload</code> + replug), and your container can now <code>--device /dev/arduino</code>.</p>

<h2 id="findports">Or skip paths entirely</h2>
<p>Inside the container, find by VID/PID:</p>
<pre data-lang="javascript"><code><span class="c-k">const</span> [info] = <span class="c-k">await</span> SerialPilot.<span class="c-t">findPorts</span>({ vendorId: <span class="c-s">'2341'</span> })
<span class="c-k">const</span> port = <span class="c-k">new</span> <span class="c-t">SerialPilot</span>({ path: info.path, baudRate: <span class="c-n">115200</span> })</code></pre>
<p>Pair this with <code>--device-cgroup-rule</code> on the host to permit the container to see <em>any</em> device matching a class — useful when devices come and go.</p>

<h2 id="compose">docker-compose</h2>
<pre data-lang="yaml"><code>services:
app:
build: .
devices:
- <span class="c-s">/dev/ttyUSB0:/dev/ttyUSB0</span>
environment:
SERIAL_PORT: <span class="c-s">/dev/ttyUSB0</span>
restart: unless-stopped</code></pre>

<h2 id="gotchas">Gotchas</h2>
<ul>
<li><strong>Permissions:</strong> if the host has the device owned by <code>dialout</code>, the container's UID needs that GID too. Easiest fix: <code>--group-add dialout</code> on <code>docker run</code>.</li>
<li><strong>Hot-plug:</strong> <code>--device</code> is evaluated at start time — devices added later aren't visible. Restart the container after a replug, or mount the parent device class with cgroup rules.</li>
<li><strong>Multi-arch builds:</strong> if you cross-build for ARM (Raspberry Pi etc), make sure <code>npm install</code> runs <em>inside</em> the target image, not on your build host. The native binding has to match the runtime arch.</li>
</ul>

<div class="callout">
<strong>Don't <code>--privileged</code></strong>
It works, but it grants every device and capability. Stick with explicit <code>--device</code> + <code>--group-add</code> — narrower blast radius and the same outcome.
</div>

<div class="page-foot">
<a href="/serialpilot/docs/recipes/electron"><span class="page-foot__lbl">← Back</span><span class="page-foot__title">Electron</span></a>
<a href="/serialpilot/docs"><span class="page-foot__lbl">All recipes →</span><span class="page-foot__title">Recipe index</span></a>
</div>
