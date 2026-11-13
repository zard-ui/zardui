import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { AiAssistComponent } from '@doc/domain/components/ai-assist/ai-assist.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ProseDirective } from '@doc/domain/directives/prose.directive';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { type AiElementEntry, componentLabel, findAiElement } from '@doc/shared/constants/ai-elements.constant';
import { DOCS_TABLE_CLASS } from '@doc/shared/constants/docs-table.constant';
import { SeoService } from '@doc/shared/services/seo.service';
import { ZardCodeBoxComponent } from '@doc/widget/components/zard-code-box/zard-code-box.component';

import { ZardTableImports } from '@zard/components/table/table.imports';

import { AI_ELEMENT_LOADERS } from '../ai-element-loaders';
import type { AiElementBlock, AiElementData } from '../ai-element.types';

interface LoadedPattern {
  entry: AiElementEntry;
  data: AiElementData;
}

@Component({
  selector: 'z-ai-element-page',
  templateUrl: './ai-element.page.html',
  imports: [
    AiAssistComponent,
    CodeBlockComponent,
    CodeTabsComponent,
    DocContentComponent,
    ProseDirective,
    RouterLink,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardCodeBoxComponent,
    ZardTableImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiElementPage implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  protected readonly componentLabel = componentLabel;

  activeAnchor = 'overview';
  navigationConfig: NavigationConfig = { items: [] };

  /**
   * The page instance is reused when only the `:pattern` param changes, so the template renders this
   * one-element list through a `@for` keyed by slug: switching patterns rebuilds every demo and anchor
   * instead of reusing the previous pattern's instances by index.
   */
  protected readonly loaded = signal<LoadedPattern[]>([]);

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => void this.load(params.get('pattern') ?? ''));
  }

  /** "Plan is built with [Trace](/docs/components/trace). Add it with the CLI:" */
  protected builtWith(entry: AiElementEntry): string {
    const links = entry.builtWith.map(name => `[${componentLabel(name)}](/docs/components/${name})`);
    const list = links.length > 1 ? `${links.slice(0, -1).join(', ')} and ${links[links.length - 1]}` : links[0];
    return `${entry.name} is built with ${list}. Add ${links.length > 1 ? 'them' : 'it'} with the CLI:`;
  }

  protected blockKind(block: AiElementBlock): 'prose' | 'example' | 'code' | 'table' {
    if ('prose' in block) return 'prose';
    if ('example' in block) return 'example';
    if ('table' in block) return 'table';
    return 'code';
  }

  /** Narrowing helpers for the template, which cannot use `in` on a union. */
  protected asProse = (block: AiElementBlock) => (block as { prose: string }).prose;
  protected asExample = (block: AiElementBlock) => (block as Extract<AiElementBlock, { example: unknown }>).example;
  protected asCode = (block: AiElementBlock) => (block as Extract<AiElementBlock, { code: unknown }>).code;
  protected asTable = (block: AiElementBlock) => (block as Extract<AiElementBlock, { table: unknown }>).table;
  protected readonly tableClass = DOCS_TABLE_CLASS;

  private async load(slug: string): Promise<void> {
    const entry = findAiElement(slug);
    const loader = AI_ELEMENT_LOADERS[slug];

    // A pattern still waiting on a component has an entry but no page: the overview says what it needs.
    if (!entry || !loader) {
      void this.router.navigateByUrl('/docs/ai-elements');
      return;
    }

    const data = await loader();

    this.navigationConfig = {
      items: [
        { id: 'overview', label: 'Overview', type: 'core' },
        { id: 'installation', label: 'Installation', type: 'core' },
        ...data.sections.map(section => ({ id: section.id, label: section.title, type: 'core' as const })),
        { id: 'api', label: 'API Reference', type: 'core' },
      ],
    };
    this.activeAnchor = 'overview';
    this.loaded.set([{ entry, data }]);

    this.seoService.setDocsSeo(entry.name, entry.pageDescription ?? entry.description, `/docs/ai-elements/${entry.slug}`, 'og-ai-elements.jpg');
  }
}
