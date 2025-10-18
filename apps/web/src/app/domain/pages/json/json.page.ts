import { SeoService } from '@zard/shared/services/seo.service';
import { Component, inject, type OnInit } from '@angular/core';

import { JsonCurrentStructureSectionComponent } from './sections/current-structure-section.component';
import { JsonPackageManagerSectionComponent } from './sections/package-manager-section.component';
import { JsonIntroductionSectionComponent } from './sections/introduction-section.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { JsonTailwindSectionComponent } from './sections/tailwind-section.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { JsonAliasesSectionComponent } from './sections/aliases-section.component';
import { JsonStyleSectionComponent } from './sections/style-section.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-json',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    JsonIntroductionSectionComponent,
    JsonStyleSectionComponent,
    JsonPackageManagerSectionComponent,
    JsonTailwindSectionComponent,
    JsonAliasesSectionComponent,
    JsonCurrentStructureSectionComponent,
  ],
  template: `
    <z-content [title]="title" [navigationConfig]="navigationConfig" [activeAnchor]="activeAnchor" scrollSpy (scrollSpyChange)="activeAnchor = $event">
      <z-doc-heading title="components.json" description="Configuration for your project." scrollSpyItem="overview" id="overview"> </z-doc-heading>

      <z-json-introduction-section />
      <z-json-style-section />
      <z-json-package-manager-section />
      <z-json-tailwind-section />
      <z-json-aliases-section />
      <z-json-current-structure-section />
    </z-content>
  `,
})
export class JsonPage implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly title = 'components.json - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'style', label: 'Style', type: 'custom' },
      { id: 'package-manager', label: 'Package Manager', type: 'custom' },
      { id: 'tailwind', label: 'Tailwind', type: 'custom' },
      { id: 'aliases', label: 'Aliases', type: 'custom' },
      { id: 'current-structure', label: 'Current Structure', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'components.json',
      'Configuration file for your Zard UI project. Customize styles, paths, package manager, Tailwind config, and component aliases.',
      '/docs/components-json',
      'og-componentsjson.jpg',
    );
  }
}
