---
title: Architecture
description: One Nx workspace, several projects. This page explains who owns what and how a component travels from the library to your application.
---

# Architecture

One Nx workspace, several projects. This page explains who owns what and how a component travels from the library to your application.

Zard UI is an Nx 22 monorepo running Angular 21, TailwindCSS v4 and TypeScript in strict mode. Nx caches every target and derives the dependency graph, so a change in `libs/zard` automatically rebuilds everything that depends on it.

## Projects

Ten top-level pieces. Most contributions touch only one or two of them.

| Path | Project | Role |
| --- | --- | --- |
| `apps/web` | Documentation site | The Angular application you are reading, rendered with SSR and prerendered at build time. |
| `apps/web-e2e` | End-to-end tests | Playwright specs that drive the documentation site, including accessibility checks. |
| `libs/zard` | Component library | The publishable library. Every component, its variants, unit tests, demos and API reference. |
| `libs/blocks` | Block library | Ready-to-paste screens composed from Zard components, each with its own metadata file. |
| `packages/highlight` | Code highlighting | Shiki-based generators plus the components that render code blocks, tabs and expandable snippets. |
| `packages/cli` | zard-cli | The command line tool that installs components into a consumer project from the registry. |
| `packages/mcp` | zard-mcp | An MCP server that exposes components, docs and blocks to AI assistants. |
| `tools/generators` | @zardui/generators | The local Nx plugin providing the component and block generators. |
| `scripts` | Automation scripts | Dev server orchestration, registry build, block sync and commit normalisation. |
| `api` | Edge functions | og.ts renders the dynamic Open Graph images used by the SEO service. |

## How They Connect

The library is written once and consumed through two independent paths.

Distribution path

`libs/zard` → `npm run build:registry` → `apps/web/public/r` → consumed by `zard-cli` and `zard-mcp` → copied into the user's project.

Documentation path

`libs/zard/**/demo` and `doc/api.ts` → `npm run generate:highlight` → `apps/web/src/generated` → rendered by the component page → prerendered → converted to Markdown under `apps/web/public/docs` .

Block path

`libs/blocks` → `npm run sync:blocks` copies the component sources into each `block.ts` → the registry ships them → the `/blocks` page renders the live component next to its code.

i

#### The library never imports the site

Demos and API references live inside `libs/zard` but are only referenced by the documentation app. That is why `doc/api.ts` imports its type through `@doc/*` : the type is a documentation concern, never shipped to consumers.

## Architectural Decisions

These are conventions, not suggestions — new code is reviewed against them.

Standalone components only

There are no NgModules. Components declare their own imports, which keeps lazy chunks small.

Signal inputs

Every public input is an input() signal, and derived state is a computed(). Boolean inputs use the booleanAttribute transform so they work as bare HTML attributes.

OnPush change detection

All components use ChangeDetectionStrategy.OnPush; the ESLint config warns when one does not.

ViewEncapsulation.None

Styling is done with Tailwind utilities on the host element, so encapsulated styles would only get in the way.

CVA + mergeClasses

Variants are declared with class-variance-authority and merged with the consumer class input through mergeClasses(), which wraps clsx and tailwind-merge.

TailwindCSS v4, no config file

Tailwind is configured entirely from apps/web/src/styles.css through @tailwindcss/postcss. There is no tailwind.config.js.

SSR and prerendering

The site is prerendered from apps/web/prerender-routes.txt, which is itself generated from the route constants.

Component anatomy — signals, CVA and mergeClasses

```
@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'button', '[class]': 'classes()' },
  exportAs: 'zButton',
  template: `
    <ng-content />
  `,
})
export class ZardButtonComponent {
  readonly zType = input<ZardButtonTypeVariants>('default');
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(buttonVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );
}
```

## Path Aliases

Aliases are declared per project, not globally. An alias that resolves inside `apps/web` does not necessarily resolve inside `libs/zard` — check the table before importing.

| Alias | Resolves to | Declared in |
| --- | --- | --- |
| `@zard/*` | libs/zard/src/lib/shared/* | apps/web/tsconfig.json |
| `@blocks` | libs/blocks/src/index.ts | apps/web/tsconfig.json |
| `@doc/domain/*` | apps/web/src/app/domain/* | apps/web/tsconfig.json |
| `@doc/shared/*` | apps/web/src/app/shared/* | apps/web/tsconfig.json |
| `@doc/env/*` | apps/web/src/environments/* | apps/web/tsconfig.json |
| `@doc/widget/*` | apps/web/src/app/widget/* | apps/web/tsconfig.json |
| `@highlight/*` | packages/highlight/src/* | apps/web/tsconfig.json · libs/zard/tsconfig.json |
| `@generated/*` | apps/web/src/generated/* | apps/web/tsconfig.json · libs/zard/tsconfig.json |
| `@/*` | libs/zard/src/lib/* | apps/web/tsconfig.json · libs/zard/tsconfig.json |
| `@doc/*` | apps/web/src/app/* | libs/zard/tsconfig.json |
| `@zardui/generators` | tools/generators/component/index.ts | tsconfig.base.json |

apps/web/tsconfig.json

```
{
  "compilerOptions": {
    "paths": {
      "@blocks": ["../../libs/blocks/src/index.ts"],
      "@zard/*": ["../../libs/zard/src/lib/shared/*"],
      "@/*": ["../../libs/zard/src/lib/*"],
      "@doc/domain/*": ["./src/app/domain/*"],
      "@doc/env/*": ["./src/environments/*"],
      "@doc/shared/*": ["./src/app/shared/*"],
      "@doc/widget/*": ["./src/app/widget/*"],
      "@highlight/*": ["../../packages/highlight/src/*"],
      "@generated/*": ["./src/generated/*"]
    }
  }
}
```

libs/zard/tsconfig.json

```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/lib/*"],
      "@generated/*": ["../../apps/web/src/generated/*"],
      "@highlight/*": ["../../packages/highlight/src/*"],
      "@doc/*": ["../../apps/web/src/app/*"]
    }
  }
}
```
