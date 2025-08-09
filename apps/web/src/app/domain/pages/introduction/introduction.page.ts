import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-introduction',
  standalone: true,
  imports: [RouterModule, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
  templateUrl: './introduction.page.html',
})
export class IntroductionPage {
  readonly title = 'Introduction - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'why-zardui', label: 'Why Zardui', type: 'custom' },
      { id: 'cli', label: 'CLI', type: 'custom' },
      { id: 'ai-ready', label: 'AI Ready', type: 'custom' },
      { id: 'open-source', label: 'Open Source', type: 'custom' },
    ],
  };
}
