<p align="center">
  <a href="https://github.com/serialpilot/serialpilot">
    <img src="https://raw.githubusercontent.com/serialpilot/serialpilot/main/assets/serialpilot-logo.png" width="120" height="120" alt="SerialPilot">
  </a>
</p>

# `@serialpilot/serialpilot`

Scoped alias for the [SerialPilot](https://github.com/serialpilot/serialpilot) umbrella package. This package re-exports everything from the unscoped [`serialpilot`](https://www.npmjs.com/package/serialpilot) — the two are interchangeable.

## Why two names?

- `serialpilot` (unscoped) is the canonical install for end users — short, easy to type, matches the import.
- `@serialpilot/serialpilot` (this package) lives under the [`@serialpilot` npm org](https://www.npmjs.com/org/serialpilot) alongside its sibling packages, so the org's package listing is complete.

Pick whichever fits your import style. They share the same major version line.

## Install

```sh
npm install @serialpilot/serialpilot
# or
npm install serialpilot
```

## Usage

Identical to the unscoped package:

```ts
import { SerialPilot, ReadlineParser } from '@serialpilot/serialpilot'

const port = new SerialPilot({ path: '/dev/ttyUSB0', baudRate: 115200 })
const lines = port.pipe(new ReadlineParser({ delimiter: '\n' }))
lines.on('data', line => console.log(line))
```

See the [main README](https://github.com/serialpilot/serialpilot#readme) for the full API, recipes, and parser list.

## License

[MIT](https://github.com/serialpilot/serialpilot/blob/main/LICENSE)
