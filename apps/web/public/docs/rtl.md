---
title: RTL
description: Right-to-left support for ZardUI components.
---

# RTL

Right-to-left support for ZardUI components.

ZardUI components have first-class support for right-to-left (RTL) layouts. Text alignment, positioning and directional styles adapt for languages like Arabic, Hebrew and Persian, and so do the overlays they open.

مرحبا بعودتك

يتبع النص والمسافات والأيقونات اتجاه القراءة.

غيّر اللغة من الأعلى لترى البطاقة تنعكس دون أي شيفرة إضافية.

Pick a language in the preview above: the card is the same component in every language, only the text and the direction change. Every component page also has an `RTL` example you can switch the same way.

## Get started

RTL is a matter of setting the direction of the document, or of the part of the page that needs it. There is no provider to wrap your app in.

## Set the direction on the document

Add dir="rtl" and the language of your content to the html tag. Update lang="ar" to your target language. Every component and every overlay it opens reads the direction from there.

```bash
src/index.html
```

```
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>My App</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

## Or scope a subtree

Mixed-direction page? Import the CDK Dir directive and put dir on any element. Components inside, and the overlays they open, take that direction instead of the document one.

```bash
src/app/arabic-section.component.ts
```

```
import { Dir } from '@angular/cdk/bidi';
import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'app-arabic-section',
  imports: [Dir, ZardPopoverImports, ZardButtonComponent],
  template: `
    <section dir="rtl" lang="ar">
      <button z-button zPopover [zContent]="content">فتح</button>

      <ng-template #content>
        <z-popover>مرحبا بالعالم</z-popover>
      </ng-template>
    </section>
  `,
})
export class ArabicSectionComponent {}
```

## Let the CLI do it

zard-cli init asks whether your app reads right to left, and --rtl / --no-rtl answer the question up front. Nothing is inferred from your project: the answer is yours.

```bash
Terminal
```

```
# The project reads right to left
npx zard-cli@latest init --rtl

# The project reads left to right (the default)
npx zard-cli@latest init --no-rtl
```

## The choice is recorded

With RTL on, init writes "rtl": true to components.json and sets dir="rtl" on the html tag of your index.html. The component files you install are identical either way.

```bash
components.json
```

```
{
  "$schema": "https://zardui.com/schema.json",
  "style": "default",
  "rtl": true
}
```

**No zard wrapper for direction.** Components read the direction through the CDK `Directionality` service, which is already a peer dependency, and the CDK `Dir` directive is the way to change it for a subtree. A zard-specific provider would only duplicate it. See [the CLI page](/docs/cli) and [components.json](/docs/components-json) for the rest of the init options.

## How it works

The components are direction-agnostic: the files you install are the same in LTR and RTL projects, and nothing is rewritten when you add them. Three things make that work.

### Logical classes

Component styles use TailwindCSS logical utilities instead of physical ones: `ms-*` / `me-*` , `ps-*` / `pe-*` , `start-*` / `end-*` , `text-start` , `border-s` and `rounded-s` . Utilities that have no logical form get an `rtl:` pair, and icons that point along the reading direction use `rtl:rotate-180` . Use the same classes in your own markup.

Physical (does not mirror)

```
<div class="ml-4 pr-2 text-left border-l rounded-l-md left-0"></div>
```

Logical (works in both directions)

```
<div class="ms-4 pe-2 text-start border-s rounded-s-md start-0"></div>
```

### The CDK Directionality

Whatever CSS cannot express is decided in code: arrow keys that move inline, slider and carousel math, positions computed in JavaScript. Those components inject `Directionality` and read its `value` , or its `valueSignal()` inside computed values so they follow a direction switch.

src/app/my-overlay.directive.ts

```
import { Directionality } from '@angular/cdk/bidi';
import { Directive, inject } from '@angular/core';

@Directive({ selector: '[appMyOverlay]' })
export class MyOverlayDirective {
  private readonly directionality = inject(Directionality, { optional: true });

  open(): void {
    const direction = this.directionality?.value ?? 'ltr';
    // overlay.create({ positionStrategy, direction, ... })
  }
}
```

### Overlays inherit from their trigger

Popovers, tooltips, dropdown menus, selects, dialogs and sheets render in a portal outside your `dir` subtree. They take the direction of the trigger, or of the caller that opened them, and set it on the overlay itself, so an Arabic section on an English page opens Arabic menus. Inline placements such as `inline-start` and `inline-end` mirror with the direction; physical ones like `left` and `right` keep their meaning.

### Why there is no install-time transform

Some libraries rewrite physical classes into logical ones while installing components for an RTL project. ZardUI ships the logical version to everybody, so the CLI has nothing to transform and switching direction later is a change to one attribute, not a re-install.

## Font recommendations

For the best RTL experience, use a font with proper support for your language. [Noto](https://fonts.google.com/noto) is a good family for it and pairs well with Inter and Geist. This site loads `@fontsource-variable/noto-sans-arabic` and `@fontsource-variable/noto-sans-hebrew` for the RTL previews.

## Install the font

Use Fontsource. For Hebrew, install @fontsource-variable/noto-sans-hebrew instead.

```
npm install @fontsource-variable/noto-sans-arabic
```

## Import it and set --font-sans

Import the font in your global stylesheet and point the Tailwind font token at it.

```bash
src/styles.css
```

```
@import 'tailwindcss';
@import '@fontsource-variable/noto-sans-arabic';

@theme inline {
  --font-sans: 'Noto Sans Arabic Variable', sans-serif;
}
```

## Animations

Enter and exit animations of overlays slide away from their trigger, so the physical slide classes were replaced by logical ones, for example `slide-in-from-right` became `slide-in-from-end` . Where the animation utilities have no logical form, an `rtl:` pair covers the other direction. Because the overlay carries the direction of its trigger, you do not need to set `dir` on the panel yourself.

Physical

```
<div class="data-[side=right]:slide-in-from-left-2"></div>
```

Logical

```
<div class="data-[side=inline-end]:slide-in-from-start-2"></div>
```

## Migrating existing components

If you installed components before RTL support, update them with the CLI, then handle the few places that carry your own code.

## Add the components again

Components installed before the RTL work still have physical classes. Re-adding them with --overwrite replaces the files with the logical versions. Commit or stash your local edits first, because the overwrite is complete.

```
npx zard-cli@latest add dropdown-menu popover --overwrite
```

## Update the pieces that are not a plain file copy

Sidebar, calendar and pagination also carry behavior or labels you may have customized. Re-add them, then check their RTL examples: the sidebar docks to the inline-start edge, the calendar mirrors its week and navigation, and pagination takes translated labels.

```bash
Translated labels
```

```
<z-pagination [zTotal]="10" [(zPageIndex)]="page" zPreviousText="السابق" zNextText="التالي" />
```

```bash
Composable parts
```

```
<z-pagination-previous zText="السابق" />
<z-pagination-next zText="التالي" />
```

## Flip custom directional icons

Icons that point along the reading direction, like an arrow or a chevron you added yourself, need the rtl:rotate-180 class. The icons inside zard components already have it.

```
<ng-icon name="lucideArrowRight" class="rtl:rotate-180" />
```
