import type { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { Component } from '@angular/core';
import { JsonIntroductionSectionComponent } from './sections/introduction-section.component';
import { JsonStyleSectionComponent } from './sections/style-section.component';
import { JsonTailwindSectionComponent } from './sections/tailwind-section.component';
import { JsonAliasesSectionComponent } from './sections/aliases-section.component';
import { JsonCurrentStructureSectionComponent } from './sections/current-structure-section.component';

@Component({
  selector: 'z-json',
  templateUrl: './json.page.html',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    JsonIntroductionSectionComponent,
    JsonStyleSectionComponent,
    JsonTailwindSectionComponent,
    JsonAliasesSectionComponent,
    JsonCurrentStructureSectionComponent,
  ],
})
export class JsonPage {
  readonly title = 'components.json - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'style', label: 'Style', type: 'custom' },
      { id: 'tailwind', label: 'Tailwind', type: 'custom' },
      { id: 'aliases', label: 'Aliases', type: 'custom' },
      { id: 'current-structure', label: 'Current Structure', type: 'custom' },
    ],
  };
}
