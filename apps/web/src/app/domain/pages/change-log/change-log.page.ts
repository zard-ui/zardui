import { isPlatformBrowser } from '@angular/common';
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
  standalone: true,
  imports: [
    ChangelogExamplesComponent,
    DocContentComponent,
    DocHeadingComponent,
    NgIcon,
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

  iconOf(icon: ChangelogHighlightIcon): IconName {
    return HIGHLIGHT_ICONS[icon];
  }

  examplesOf(id: string) {
    return this.changelogService.examplesOf(id);
  }

  onEntryApproaching(entry: ChangelogEntry) {
    void this.changelogService.load(entry);
  }
}
