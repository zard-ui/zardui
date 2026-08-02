---
title: Contribute
description: Everything you need to land your first pull request on Zard UI — where each thing lives, which command generates what, and what the CI expects.
---

# Contribute

Everything you need to land your first pull request on Zard UI — where each thing lives, which command generates what, and what the CI expects.

Zard UI is an open source Angular component library built on TailwindCSS v4 and Class Variance Authority, and inspired by shadcn/ui. Everything lives in a single Nx monorepo: the library, the composed blocks, the documentation site you are reading, the CLI and the MCP server.

This module is the navigable version of `CONTRIBUTING.md` . Every command and path on these pages is checked against the repository, so you can copy them without guessing.

## Ways to Contribute

Code is only one of them. Every item below is a valid, welcome pull request.

Components

Add a component to libs/zard, or extend an existing one with a new variant, input or accessibility fix.

Blocks

Compose existing components into a ready-to-paste screen under libs/blocks.

Bug fixes

Pick an open issue, reproduce it in a demo, fix it and cover the behaviour with a test.

Tests

Raise coverage with Jest unit tests or Playwright E2E specs — no new feature required.

Documentation

Improve a docs page, an API reference or the Markdown sources that feed the code blocks.

CLI & MCP

Work on zard-cli or the zard-mcp server under packages/, both published from this monorepo.

## Quick Start

Five steps from a fresh clone to an open pull request. Each one links to the page that covers it in depth.

Quick start

```
# 1. Fork zardui/zardui on GitHub, then clone your fork
git clone https://github.com/<your-username>/zardui.git
cd zardui

# 2. Install dependencies (Node >= 20.19.0)
npm install

# 3. Start the documentation site on http://localhost:4222
npm start
```

1

Set up the repository

Fork, clone, install dependencies and start the documentation site on port 4222.

- [Setup](/docs/contribute/setup)

2

Learn the layout

Understand which project owns what, and where the file you need to touch lives.

- [Architecture](/docs/contribute/architecture)

3

Build something

Scaffold a component or a block with the Nx generators and fill in the real implementation.

- [Components](/docs/contribute/components)

4

Prove it works

Run the unit tests, the linter and the full build before opening a pull request.

- [Testing](/docs/contribute/testing)

5

Ship it

Commit with the mandatory emoji format, open a PR against master and let the CI run.

- [Workflow](/docs/contribute/workflow)

## Guide Map

Every page in this section, in reading order.

- [Setup/docs/contribute/setup](/docs/contribute/setup)
- [Architecture/docs/contribute/architecture](/docs/contribute/architecture)
- [Project Structure/docs/contribute/project-structure](/docs/contribute/project-structure)
- [Components/docs/contribute/components](/docs/contribute/components)
- [Blocks/docs/contribute/blocks](/docs/contribute/blocks)
- [Documentation/docs/contribute/documentation](/docs/contribute/documentation)
- [Testing/docs/contribute/testing](/docs/contribute/testing)
- [Workflow/docs/contribute/workflow](/docs/contribute/workflow)
- [Release/docs/contribute/release](/docs/contribute/release)
- [FAQ/docs/contribute/faq](/docs/contribute/faq)

## Getting Help

Stuck, or unsure whether an idea fits the project? Ask before you build — it saves everyone time.

- [Issues Report a bug or request a feature. Good first issues are labelled.](https://github.com/zard-ui/zardui/issues)
- [Discussions Ask questions, share ideas and discuss proposals before writing code.](https://github.com/zard-ui/zardui/discussions)
- [Email For anything that does not fit a public thread.](mailto:gomesluiz.dev@gmail.com)

i

#### Before opening a pull request

Read the Workflow page. Commits without the leading emoji are rejected by commitlint, and the CI runs lint, build, unit tests and E2E on every pull request.
