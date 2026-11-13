import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BLOCK_1 as AGENT_PROMPT, TABS_0 as INSTALL_TABS } from '@generated/pages/ai-elements/overview';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ProseDirective } from '@doc/domain/directives/prose.directive';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { AI_ELEMENTS, componentLabel, isAiElementAvailable } from '@doc/shared/constants/ai-elements.constant';
import { SeoService } from '@doc/shared/services/seo.service';

const DESCRIPTION = 'Patterns for agentic interfaces, built from Zard UI components.';

@Component({
  selector: 'z-ai-elements-overview',
  templateUrl: './ai-elements-overview.page.html',
  imports: [
    CodeBlockComponent,
    CodeTabsComponent,
    DocContentComponent,
    DocHeadingComponent,
    ProseDirective,
    RouterLink,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiElementsOverviewPage implements OnInit {
  private readonly seoService = inject(SeoService);

  protected readonly description = DESCRIPTION;
  protected readonly patterns = AI_ELEMENTS.map(entry => ({
    ...entry,
    available: isAiElementAvailable(entry),
    waitingOn: (entry.requires ?? []).map(componentLabel).join(' and '),
  }));

  protected readonly blocks = { installTabs: INSTALL_TABS, agentPrompt: AGENT_PROMPT } as const;

  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'patterns', label: 'Patterns', type: 'core' },
      { id: 'get-started', label: 'Get started', type: 'core' },
      { id: 'streaming', label: 'Streaming', type: 'core' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo('AI Elements', DESCRIPTION, '/docs/ai-elements', 'og-ai-elements.jpg');
  }
}
