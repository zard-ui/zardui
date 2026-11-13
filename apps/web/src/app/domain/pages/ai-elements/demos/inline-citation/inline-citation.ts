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
