# Changesets

This directory holds [Changesets](https://github.com/changesets/changesets) — short markdown files that describe a change and the version bump it warrants. They drive `npm run version` (which updates `package.json` versions and CHANGELOGs) and `npm run release` (which publishes to npm).

## Adding a changeset

```bash
npm run changeset
```

The CLI walks you through which packages changed and at what semver level, then writes a markdown file here. Commit it with your PR.

## Releasing

1. Merge accumulated changesets to `main`.
2. Run `npm run version` — this consumes the changesets, bumps versions, updates CHANGELOGs, and stages the result.
3. Commit and tag.
4. Run `npm run release` — publishes every package whose version moved.

The `serialpilot` and `@serialpilot/*` packages are linked, meaning they always share a version number. Internal dependencies between linked packages get patch-bumped automatically.

> The legacy `lerna publish` workflow still works for emergency releases but Changesets is the supported path.
