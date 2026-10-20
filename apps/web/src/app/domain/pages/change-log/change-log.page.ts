import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PendingTasks, PLATFORM_ID, signal } from '@angular/core';

import { IconName, NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCode,
  lucideMoon,
  lucidePackage,
  lucideRocket,
  lucideSettings,
  lucideShield,
  lucideTerminal,
  lucideZap,
} from '@ng-icons/lucide';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';

import { ChangelogExamplesComponent } from './components/changelog-examples.component';
import { ChangelogReleaseComponent } from './components/changelog-release.component';
import { type ChangelogEntry, type ChangelogHighlightIcon } from './entries/changelog-entry.interface';
import { ChangelogService } from './services/changelog.service';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { ViewportEnterDirective } from '../../directives/viewport-enter.directive';

const HIGHLIGHT_ICONS: Record<ChangelogHighlightIcon, IconName> = {
  zap: 'lucideZap',
  terminal: 'lucideTerminal',
  moon: 'lucideMoon',
  package: 'lucidePackage',
  rocket: 'lucideRocket',
  shield: 'lucideShield',
  code: 'lucideCode',
  settings: 'lucideSettings',
};

@Component({
  selector: 'z-changelog',
  imports: [
    ChangelogExamplesComponent,
    ChangelogReleaseComponent,
    DocContentComponent,
    DocHeadingComponent,
    NgIcon,
    NgTemplateOutlet,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ViewportEnterDirective,
    ZardAlertComponent,
  ],
  templateUrl: './change-log.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideCode,
      lucideMoon,
      lucidePackage,
      lucideRocket,
      lucideSettings,
      lucideShield,
      lucideTerminal,
      lucideZap,
    }),
  ],
})
export class ChangeLogPage implements OnInit {
  private readonly changelogService = inject(ChangelogService);
  private readonly seoService = inject(SeoService);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly title = 'Changelog - zard/ui';
  readonly activeAnchor = signal<string | undefined>(undefined);

  readonly entries = this.changelogService.entries;

  private readonly releaseEntry = this.entries.find(entry => entry.release);

  /** The current release banner, if any entry carries one. At most one exists at a time. */
  readonly release = this.releaseEntry?.release;

  /** Months newer than the release lead the page, above its banner; the rest follow it. */
  readonly entriesAboveRelease = this.entries.filter(entry => this.isAfterRelease(entry));
  readonly entriesBelowRelease = this.entries.filter(entry => !this.isAfterRelease(entry));

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      ...this.changelogService.entries.map(entry => ({
        id: entry.meta.id,
        label: entry.meta.month,
        type: 'core' as const,
      })),
    ],
  };

  ngOnInit() {
    this.seoService.setDocsSeo('Changelog', 'Latest updates and announcements.', '/docs/changelog', 'og-changelog.jpg');

    // This route is prerendered and `generate-docs-markdown.mjs` reads that HTML,
    // so the server has to emit every demo. The browser instead loads a month's
    // payload only once the month approaches the viewport (see onEntryApproaching).
    if (!this.isBrowser) {
      const done = this.pendingTasks.add();
      this.changelogService.loadAll().finally(done);
    }
  }

  /** Splits a description on `backticks` so code reads as code instead of raw markdown. */
  segmentsOf(text: string): { text: string; code: boolean }[] {
    return text.split('`').map((part, index) => ({ text: part, code: index % 2 === 1 }));
  }

  iconOf(icon: ChangelogHighlightIcon): IconName {
    return HIGHLIGHT_ICONS[icon];
  }

  examplesOf(id: string) {
    return this.changelogService.examplesOf(id);
  }

  onEntryApproaching(entry: ChangelogEntry) {
    void this.changelogService.load(entry);
  }

  private isAfterRelease(entry: ChangelogEntry): boolean {
    return !!this.releaseEntry && entry.meta.date > this.releaseEntry.meta.date;
  }
}
