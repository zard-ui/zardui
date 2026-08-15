---
title: Setup
description: Get the monorepo running locally in a few minutes, and learn which command does what.
---

# Setup

Get the monorepo running locally in a few minutes, and learn which command does what.

Zard UI is a single Nx workspace. One `npm install` at the root installs everything — the library, the documentation site, the CLI and the MCP server.

## Requirements

The `engines` field in `package.json` requires Node 20.19.0 or newer. The CI runs Node 24, so anything in between works.

Check your toolchain

```
node --version   # must be >= 20.19.0
npm --version
git --version
```

## Fork & Install

Contributions come from forks. Fork `zard-ui/zardui` on GitHub, then clone your copy and install the dependencies with npm — the repository ships a `package-lock.json` , so npm is the supported package manager.

Fork, clone and install

```
git clone https://github.com/<your-username>/zardui.git
cd zardui
npm install
```

## Development Server

`npm start` runs `scripts/dev.mjs` , which does three things: it pre-builds every highlighted code block, then runs two processes side by side — the highlight generator in watch mode and `nx run web:serve --configuration=local` .

Start the docs site

```
npm start
```

The site listens on `http://localhost:4222` . To change the port, copy `.env.example` to `.env` — the start script loads it automatically.

.env

```
PORT=4222
```

## Git Hooks

Husky installs itself through the `prepare` script, so the hooks are active right after `npm install` . Two hooks run on every commit.

pre-commit

Runs `lint-staged` : ESLint with `--fix` followed by Prettier on staged `.ts` files, and Prettier on staged `.html` files.

commit-msg

Runs commitlint against the message. A commit without the leading emoji is rejected — see the Workflow page for the full table.

#### Never bypass the hooks

Do not commit with `--no-verify` . The same checks run again in the CI, so bypassing them locally only moves the failure later.

## Essential Commands

Every command below is defined in the root `package.json` .

### Development

| Command | What it does |
| --- | --- |
| `npm start` | Pre-builds the code blocks, then serves the docs site on port 4222. |
| `npm run build` | The full production pipeline — exactly what the CI runs on every pull request. |
| `npm run serve:ssr` | Serves the built SSR server from dist/apps/web. |

### Generation

| Command | What it does |
| --- | --- |
| `npm run generate:component` | Scaffolds a new component in libs/zard. |
| `npm run generate:block` | Scaffolds a new block in libs/blocks. |
| `npm run generate:highlight` | Regenerates every highlighted code block under apps/web/src/generated/. |
| `npm run generate:md` | Writes the per-component Markdown into apps/web/public/docs/. |
| `npm run generate:md:docs` | Converts the prerendered pages to Markdown. Runs after the build. |
| `npm run sync:blocks` | Rewrites the files[] array of every block from its sources. |
| `npm run build:registry` | Builds the registry served to the CLI and the MCP server. |

### Quality

| Command | What it does |
| --- | --- |
| `npm test` | Runs the Jest suites of every project under libs/. |
| `npm run test:watch` | Same, in watch mode. |
| `npm run e2e` | Runs the Playwright suite, booting the local dev server automatically. |
| `npm run e2e:ui` | Opens the interactive Playwright UI. |
| `npx nx run-many --target=lint --p=zard,blocks` | The lint job the CI runs. |

## Troubleshooting

The four failures newcomers hit most often, and the command that fixes each.

Troubleshooting

```
# Port already taken — pick another one
PORT=4300 npm start

# Stale Nx cache or an unexplained build failure
npx nx reset

# Broken dependency tree
rm -rf node_modules package-lock.json
npm install

# Code blocks look empty or outdated
npm run generate:highlight
```
