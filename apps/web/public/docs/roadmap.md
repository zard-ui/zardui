---
title: Roadmap
description: Zard UI shipped V1.0. See the journey that got us here, and the plan for what comes next.
---

# Roadmap

Zard UI shipped V1.0. See the journey that got us here, and the plan for what comes next.

## V1.0 Shipped

From zero to production ready — 4 major milestones

100%

Complete

Completed

### Alpha - From Zero to Something

100%

Started from scratch, building core patterns inspired by shadcn/ui and ng-zorro

#### Goals

Project structure

Core patterns

15+ components

TailwindCSS v4

#### Deliverables (6/6)

- Nx monorepo with Angular 18+
- Architecture patterns inspired by shadcn/ui
- Core components (Button, Input, Card, etc.)
- TailwindCSS v4 with design tokens
- CVA for type-safe variants
- Basic CLI for component installation

Completed

### Beta - Community & Growth

100%

Focus on growth and community feedback. Users started adopting the library and providing valuable insights

#### Goals

Community growth

30+ components

CLI improvements

Documentation

#### Deliverables (7/7)

- 30+ production-ready components
- Interactive documentation site
- Enhanced CLI for easy installation
- Dark mode with persistence
- Signal-based inputs (Angular 17+)
- components.json configuration
- Community feedback integration

Completed

### Release Candidate - Quality & DX

100%

A registry the CLI installs from without touching GitHub, an MCP server so assistants read the real components, and a test suite behind both

#### Goals

Private registry

Better DX

Accessibility

MCP Server

Testing

#### Deliverables (6/6)

- CLI with private registry (no GitHub fetch)
- Component improvements (DX, accessibility, performance)
- MCP Server for AI integration (Claude, Cursor, VS Code)
- Unit tests with Jest and Testing Library
- E2E testing with Playwright, including a11y checks
- Blocks library (login, signup)

Completed

September 2026

### V1.0 - Production Ready

100%

Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.

#### Goals

Stable release

Component registry

AI integration

Accessibility

#### Deliverables (10/10)

- 55+ components, including Chart (Apache ECharts)
- 10 ready-made blocks
- Public registry with a versioned format and JSON Schemas
- Icon catalog served by the registry, family set in components.json
- zard-mcp published on npm, with 9 tools
- Full-screen CLI with five project types and an icon catalog
- Final test pass (unit and e2e)
- Accessibility review
- Bug validation and fixes
- V1.0.0 finalized and tagged, publishing to npm with this release

## What's Next

V1.0 is out. Here's the plan for what ships after it.

Ongoing

### Keeping V1 Stable

Continuous

The current focus now that V1.0 has shipped: semantic versioning holds, regressions get patched quickly, and the component API, the CLI, and the registry format stay predictable for anyone building on them.

#### Goals

Semantic versioning

Fast regression triage

Patch releases

Growing test coverage

#### Deliverables (3/4)

- Semantic versioning enforced across the library, CLI, and registry
- Public issue triage on GitHub
- Patch releases for confirmed regressions
- Expanding unit and E2E coverage as issues are reported

Completed

October 2026

### RTL Support

100%

Every component reads right to left. Components ship direction-agnostic source (logical classes and CDK Directionality), so one copy serves LTR and RTL and the CLI needs no separate RTL variant.

#### Goals

Direction-aware components

RTL-aware CLI

RTL documentation and demos

#### Deliverables (5/5)

- Audit of every component for physical, direction-dependent styles
- Logical classes, mirrored keyboard navigation and direction-aware overlays across all components
- zard-cli init --rtl sets dir="rtl" and records the rtl flag in components.json
- RTL example on every component page, in English, Arabic and Hebrew
- RTL guide at /docs/rtl

Planned

### zard-cli create - Project-level Theming

0%

A large, CLI-driven customization update that replaces the /themes web customizer: theme, tokens, radius, fonts, typeset, and block presets generated for the project without leaving the terminal. It has not shipped yet.

#### Goals

Project-aware theme generation

Token, radius, and font presets

Typeset and block presets

Supersede the /themes web customizer

#### Deliverables (0/5)

- Interactive theme customization in zard-cli create
- Token, radius, and font presets
- Typeset and block-level presets
- Project-level overrides saved to components.json
- /themes web customizer retired in favor of the CLI flow

Planned

### AI SDK

0%

A dedicated SDK for building AI-driven interfaces with Zard UI components, building on the patterns zard-mcp already established for assistants that read and generate against the real component set.

#### Goals

AI-first component patterns

Streaming-friendly primitives

SDK package and documentation

#### Deliverables (0/4)

- AI SDK API surface designed
- Streaming-friendly component primitives
- SDK package published
- Documentation and examples

Ongoing

### Continuous Documentation and Bug Fixes

Continuous

Documentation keeps pace with the component set, and bug fixes ship as they are found — a standing track rather than a milestone with an end date.

#### Goals

Documentation coverage

Timely bug fixes

Changelog discipline

#### Deliverables (2/3)

- API reference published for every component
- Monthly changelog entries
- Bug fixes released outside the milestone cadence

### Help Shape What's Next

Join our community and help build zard-cli create and the AI SDK.

- [Contribute on GitHub](https://github.com/zard-ui/zardui)
- [Share Feedback](https://github.com/zard-ui/zardui/discussions)
