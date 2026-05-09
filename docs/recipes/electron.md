# Electron Integration

## Installation

```bash
npm install serialpilot @serialpilot/bindings-cpp
npm install --save-dev electron-rebuild
npx electron-rebuild
```

## Main Process Pattern

Create `SerialPilot` instances in the main process only. Never in the renderer.

```js
// main.js
const { SerialPilot } = require('serialpilot')
const { ipcMain } = require('electron')

ipcMain.handle('list-ports', () => SerialPilot.list())
```

## Preload Bridge

Use `contextBridge.exposeInMainWorld` to safely expose serial port info:

```js
// preload.js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('serialpilot', {
  listPorts: () => ipcRenderer.invoke('list-ports'),
})
```

## Packaging

Native modules must be handled explicitly:

- **electron-builder**: Add `"npmRebuild": true` to your build config
- **electron-forge**: Use `@electron/rebuild` maker plugin

## Troubleshooting

- **V8 version mismatch**: Rebuild native modules for your Electron version
- **ASAR bundling**: Exclude `@serialpilot/bindings-cpp` from ASAR
- **Permission denied on Linux**: Add user to `dialout` group