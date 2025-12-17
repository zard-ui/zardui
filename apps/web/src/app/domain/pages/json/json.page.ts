import { Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { JsonAliasesSectionComponent } from './sections/aliases-section.component';
import { JsonAppConfigSectionComponent } from './sections/app-config-section.component';
import { JsonBaseUrlSectionComponent } from './sections/base-url-section.component';
import { JsonCurrentStructureSectionComponent } from './sections/current-structure-section.component';
import { JsonIntroductionSectionComponent } from './sections/introduction-section.component';
import { JsonPackageManagerSectionComponent } from './sections/package-manager-section.component';
import { JsonSchemaSectionComponent } from './sections/schema-section.component';
import { JsonStyleSectionComponent } from './sections/style-section.component';
import { JsonTailwindSectionComponent } from './sections/tailwind-section.component';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
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
    JsonSchemaSectionComponent,
    JsonStyleSectionComponent,
    JsonAppConfigSectionComponent,
    JsonPackageManagerSectionComponent,
    JsonTailwindSectionComponent,
    JsonBaseUrlSectionComponent,
    JsonAliasesSectionComponent,
    JsonCurrentStructureSectionComponent,
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
        title="components.json"
        description="Configuration for your project."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-json-introduction-section />
      <z-json-schema-section />
      <z-json-style-section />
      <z-json-app-config-section />
      <z-json-package-manager-section />
      <z-json-tailwind-section />
      <z-json-base-url-section />
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
      { id: 'schema', label: '$schema', type: 'custom' },
      { id: 'style', label: 'Style', type: 'custom' },
      { id: 'app-config', label: 'App Config', type: 'custom' },
      { id: 'package-manager', label: 'Package Manager', type: 'custom' },
      { id: 'tailwind', label: 'Tailwind', type: 'custom' },
      { id: 'base-url', label: 'Base URL', type: 'custom' },
      { id: 'aliases', label: 'Aliases', type: 'custom' },
      { id: 'current-structure', label: 'Full Example', type: 'custom' },
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
