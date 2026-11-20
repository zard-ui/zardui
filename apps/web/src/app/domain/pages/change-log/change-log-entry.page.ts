import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, PendingTasks, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { map } from 'rxjs';

import { AiAssistComponent } from '@doc/domain/components/ai-assist/ai-assist.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { anchorOf, ChangelogEntryBodyComponent } from './components/changelog-entry-body.component';
import { ChangelogTextComponent } from './components/changelog-text.component';
import { ChangelogService } from './services/changelog.service';

/** One changelog entry on a page of its own, `/docs/changelog/<slug>`: the link the RSS feed and announcements use. */
@Component({
  selector: 'z-changelog-entry',
  imports: [
    AiAssistComponent,
    ChangelogEntryBodyComponent,
    ChangelogTextComponent,
    DocContentComponent,
    NgIcon,
    RouterLink,
    ZardButtonComponent,
  ],
  template: `
    @if (entry(); as entry) {
      <!-- No scroll spy: it only sees the items in this template, and the sections live in the body component. -->
      <z-content [navigationConfig]="navigationConfig()">
        <header class="flex flex-col gap-2" id="overview">
          <div class="relative flex items-start justify-between gap-4">
            <!-- lg:pr-56 keeps a long title clear of z-assist, which overlays this row from lg up. -->
            <h1 class="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl lg:pr-56">
              {{ entry.meta.month }} - {{ entry.meta.title }}
            </h1>
            <z-assist />
          </div>
          <p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
            <z-changelog-text [text]="entry.overview" />
          </p>
        </header>

        <z-changelog-entry-body [entry]="entry" [headingLevel]="2" [showOverview]="false" />

        <nav aria-label="Changelog entries" class="mt-6 flex flex-wrap items-center gap-2 border-t pt-6">
          @if (newer(); as next) {
            <a
              z-button
              zType="secondary"
              zSize="sm"
              class="shadow-none"
              [routerLink]="['/docs/changelog', next.meta.slug]"
            >
              <ng-icon name="lucideArrowLeft" aria-hidden="true" />
              {{ next.meta.title }}
            </a>
          }
          <a z-button zType="ghost" zSize="sm" routerLink="/docs/changelog">All updates</a>
          @if (older(); as previous) {
            <a
              z-button
              zType="secondary"
              zSize="sm"
              class="ml-auto shadow-none"
              [routerLink]="['/docs/changelog', previous.meta.slug]"
            >
              {{ previous.meta.title }}
              <ng-icon name="lucideArrowRight" aria-hidden="true" />
            </a>
          }
        </nav>
      </z-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
})
export class ChangelogEntryPage {
  private readonly changelogService = inject(ChangelogService);
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map(params => params.get('slug'))));

  readonly entry = computed(() => this.changelogService.bySlug(this.slug()));

  private readonly position = computed(() => {
    const entry = this.entry();
    return entry ? this.changelogService.entries.indexOf(entry) : -1;
  });

  /** The entry published after this one, if any. */
  readonly newer = computed(() => this.changelogService.entries[this.position() - 1]);
  /** The entry published before this one, if any. */
  readonly older = computed(() => this.changelogService.entries[this.position() + 1]);

  readonly navigationConfig = computed<NavigationConfig>(() => {
    const entry = this.entry();
    if (!entry) return { items: [] };
    return {
      items: [
        ...(entry.highlights ?? []).map(highlight => ({
          id: anchorOf(highlight.title),
          label: highlight.title,
          type: 'core' as const,
        })),
        ...(entry.loadExamples
          ? [{ id: 'components', label: entry.examplesTitle ?? 'New Components', type: 'core' as const }]
          : []),
      ],
    };
  });

  constructor() {
    effect(() => {
      const entry = this.entry();
      if (!entry) {
        // An unknown slug: the list of every entry is the closest thing to what was asked for.
        void this.router.navigate(['/docs/changelog'], { replaceUrl: true });
        return;
      }

      const { meta } = entry;
      this.seoService.setDocsSeo(
        `${meta.month} - ${meta.title}`,
        entry.overview.replace(/`/g, ''),
        `/docs/changelog/${meta.slug}`,
        'og-changelog.jpg',
      );

      // Prerendered, and `generate-docs-markdown.mjs` reads that HTML: the server has to emit the demos too.
      if (this.isBrowser) {
        void this.changelogService.load(entry);
      } else {
        const done = this.pendingTasks.add();
        this.changelogService.load(entry).finally(done);
      }
    });
  }
}
