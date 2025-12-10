import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { StepsComponent } from '@doc/domain/components/steps/steps.component';
import { Step } from '@doc/shared/constants/install.constant';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';

import { type ChangelogEntryConfig } from './entries/changelog-entry.interface';
import { ChangelogService } from './services/changelog.service';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-changelog',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardAlertComponent,
    StepsComponent,
    ZardCodeBoxComponent,
  ],
  templateUrl: './change-log.page.html',
})
export class ChangeLogPage implements OnInit {
  private readonly changelogService = inject(ChangelogService);
  private readonly seoService = inject(SeoService);

  readonly title = 'Changelog - zard/ui';
  activeAnchor?: string;

  readonly entries = signal<ChangelogEntryConfig[]>([]);

  readonly navigationConfig = computed<NavigationConfig>(() => {
    const items = [{ id: 'overview', label: 'Overview', type: 'core' as const }];

    const entryItems = this.entries().map(entry => ({
      id: entry.id,
      label: entry.meta.month,
      type: 'core' as const,
    }));

    return { items: [...items, ...entryItems] };
  });

  ngOnInit() {
    this.seoService.setDocsSeo('Changelog', 'Latest updates and announcements.', '/docs/changelog', 'og-changelog.jpg');
    this.loadAllEntries();
  }

  private loadAllEntries() {
    const allEntries = this.changelogService.getAllEntries();
    this.entries.set(allEntries);
  }

  trackByEntry(_: number, entry: ChangelogEntryConfig): string {
    return entry.id;
  }

  async onAnchorClick(anchorId: string) {
    return;
  }

  getInstallSteps(componentName: string): Step[] {
    return [
      {
        title: 'Run the CLI',
        subtitle: `Use the CLI to add ${componentName} to your project.`,
        file: {
          path: `/installation/cli/add-${componentName}.md`,
          lineNumber: false,
        },
      },
    ];
  }
}
