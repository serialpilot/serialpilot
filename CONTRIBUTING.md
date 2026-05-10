# Contribute to SerialPilot!

Do you want to help out but don't know where to start?

## Guideline Contents

There are a lot of ways to get involved and help out:

- [Contribute to SerialPilot!](#contribute-to-serialpilot)
  - [Guideline Contents](#guideline-contents)
  - [Reporting An Issue](#reporting-an-issue)
  - [Requesting Features](#requesting-features)
  - [Submitting Pull Requests](#submitting-pull-requests)
  - [Writing Tests](#writing-tests)
  - [Writing Documentation](#writing-documentation)
  - [Releasing](#releasing)

## Reporting An Issue

SerialPilot does its [issue tracking](https://github.com/serialpilot/serialpilot/issues) through GitHub. To report an issue first search the repo to make sure that it has not been reported before. If no one has reported the bug before, create a new issue and be sure to follow the issue template.

## Requesting Features

To request a new feature be added create a [github issue](https://github.com/serialpilot/serialpilot/issues) and include:

### What feature you'd like to see

### Why this is important to you

## Submitting Pull Requests

To contribute code to SerialPilot, fork the project onto your github account and do your work in a branch. Before you submit the PR, make sure to rebase main into your branch so that you have the most recent changes and nothing breaks or conflicts. Lint and test your code using `npm run lint` and `npm run test`.

All contributions must adhere to the eslint rules by maintaining the existing coding style.

If you are contributing code, it must include unit tests that fail if the working code isn't present and succeed when it is.

When contributing new features you must include documentation.

It's very important that your pull requests include all of the above in order for users to be able to use your code. Pull requests with undocumented code will not be accepted.

If your change should appear in the public CHANGELOG, run `npm run changeset` and commit the generated markdown file alongside your PR. See [`.changeset/README.md`](.changeset/README.md) for details.

## Writing Tests

Tests are written using [mocha](https://mochajs.org/), [chai](http://chaijs.com/) and [sinon](http://sinonjs.org/). If you are having issues making a test pass, ask for help in the SerialPilot [discussions list](https://github.com/serialpilot/serialpilot/discussions) or on your PR.

## Writing Documentation

We are always looking to improve our docs. If you find that any are lacking information or have wrong information, fix and submit a PR.

## Releasing

SerialPilot uses [Changesets](https://github.com/changesets/changesets) plus GitHub Actions OIDC trusted publishing — there are no npm tokens stored in CI.

**As a contributor:** after you make a change that affects a published package, run

```sh
npm run changeset
```

and follow the prompts to pick the affected packages and the bump type (`patch` / `minor` / `major`). Commit the generated `.changeset/*.md` file alongside your code. Docs-only or test-only PRs don't need a changeset.

**As a maintainer:** the [`Release` workflow](.github/workflows/release.yml) runs on every push to `main`:

- If unreleased changesets exist, the workflow opens (or updates) a "**chore(release): version packages**" PR that consumes them, bumps versions, and regenerates `CHANGELOG.md` for each affected package.
- When that PR is merged, the same workflow runs `npm run release` (= `changeset publish`), which publishes every package whose version is ahead of the npm registry. Authentication is handled via OIDC — no token required.

To release manually from your machine (only needed for the very first publish or to recover from a failed CI publish):

```sh
git checkout main && git pull
npm ci
npm run build
npx changeset publish
```
