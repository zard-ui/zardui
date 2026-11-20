import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PendingTasks,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRss } from '@ng-icons/lucide';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

import { ChangelogEntryBodyComponent } from './components/changelog-entry-body.component';
import { type ChangelogEntry } from './entries/changelog-entry.interface';
import { ChangelogService } from './services/changelog.service';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { ViewportEnterDirective } from '../../directives/viewport-enter.directive';

/**
 * The changelog index, laid out like shadcn/ui's: the newest entries in full, then the older ones as links to
 * their own pages (`/docs/changelog/<slug>`, see `ChangelogEntryPage`), and an RSS feed of all of them.
 */
@Component({
  selector: 'z-changelog',
  imports: [
    ChangelogEntryBodyComponent,
    DocContentComponent,
    NgIcon,
    RouterLink,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ViewportEnterDirective,
    ZardButtonComponent,
  ],
  templateUrl: './change-log.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRss })],
})
export class ChangeLogPage implements OnInit {
  private readonly changelogService = inject(ChangelogService);
  private readonly seoService = inject(SeoService);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly activeAnchor = signal<string | undefined>(undefined);

  readonly latest = this.changelogService.latest;
  readonly older = this.changelogService.older;

  readonly navigationConfig: NavigationConfig = {
    items: [
      ...this.latest.map(entry => ({ id: entry.meta.id, label: entry.meta.title, type: 'core' as const })),
      ...(this.older.length > 0 ? [{ id: 'more-updates', label: 'More Updates', type: 'core' as const }] : []),
    ],
  };

  constructor() {
    // Every month used to live on this page, at `#<id>`. A link to one that is no longer shown in full goes to
    // the entry's own page instead of the top of this one.
    afterNextRender(() => {
      const entry = this.changelogService.byId(this.route.snapshot.fragment);
      if (entry && !this.latest.includes(entry)) {
        void this.router.navigate(['/docs/changelog', entry.meta.slug], { replaceUrl: true });
      }
    });
  }

  ngOnInit() {
    this.seoService.setDocsSeo('Changelog', 'Latest updates and announcements.', '/docs/changelog', 'og-changelog.jpg');

    // This route is prerendered and `generate-docs-markdown.mjs` reads that HTML,
    // so the server has to emit every demo. The browser instead loads an entry's
    // payload only once it approaches the viewport (see onEntryApproaching).
    if (!this.isBrowser) {
      const done = this.pendingTasks.add();
      this.changelogService.loadAll(this.latest).finally(done);
    }
  }

  onEntryApproaching(entry: ChangelogEntry) {
    void this.changelogService.load(entry);
  }
}
