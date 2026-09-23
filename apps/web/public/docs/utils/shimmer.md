---
title: Shimmer
description: A sweeping highlight across text, for the seconds where something is being generated.
---

# Shimmer

A sweeping highlight across text, for the seconds where something is being generated.

A spinner tells you the app is busy. A shimmering line tells you *this text* is what you are waiting for. Because `currentColor` is what the effect is built out of, it adapts to whatever colour the element already has — for the common case there is nothing to configure.

## Installation

The utility ships in its own utilities.css, next to the library's global stylesheet in the core registry item. Refresh it and the classes are there.

```
npx zard-cli add core --overwrite
```

`tailwind.css` imports it on its first line, so the classes are available as soon as that stylesheet is imported after Tailwind.

src/styles.css

```
@import 'tailwindcss';
@import './app/shared/core/css/tailwind';
```

## Usage

One class, on the element that holds the text.

```
<p class="shimmer text-muted-foreground">Generating response...</p>
```

Generating response...

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-basic',
  template: `
    <p class="shimmer text-muted-foreground text-base">Generating response...</p>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerBasicComponent {}
```

## How it works

The element gets a `linear-gradient` background clipped to its glyphs — `background-clip: text` plus a transparent `-webkit-text-fill-color` — and the `tw-shimmer` keyframes slide that background across. The gradient's base stop stays at `currentColor` so the text keeps its own colour everywhere the highlight is not.

Dark mode brightens the highlight through a `@variant dark` override, rather than dimming it the way a fixed colour would.

css/utilities.css

```
@utility shimmer {
  --_highlight: var(--shimmer-color, oklch(from currentColor l c h / calc(alpha* 0.2)));

  background-clip: text;
  -webkit-text-fill-color: var(--shimmer-text-fill, transparent);
  animation: tw-shimmer var(--shimmer-duration, 2s) linear infinite;

  @variant dark {
    --_highlight: var(--shimmer-color, oklch(from currentColor max(0.8, calc(l + 0.4)) c h / calc(alpha + 0.4)));
  }
}
```

The defaults are a 2s duration, a `calc(3ch + 40px)` spread and a `20deg` angle.

The gradient relies on `color-mix()` and relative colour syntax. For older browsers, gate the class behind a feature query so the text simply keeps its own colour.

```
<p class="supports-[color:oklch(from_white_l_c_h)]:shimmer text-muted-foreground">Generating response...</p>
```

## Color

shimmer-color-* takes a theme colour or an arbitrary one, and accepts the slash-opacity modifier through color-mix().

```
<p class="shimmer shimmer-color-primary">A theme token</p>
<p class="shimmer shimmer-color-blue-500">An arbitrary colour</p>
<p class="shimmer shimmer-color-blue-500/60">The same colour, dimmed to 60%</p>
```

shimmer-color-blue-500/60 — an arbitrary colour, dimmed

shimmer-color-primary — a theme token from @theme inline

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-color',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-color-blue-500/60 text-muted-foreground text-base">
        shimmer-color-blue-500/60 — an arbitrary colour, dimmed
      </p>
      <p class="shimmer shimmer-color-primary text-muted-foreground text-base">
        shimmer-color-primary — a theme token from &#64;theme inline
      </p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerColorComponent {}
```

## Duration

`shimmer-duration-*` takes **milliseconds** rather than the seconds its `2s` default suggests — `shimmer-duration-1000` is one second. It is the easiest thing here to get wrong.

```
<p class="shimmer shimmer-duration-1000">One second per sweep</p>
<p class="shimmer shimmer-duration-4000">Four seconds per sweep</p>
```

shimmer-duration-1000 — one second

default — two seconds

shimmer-duration-4000 — four seconds

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-duration',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-duration-1000 text-muted-foreground text-base">shimmer-duration-1000 — one second</p>
      <p class="shimmer text-muted-foreground text-base">default — two seconds</p>
      <p class="shimmer shimmer-duration-4000 text-muted-foreground text-base">shimmer-duration-4000 — four seconds</p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerDurationComponent {}
```

## Spread and angle

Spread is how wide the band is; angle is how far it tilts off vertical.

```
<p class="shimmer shimmer-spread-24">A wider band</p>
<p class="shimmer shimmer-spread-[8ch]">An arbitrary width</p>
<p class="shimmer shimmer-angle-45">A steeper tilt</p>
```

shimmer-spread-24 — a wider band

shimmer-angle-45 — a steeper tilt

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-spread-angle',
  template: `
    <div class="flex flex-col items-center gap-4">
      <p class="shimmer shimmer-spread-24 text-muted-foreground text-base">shimmer-spread-24 — a wider band</p>
      <p class="shimmer shimmer-angle-45 text-muted-foreground text-base">shimmer-angle-45 — a steeper tilt</p>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerSpreadAngleComponent {}
```

## Once and direction

`shimmer-once` runs a single sweep — the right shape for the moment a result lands, rather than the wait before it. Under `dir="rtl"` the sweep already follows the reading direction; `shimmer-reverse` overrides that.

```
<p class="shimmer shimmer-duration-1100 shimmer-once">Response generated.</p>
<p class="shimmer shimmer-reverse">Sweeping the other way</p>
```

Response generated.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'z-utils-shimmer-once',
  template: `
    <p class="shimmer shimmer-once shimmer-duration-1100 text-muted-foreground text-base">Response generated.</p>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerOnceComponent {}
```

`shimmer-none` disables the effect and restores normal text rendering, which is what makes it composable with variants.

```
<p class="shimmer md:shimmer-none">Shimmers on small screens only</p>
```

## Composition

The effect is text-only. Applying it to a container clips *that container's* background to its text, and everything inside it looks broken — put the class on the element that holds the words, never on the row that wraps them.

Next to a badge or a spinner is where it earns its place: the chrome says something is running, the shimmer says which line is still being written.

Run 41

Indexing 1,204 files...

Building the dependency graph...

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardSpinnerComponent } from '@zard/components/spinner/spinner.component';

@Component({
  selector: 'z-utils-shimmer-status',
  imports: [ZardBadgeComponent, ZardSpinnerComponent],
  template: `
    <div class="bg-card flex w-full max-w-md flex-col gap-3 rounded-xl border p-4">
      <div class="flex items-center gap-3">
        <z-badge zType="secondary">Run 41</z-badge>
        <!-- The shimmer sits on the text node itself, never on the row that wraps it. -->
        <span class="shimmer text-muted-foreground text-sm">Indexing 1,204 files...</span>
      </div>
      <div class="flex items-center gap-3">
        <z-spinner class="text-muted-foreground" />
        <span class="shimmer shimmer-duration-1400 text-muted-foreground text-sm">
          Building the dependency graph...
        </span>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsShimmerStatusComponent {}
```

## Reduced motion

Under `prefers-reduced-motion: reduce` the animation and the gradient are both switched off and `currentColor` comes back. That is built into the utility — there is nothing to add at the call site, and no configuration that can turn the guarantee off.

## Class reference

| Class | Description |
| --- | --- |
| `shimmer` | Sweeps a highlight across the text; 2s, linear, infinite. |
| `shimmer-once` | A single sweep instead of a loop. |
| `shimmer-reverse` | Reverses the sweep direction. |
| `shimmer-none` | Disables the effect; the text renders in currentColor. |
| `shimmer-color-<color>` | Highlight colour — a theme colour or an arbitrary one; supports the /<opacity> modifier. |
| `shimmer-duration-<number>` | Sweep duration in milliseconds (shimmer-duration-1000 is one second). |
| `shimmer-spread-<number>` | Width of the highlight band, from the spacing scale or an arbitrary length or percentage. |
| `shimmer-angle-<number>` | Tilt of the band, in degrees. |

### Custom properties

| Property | Description | Default |
| --- | --- | --- |
| `--shimmer-color` | Highlight colour. Derived from currentColor, and brighter in dark mode. | `oklch(from currentColor l c h / calc(alpha * 0.2))` |
| `--shimmer-duration` | Sweep duration. | `2s` |
| `--shimmer-spread` | Band width. | `calc(3ch + 40px)` |
| `--shimmer-angle` | Band tilt. | `20deg` |
