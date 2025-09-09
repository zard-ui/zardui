import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardLoaderComponent } from '@zard/components/loader/loader.component';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { Component, inject, OnInit, signal, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { ChangelogService, ChangelogEntry } from '../../services/changelog.service';

@Component({
  selector: 'z-changelog',
  standalone: true,
  imports: [
    CommonModule,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardCardComponent,
    ZardAlertComponent,
    ZardLoaderComponent,
    MarkdownRendererComponent,
  ],
  templateUrl: './change-log.page.html',
})
export class ChangeLogPage implements OnInit {
  private readonly changelogService = inject(ChangelogService);

  readonly title = 'Changelog - zard/ui';
  activeAnchor?: string;

  readonly entries = signal<ChangelogEntry[]>([]);
  readonly isLoading = signal(false);

  readonly navigationConfig = computed<NavigationConfig>(() => {
    const items = [{ id: 'overview', label: 'Overview', type: 'core' as const }];

    // Adicionar anchors para as entradas carregadas
    const entryItems = this.entries().map(entry => ({
      id: entry.id,
      label: entry.date,
      type: 'core' as const,
    }));

    return { items: [...items, ...entryItems] };
  });

  async ngOnInit() {
    await this.loadAllEntries();
  }

  private async loadAllEntries() {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    try {
      const allEntries = await this.changelogService.loadAllEntries();
      this.entries.set(allEntries);
    } catch (error) {
      console.error('Error loading changelog entries:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  trackByEntry(index: number, entry: ChangelogEntry): string {
    return entry.id;
  }

  async onAnchorClick(anchorId: string) {
    // Como todas as entradas já estão carregadas, não precisamos fazer nada especial
    // O scroll normal do DynamicAnchorComponent funcionará
    return;
  }
}
