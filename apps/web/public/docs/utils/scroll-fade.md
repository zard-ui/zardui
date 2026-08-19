---
title: Scroll Fade
description: Fade the edges of a scroll container, in sync with the scroll position.
---

# Scroll Fade

Fade the edges of a scroll container, in sync with the scroll position.

A scroll container that overflows tells you nothing about where you are in it. `scroll-fade` softens the edges that still have content behind them and sharpens the ones that do not, so the container reads as a window onto a longer list. It is a `mask-image` driven by scroll-linked animations — there is no JavaScript and no scroll listener.

## Installation

The utility ships in the library's global stylesheet, which is the core registry item. Refresh it and the classes are there.

```
npx zard-cli add core --overwrite
```

The classes are available as soon as that stylesheet is imported after Tailwind.

src/styles.css

```
@import 'tailwindcss';
@import './app/shared/core/css/tailwind.css';
```

## Usage

The utility only paints a mask — it does not make the container scrollable. Pair it with overflow-y-auto and a height.

```
<div class="scroll-fade h-72 overflow-y-auto">
  <!-- enough content to scroll -->
</div>
```

Activity

Ana Lima opened a pull request

2m

Bruno Reis approved a review

9m

Clara Matos pushed 3 commits

14m

Diego Faria closed an issue

31m

Elisa Nunes left a comment

48m

Felipe Souza merged a branch

1h

Gabriela Pinto published a release

2h

Hugo Castro requested changes

3h

Ines Moreira reopened an issue

5h

Joao Teles added a label

8h

Karina Vieira renamed a branch

11h

Lucas Braga deleted a stale tag

1d

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

interface Activity {
  id: number;
  initials: string;
  name: string;
  action: string;
  time: string;
}

const ACTIVITY: Activity[] = [
  { id: 1, initials: 'AL', name: 'Ana Lima', action: 'opened a pull request', time: '2m' },
  { id: 2, initials: 'BR', name: 'Bruno Reis', action: 'approved a review', time: '9m' },
  { id: 3, initials: 'CM', name: 'Clara Matos', action: 'pushed 3 commits', time: '14m' },
  { id: 4, initials: 'DF', name: 'Diego Faria', action: 'closed an issue', time: '31m' },
  { id: 5, initials: 'EN', name: 'Elisa Nunes', action: 'left a comment', time: '48m' },
  { id: 6, initials: 'FS', name: 'Felipe Souza', action: 'merged a branch', time: '1h' },
  { id: 7, initials: 'GP', name: 'Gabriela Pinto', action: 'published a release', time: '2h' },
  { id: 8, initials: 'HC', name: 'Hugo Castro', action: 'requested changes', time: '3h' },
  { id: 9, initials: 'IM', name: 'Ines Moreira', action: 'reopened an issue', time: '5h' },
  { id: 10, initials: 'JT', name: 'Joao Teles', action: 'added a label', time: '8h' },
  { id: 11, initials: 'KV', name: 'Karina Vieira', action: 'renamed a branch', time: '11h' },
  { id: 12, initials: 'LB', name: 'Lucas Braga', action: 'deleted a stale tag', time: '1d' },
];

@Component({
  selector: 'z-utils-scroll-fade-basic',
  imports: [ZardAvatarComponent, ZardSeparatorComponent],
  template: `
    <div class="bg-card w-full max-w-sm rounded-xl border">
      <p class="border-b px-4 py-3 text-sm font-medium">Activity</p>

      <!-- scroll-fade only paints the mask; overflow-y-auto is what makes the list scroll. -->
      <div class="scroll-fade h-72 overflow-y-auto px-4">
        @for (item of activity; track item.id; let last = $last) {
          <div class="flex items-center gap-3 py-3">
            <z-avatar zSize="sm" [zFallback]="item.initials" />
            <p class="min-w-0 flex-1 truncate text-sm">
              <span class="font-medium">{{ item.name }}</span>
              {{ item.action }}
            </p>
            <span class="text-muted-foreground shrink-0 text-xs">{{ item.time }}</span>
          </div>
          @if (!last) {
            <z-separator />
          }
        }
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeBasicComponent {
  protected readonly activity = ACTIVITY;
}
```

`scroll-fade-x` is the horizontal pair. Same rule: it needs `overflow-x-auto` and content wide enough to overflow.

Scroll-driven masks and a smaller runtime.

Focus ring fixes across every overlay.

Signal forms land on every field component.

Dark mode contrast pass on the code blocks.

New chart primitives and a themed tooltip.

Registry v2, with per-item dependency graphs.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';

interface Release {
  version: string;
  date: string;
  summary: string;
}

const RELEASES: Release[] = [
  { version: 'v1.4.0', date: 'Aug 12', summary: 'Scroll-driven masks and a smaller runtime.' },
  { version: 'v1.3.2', date: 'Jul 28', summary: 'Focus ring fixes across every overlay.' },
  { version: 'v1.3.0', date: 'Jul 04', summary: 'Signal forms land on every field component.' },
  { version: 'v1.2.1', date: 'Jun 19', summary: 'Dark mode contrast pass on the code blocks.' },
  { version: 'v1.2.0', date: 'Jun 02', summary: 'New chart primitives and a themed tooltip.' },
  { version: 'v1.1.0', date: 'May 21', summary: 'Registry v2, with per-item dependency graphs.' },
];

@Component({
  selector: 'z-utils-scroll-fade-horizontal',
  imports: [ZardCardImports],
  template: `
    <!-- scroll-fade-x tracks the inline axis, so it needs overflow-x-auto to have something to track. -->
    <div class="scroll-fade-x flex w-full max-w-xl gap-4 overflow-x-auto pb-2">
      @for (release of releases; track release.version) {
        <z-card class="w-56 shrink-0">
          <z-card-header>
            <z-card-title>{{ release.version }}</z-card-title>
            <z-card-description>{{ release.date }}</z-card-description>
          </z-card-header>
          <z-card-content>
            <p class="text-muted-foreground text-sm">{{ release.summary }}</p>
          </z-card-content>
        </z-card>
      }
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeHorizontalComponent {
  protected readonly releases = RELEASES;
}
```

## How it works

The element gets a `mask-image` linear gradient whose stops are custom properties, and those properties are animated by `animation-timeline: scroll(self y)` — a scroll-driven animation, so the browser advances it from the container's own scroll position.

That makes the effect scroll-aware rather than decorative:

- At rest, the leading edge is sharp and the trailing edge is faded.
- Mid-scroll, both edges fade — there is content in both directions.
- At the end, the trailing edge sharpens again.

The default fade depth is `min(12%, calc(var(--spacing) * 10))` — 12% of the container, capped at 40px — and the default reveal distance, how far you scroll before an edge is fully faded, is `calc(var(--spacing) * 24)` , or 96px.

## Edges

scroll-fade and scroll-fade-y are the same utility. The rest fade a single edge.

```
<div class="scroll-fade-y h-72 overflow-y-auto">Top and bottom</div>
<div class="scroll-fade-x overflow-x-auto">Inline start and end</div>
<div class="scroll-fade-t h-72 overflow-y-auto">Top only</div>
<div class="scroll-fade-b h-72 overflow-y-auto">Bottom only</div>
<div class="scroll-fade-l overflow-x-auto">Left only</div>
<div class="scroll-fade-r overflow-x-auto">Right only</div>
<div class="scroll-fade-s overflow-x-auto">Inline start only</div>
<div class="scroll-fade-e overflow-x-auto">Inline end only</div>
```

`-l` and `-r` are physical and always mean left and right. `-s` and `-e` are logical: they follow the reading direction, so they swap under `dir="rtl"` .

scroll-fade-t

Resolving dependencies

Fetching registry index

Downloading core

Writing css/tailwind.css

Writing utils/merge-classes.ts

Linking peer dependencies

Patching components.json

Formatting written files

Verifying the install

Done in 4.21s

scroll-fade-b

Resolving dependencies

Fetching registry index

Downloading core

Writing css/tailwind.css

Writing utils/merge-classes.ts

Linking peer dependencies

Patching components.json

Formatting written files

Verifying the install

Done in 4.21s

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

const LINES = [
  'Resolving dependencies',
  'Fetching registry index',
  'Downloading core',
  'Writing css/tailwind.css',
  'Writing utils/merge-classes.ts',
  'Linking peer dependencies',
  'Patching components.json',
  'Formatting written files',
  'Verifying the install',
  'Done in 4.21s',
];

@Component({
  selector: 'z-utils-scroll-fade-edges',
  template: `
    <div class="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-t</p>
        <div class="bg-card scroll-fade-t h-56 overflow-y-auto rounded-lg border p-4">
          @for (line of lines; track line) {
            <p class="py-1.5 text-sm">{{ line }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-b</p>
        <div class="bg-card scroll-fade-b h-56 overflow-y-auto rounded-lg border p-4">
          @for (line of lines; track line) {
            <p class="py-1.5 text-sm">{{ line }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeEdgesComponent {
  protected readonly lines = LINES;
}
```

## Size

The sizing classes carry a value, not a mask — keep the mask utility next to them.

```
<div class="scroll-fade scroll-fade-4 h-72 overflow-y-auto">1rem</div>
<div class="scroll-fade scroll-fade-12 h-72 overflow-y-auto">3rem</div>
<div class="scroll-fade scroll-fade-[15%] h-72 overflow-y-auto">15% of the container</div>
<div class="scroll-fade scroll-fade-t-4 scroll-fade-b-16 h-72 overflow-y-auto">One depth per edge</div>
```

scroll-fade-4

Berlin

Bogota

Cairo

Dublin

Helsinki

Kyoto

Lisbon

Nairobi

Oslo

Quito

scroll-fade-12

Berlin

Bogota

Cairo

Dublin

Helsinki

Kyoto

Lisbon

Nairobi

Oslo

Quito

scroll-fade-[15%]

Berlin

Bogota

Cairo

Dublin

Helsinki

Kyoto

Lisbon

Nairobi

Oslo

Quito

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

const ROWS = ['Berlin', 'Bogota', 'Cairo', 'Dublin', 'Helsinki', 'Kyoto', 'Lisbon', 'Nairobi', 'Oslo', 'Quito'];

@Component({
  selector: 'z-utils-scroll-fade-size',
  template: `
    <div class="grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-4</p>
        <div class="bg-card scroll-fade scroll-fade-4 h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-12</p>
        <div class="bg-card scroll-fade scroll-fade-12 h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">scroll-fade-[15%]</p>
        <div class="bg-card scroll-fade scroll-fade-[15%] h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeSizeComponent {
  protected readonly rows = ROWS;
}
```

The per-edge classes size one edge and leave the others on the shared default, which is how you get an asymmetric fade out of a single container.

scroll-fade scroll-fade-t-4 scroll-fade-b-16

feat(button): add a loading state

fix(select): keep the popover width in sync

docs(cli): document the --overwrite flag

refactor(card): drop the redundant wrapper

fix(dialog): restore focus on close

feat(table): sortable column headers

chore(deps): bump angular to 21.1

fix(tabs): announce the active tab

feat(chart): themed tooltip content

test(input): cover the disabled path

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

const CHANGES = [
  'feat(button): add a loading state',
  'fix(select): keep the popover width in sync',
  'docs(cli): document the --overwrite flag',
  'refactor(card): drop the redundant wrapper',
  'fix(dialog): restore focus on close',
  'feat(table): sortable column headers',
  'chore(deps): bump angular to 21.1',
  'fix(tabs): announce the active tab',
  'feat(chart): themed tooltip content',
  'test(input): cover the disabled path',
];

@Component({
  selector: 'z-utils-scroll-fade-per-edge',
  template: `
    <div class="flex w-full max-w-md flex-col gap-2">
      <p class="text-muted-foreground font-mono text-xs">scroll-fade scroll-fade-t-4 scroll-fade-b-16</p>
      <!-- A shallow fade at the top, a deep one at the bottom — one class per edge. -->
      <div class="bg-card scroll-fade scroll-fade-t-4 scroll-fade-b-16 h-72 overflow-y-auto rounded-lg border px-4">
        @for (change of changes; track change) {
          <p class="border-b py-3 font-mono text-xs last:border-0">{{ change }}</p>
        }
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadePerEdgeComponent {
  protected readonly changes = CHANGES;
}
```

Every class writes one of these custom properties, so a stylesheet can set them directly instead.

src/styles.css

```
.timeline {
  /* Every edge. */
  --scroll-fade-size: 2rem;
  /* One edge, falling back to --scroll-fade-size. */
  --scroll-fade-t-size: 0.5rem;
  --scroll-fade-b-size: 4rem;
}
```

## Reveal

How far you scroll before an edge reaches its full depth. Shorter feels snappier; longer feels like the list is drifting into view.

```
<div class="scroll-fade h-72 overflow-y-auto [--scroll-fade-reveal:64px]">
  <!-- reaches full fade after 64px of scrolling -->
</div>
```

default — 96px

Attach a payment method

Confirm the billing address

Choose an invoice cadence

Set a spending alert

Invite a billing contact

Review the tax settings

Enable receipts by email

Download the last statement

Close the account

[--scroll-fade-reveal:32px]

Attach a payment method

Confirm the billing address

Choose an invoice cadence

Set a spending alert

Invite a billing contact

Review the tax settings

Enable receipts by email

Download the last statement

Close the account

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

const ROWS = [
  'Attach a payment method',
  'Confirm the billing address',
  'Choose an invoice cadence',
  'Set a spending alert',
  'Invite a billing contact',
  'Review the tax settings',
  'Enable receipts by email',
  'Download the last statement',
  'Close the account',
];

@Component({
  selector: 'z-utils-scroll-fade-reveal',
  template: `
    <div class="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">default — 96px</p>
        <div class="bg-card scroll-fade h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">[--scroll-fade-reveal:32px]</p>
        <div class="bg-card scroll-fade h-56 overflow-y-auto rounded-lg border px-4 [--scroll-fade-reveal:32px]">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeRevealComponent {
  protected readonly rows = ROWS;
}
```

## RTL

The inline utilities read the direction from the document, so one class covers both scripts.

```
<div dir="rtl">
  <div class="scroll-fade-x overflow-x-auto">Mirrors: the fade follows the reading direction</div>
  <div class="scroll-fade-s overflow-x-auto">Fades the right edge under RTL</div>
</div>
```

`scroll-fade-x` , `scroll-fade-s` and `scroll-fade-e` mirror. Reach for `scroll-fade-l` or `scroll-fade-r` only when you mean the physical side regardless of direction.

## Browser support

The scroll-aware behaviour needs scroll-driven animations. Where they are missing, the `@supports not` branch pins both edges to their full size: you get a static double fade instead of a scroll-aware one. It is a plain fallback, not a polyfill — the fade no longer tracks the scroll position, and the leading edge stays faded at rest.

css/tailwind.css

```
@supports not (animation-timeline: scroll()) {
  --scroll-fade-t: var(--_scroll-fade-size-t);
  --scroll-fade-b: var(--_scroll-fade-size-b);
}
```

## Class reference

| Class | Description |
| --- | --- |
| `scroll-fade` | Fades both vertical edges, tracking vertical scroll. |
| `scroll-fade-y` | Identical to scroll-fade; the explicit axis form. |
| `scroll-fade-x` | Fades both inline edges, tracking horizontal scroll. Mirrors under RTL. |
| `scroll-fade-t` | Top edge only. |
| `scroll-fade-b` | Bottom edge only. |
| `scroll-fade-l` | Left edge only (physical — does not mirror). |
| `scroll-fade-r` | Right edge only (physical — does not mirror). |
| `scroll-fade-s` | Inline start edge — left in LTR, right in RTL. |
| `scroll-fade-e` | Inline end edge — right in LTR, left in RTL. |
| `scroll-fade-<number>` | Fade depth from the spacing scale (scroll-fade-4 is 1rem). |
| `scroll-fade-[<value>]` | Arbitrary fade depth: any length or percentage. |
| `scroll-fade-t-<number>` | Top-edge depth only. Also accepts an arbitrary value. |
| `scroll-fade-b-<number>` | Bottom-edge depth only. Also accepts an arbitrary value. |
| `scroll-fade-s-<number>` | Inline-start depth only. Also accepts an arbitrary value. |
| `scroll-fade-e-<number>` | Inline-end depth only. Also accepts an arbitrary value. |
| `scroll-fade-none` | Disables the mask. Useful with variants, e.g. md:scroll-fade-none. |

### Custom properties

| Property | Description | Default |
| --- | --- | --- |
| `--scroll-fade-size` | Fade depth for every edge — 12% of the container, capped at 40px. | `min(12%, calc(var(--spacing) * 10))` |
| `--scroll-fade-t-size` | Top-edge depth. | `--scroll-fade-size` |
| `--scroll-fade-b-size` | Bottom-edge depth. | `--scroll-fade-size` |
| `--scroll-fade-s-size` | Inline-start depth. | `--scroll-fade-size` |
| `--scroll-fade-e-size` | Inline-end depth. | `--scroll-fade-size` |
| `--scroll-fade-reveal` | How far you scroll before an edge is fully faded — 96px. | `calc(var(--spacing) * 24)` |
