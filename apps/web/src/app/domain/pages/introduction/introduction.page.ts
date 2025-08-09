import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { Component } from '@angular/core';

import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { OpenSourceSection } from './sections/open-source.component';
import { WhyZardUISection } from './sections/why-zardui.component';
import { AIReadySection } from './sections/ai-ready.component';
import { SupportSection } from './sections/support.component';
import { CLISection } from './sections/cli.component';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, WhyZardUISection, CLISection, AIReadySection, OpenSourceSection, SupportSection],
  template: `
    <z-content [title]="title" [navigationConfig]="navigationConfig" [activeAnchor]="activeAnchor" scrollSpy (scrollSpyChange)="activeAnchor = $event">
      <z-doc-heading
        title="Beautifully designed components"
        description="Built for Angular developers who value both aesthetics and functionality. ZardUI bridges the gap between beautiful design and practical implementation."
        scrollSpyItem="overview"
        id="overview"
      >
      </z-doc-heading>

      <why-zardui-section scrollSpyItem="why-zardui" id="why-zardui"></why-zardui-section>
      <cli-section scrollSpyItem="cli" id="cli"></cli-section>
      <ai-ready-section scrollSpyItem="ai-ready" id="ai-ready"></ai-ready-section>
      <open-source-section scrollSpyItem="open-source" id="open-source"></open-source-section>
      <support-section scrollSpyItem="support" id="support"></support-section>
    </z-content>
  `,
})
export class IntroductionPage {
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
}
