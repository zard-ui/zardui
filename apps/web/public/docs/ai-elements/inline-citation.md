---
title: Inline Citation
description: A source in the sentence that opens on hover.
---

# Inline Citation

A source in the sentence that opens on hover.

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';

interface Source {
  url: string;
  title: string;
  description: string;
}

const SOURCES = {
  ssr: {
    url: 'https://angular.dev/guide/ssr',
    title: 'Server-side and hybrid rendering',
    description: 'How Angular renders a route on the server and hydrates it in the browser.',
  },
  defer: {
    url: 'https://angular.dev/guide/templates/defer',
    title: 'Deferred loading with @defer',
    description: 'Load a part of the template later, with a placeholder until it is ready.',
  },
  incremental: {
    url: 'https://angular.dev/guide/incremental-hydration',
    title: 'Incremental hydration',
    description: 'Hydrate deferred blocks only when they are needed.',
  },
  prerender: {
    url: 'https://angular.dev/guide/prerendering',
    title: 'Prerendering',
    description: 'Render pages at build time, as static HTML.',
  },
  chunked: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding',
    title: 'Transfer-Encoding',
    description: 'Send a response as a series of chunks.',
  },
} satisfies Record<string, Source>;

@Component({
  selector: 'z-ai-elements-inline-citation',
  imports: [NgTemplateOutlet, ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <ng-template #citation let-source>
      <button
        type="button"
        z-button
        zType="secondary"
        zSize="xs"
        [zHoverCard]="card"
        [zOpenDelay]="10"
        [zCloseDelay]="100"
      >
        {{ hostname(source.url) }}
      </button>
      <ng-template #card>
        <z-hover-card class="flex w-64 flex-col gap-1 text-sm">
          <div class="font-medium">{{ source.title }}</div>
          <p class="text-muted-foreground">{{ source.description }}</p>
          <a
            [href]="source.url"
            target="_blank"
            rel="noreferrer"
            class="text-muted-foreground text-xs underline-offset-4 hover:underline"
          >
            {{ hostname(source.url) }}
            <span class="sr-only">(opens in a new tab)</span>
          </a>
        </z-hover-card>
      </ng-template>
    </ng-template>

    <div class="mx-auto flex max-w-sm flex-col gap-3 py-6 text-sm leading-relaxed">
      <p>
        Angular renders a route on the server, so the page shows up before the app has loaded in the browser.
        <ng-container *ngTemplateOutlet="citation; context: { $implicit: sources.ssr }" />
      </p>
      <p>
        Wrap a slow part of the page in a &#64;defer block and Angular sends the placeholder first. When the block is
        needed, it loads and replaces the placeholder, without blocking the rest of the page.
        <ng-container *ngTemplateOutlet="citation; context: { $implicit: sources.defer }" />
        Incremental hydration helps here, because a deferred block stays dehydrated until it is used.
        <ng-container *ngTemplateOutlet="citation; context: { $implicit: sources.incremental }" />
      </p>
      <p>
        Prerendering does the same at build time for routes that do not change.
        <ng-container *ngTemplateOutlet="citation; context: { $implicit: sources.prerender }" />
        The server response streams over chunked transfer encoding, so there is nothing extra to set up.
        <ng-container *ngTemplateOutlet="citation; context: { $implicit: sources.chunked }" />
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardAiElementsInlineCitationComponent {
  protected readonly sources = SOURCES;

  protected hostname(url: string): string {
    return new URL(url).hostname.replace(/^www\./, '');
  }
}
```

Inline Citation is a source that sits in the sentence it supports. It is a [Hover Card](/docs/components/hover-card) on a [Button](/docs/components/button).

To show a list of sources after the reply, use [Sources](/docs/ai-elements/sources).

## Installation

Inline Citation is built with [Hover Card](/docs/components/hover-card) and [Button](/docs/components/button). Add them with the CLI:

```
npx zard-cli add hover-card button
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '@/shared/components/hover-card/hover-card.component';
```

```
<button type="button" z-button zType="secondary" zSize="xs" [zHoverCard]="card" [zOpenDelay]="10" [zCloseDelay]="100">
  {{ hostname }}
</button>

<ng-template #card>
  <z-hover-card class="flex w-64 flex-col gap-1 text-sm">
    <div class="font-medium">{{ title }}</div>
    <a [href]="url" target="_blank" rel="noreferrer">
      {{ hostname }}
      <span class="sr-only">(opens in a new tab)</span>
    </a>
  </z-hover-card>
</ng-template>
```

## Streaming

Each source the agent sends with its reply is a citation. Keep them in a signal.

```
interface Source {
  url: string;
  title?: string;
}

protected readonly sources = signal<Source[]>([]);

/** `title` is optional: fall back to the hostname of the URL. */
protected label(source: Source): string {
  return source.title ?? new URL(source.url).hostname.replace(/^www\./, '');
}
```

## API Reference

Inline Citation has no API of its own. See the API of the components it is built with:

- [Hover Card](/docs/components/hover-card#api)
- [Button](/docs/components/button#api)
