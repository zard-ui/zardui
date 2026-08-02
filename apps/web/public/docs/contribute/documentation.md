---
title: Documentation System
description: Every code block on this site is generated. This page explains from what, by which script, and how to add a page of your own.
---

# Documentation System

Every code block on this site is generated. This page explains from what, by which script, and how to add a page of your own.

Nothing on the documentation site writes raw `<pre>` markup. Code comes from Markdown sources or from the library itself, is highlighted with Shiki at generation time, and is committed as TypeScript under `apps/web/src/generated` . That keeps the runtime free of a highlighter and makes every snippet reviewable in a diff.

## The Six Generators

`npm run generate:highlight` runs `packages/highlight/src/generator/index.ts` , which executes all six writers in parallel and prints how many files each one wrote.

| Generator | Reads | Writes |
| --- | --- | --- |
| `demo-writer` | libs/zard/**/demo/*.ts (except the registry itself) | apps/web/src/generated/components/<name>/demo/*.ts |
| `installation-writer` | Every component folder in libs/zard | apps/web/src/generated/installation/{cli,manual,register}/** |
| `docs-writer` | apps/web/public/documentation/<section>/*.md | apps/web/src/generated/documentation/<section>/*.ts |
| `page-data-writer` | apps/web/public/documentation/<section>/*.md | apps/web/src/generated/pages/<section>/*.ts, exporting BLOCK_n and TABS_n |
| `usage-writer` | The USAGE_DATA record in packages/highlight/src/generator/usage-data.ts | apps/web/src/generated/usage/<name>.ts |
| `snippet-writer` | libs/zard/**/doc/snippets.md | apps/web/src/generated/components/<name>/snippets.ts |

i

#### The watcher runs the same code

`npm start` runs the generator once, then keeps it alive in watch mode next to the dev server, so editing a demo refreshes its code block without a manual step.

## Code Fence Metadata

A fence in `apps/web/public/documentation/` opens with its language followed by any of the attributes below, parsed by `meta-parser.ts` . Supported languages are `typescript` , `javascript` , `html` , `css` , `json` , `bash` , `shell` , `angular-ts` and `angular-html` .

| Attribute | Effect |
| --- | --- |
| `title="app.component.ts"` | Shows a file name header with a language icon. |
| `tab="npm"` | Groups consecutive fences into a single tabbed block (TABS_n). |
| `id="api"` | Names the export in a snippets.md file instead of using its index. |
| `showLineNumbers` | Renders line numbers in the gutter. |
| `copyButton` | Adds the copy-to-clipboard button. |
| `expandable="true"` | Collapses long blocks behind an expand control. |
| `expandableTitle="Expand"` | Sets the label of that control. |
| `{1,3-5}` | Highlights the listed lines and ranges. |

Exports are numbered by order of appearance — `BLOCK_0` , `TABS_0` , `BLOCK_1` — so inserting a fence in the middle of a file renumbers everything after it. Import with an alias to keep the page readable, and rerun the generator after every edit.

apps/web/src/app/domain/pages/dark-mode/dark-mode.page.ts

```
import { BLOCK_0 as HEADER_BLOCK_0, BLOCK_1 as HEADER_BLOCK_1 } from '@generated/pages/dark-mode/header-usage';
import { TABS_0 } from '@generated/pages/dark-mode/service-installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';

export class DarkmodePage {
  readonly serviceInstallationTabs: CodeTabData = TABS_0;
  readonly headerComponentBlock: CodeBlockData = HEADER_BLOCK_0;
  readonly headerTemplateBlock: CodeBlockData = HEADER_BLOCK_1;
}
```

Rendering the generated blocks

```
<z-code-tabs [data]="serviceInstallationTabs" />
<z-code-block [data]="headerComponentBlock" />
```

## Anatomy of a Page

Documentation pages are assembled from a small set of components. Reuse them instead of inventing new markup — the post-build Markdown converter recognises this exact structure.

| Selector | Role |
| --- | --- |
| `z-content` | The page shell: content column plus the right-hand anchor navigation. |
| `z-doc-heading` | The h1, the description and the AI assist toolbar. Owns the #overview anchor. |
| `scrollSpy / scrollSpyItem` | Directives that keep the active anchor in sync while scrolling. |
| `z-callout` | A highlighted note. Variants: info, warning, muted, gradient. |
| `z-steps / z-step` | Numbered installation steps driven by a Step[] array. |
| `z-code-block` | A single highlighted block from CodeBlockData. |
| `z-code-tabs` | A tabbed group from CodeTabData. |
| `z-api-reference` | The API table rendered from an ApiSection[]. |

Skeleton of a documentation page

```
@Component({
  selector: 'z-contribute-faq',
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './faq.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContributeFaqPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'commits', label: 'Commits', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo('FAQ', 'Answers to common issues.', '/docs/contribute/faq', 'og-contribute-faq.jpg');
  }
}
```

Skeleton of the matching template

```
<z-content
  scrollSpy
  [activeAnchor]="activeAnchor"
  [navigationConfig]="navigationConfig"
  (scrollSpyChange)="activeAnchor = $event"
>
  <z-doc-heading title="FAQ" description="Answers to common issues." scrollSpyItem="overview" id="overview" />

  <section class="flex flex-col gap-6" scrollSpyItem="commits" id="commits">
    <h2 class="text-xl font-bold tracking-tight sm:text-2xl">Commits</h2>
  </section>
</z-content>
```

## Post-build Markdown

Every page is also served as raw Markdown at `<path>.md` . That is what the "Copy Page" button copies and what `llms.txt` points AI assistants to. Two scripts produce it:

npm run generate:md

Serialises each component's structured data into `apps/web/public/docs/components/<name>.md` . Runs before the build.

npm run generate:md:docs

Reads the prerendered HTML of every static page and converts the `z-content` subtree to Markdown under `apps/web/public/docs/` . Runs after the build, because it needs the rendered output.

The documentation pipeline

```
# Markdown sources -> apps/web/src/generated/**
npm run generate:highlight

# Everything the CI runs: highlight + component .md + registry + routes + build + page .md
npm run build

# Only the route list (after adding or renaming a route)
node apps/web/update-routes.mjs
```

#### An empty .md means a broken page

The converter walks the `z-content` element and skips chrome such as buttons and navigation. If your page produces an empty file, it strayed from the standard structure — wrap the content in `z-content` and use semantic headings.

## Adding a New Page

Seven steps, in this order. Skipping step 5 or 6 leaves the page reachable by URL but invisible in the navigation and absent from the prerendered output.

1

Write the Markdown sources

Put one .md per page under apps/web/public/documentation/<section>/, with a fenced block per snippet you want to show.

2

Generate the code blocks

Run npm run generate:highlight and note the BLOCK_n / TABS_n exports it produced.

3

Create the page

Add a standalone *.page.ts with an OnPush component, a z- prefixed selector, a NavigationConfig whose first item is overview, and setDocsSeo in ngOnInit.

4

Register the route

Add a lazy loadComponent entry under the docs children in apps/web/src/app/app.routes.ts.

5

Add the sidebar item

Append { name, path, available: true } to the matching NavSection in routes.constant.ts. That one array feeds the sidebar, the mobile menu and the command palette.

6

Refresh the prerender list

Run node apps/web/update-routes.mjs and commit the updated prerender-routes.txt.

7

Build and commit the artifacts

Run npm run build, then commit apps/web/src/generated/** and the new apps/web/public/docs/**.md files it produced.
