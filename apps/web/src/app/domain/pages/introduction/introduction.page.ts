import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import type { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { AIReadySection } from './sections/ai-ready.component';
import { CLISection } from './sections/cli.component';
import { OpenSourceSection } from './sections/open-source.component';
import { SupportSection } from './sections/support.component';
import { WhyZardUISection } from './sections/why-zardui.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    WhyZardUISection,
    CLISection,
    AIReadySection,
    OpenSourceSection,
    SupportSection,
  ],
  template: `
    <z-content
      [title]="title"
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Introduction"
        description="Built for Angular developers who value both aesthetics and functionality. ZardUI bridges the gap between beautiful design and practical implementation."
        scrollSpyItem="overview"
        id="overview"
      />

      <why-zardui-section scrollSpyItem="why-zardui" id="why-zardui" />
      <cli-section scrollSpyItem="cli" id="cli" />
      <ai-ready-section scrollSpyItem="ai-ready" id="ai-ready" />
      <open-source-section scrollSpyItem="open-source" id="open-source" />
      <support-section scrollSpyItem="support" id="support" />
    </z-content>
  `,
})
export class IntroductionPage implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly title = 'Introduction - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'why-zardui', label: 'Why Zard/UI', type: 'custom' },
      { id: 'cli', label: 'CLI', type: 'custom' },
      { id: 'ai-ready', label: 'AI Ready', type: 'custom' },
      { id: 'open-source', label: 'Open Source', type: 'custom' },
      { id: 'support', label: 'Support', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Introduction',
      'Built for Angular developers who value both aesthetics and functionality. ZardUI bridges the gap between beautiful design and practical implementation.',
      '/docs/introduction',
      'og-introduction.jpg',
    );
  }
}
