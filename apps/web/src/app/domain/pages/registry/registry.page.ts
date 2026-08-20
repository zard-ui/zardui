import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { RegistryBlocksSectionComponent } from './sections/blocks.component';
import { RegistryConsumingSectionComponent } from './sections/consuming.component';
import { RegistryContributingSectionComponent } from './sections/contributing.component';
import { RegistryCustomRegistrySectionComponent } from './sections/custom-registry.component';
import { RegistryDependenciesSectionComponent } from './sections/dependencies.component';
import { RegistryHowItWorksSectionComponent } from './sections/how-it-works.component';
import { RegistryIconCatalogSectionComponent } from './sections/icon-catalog.component';
import { RegistryItemSchemaSectionComponent } from './sections/item-schema.component';
import { RegistryLocalDevelopmentSectionComponent } from './sections/local-development.component';
import { RegistryOverviewSectionComponent } from './sections/overview.component';
import { RegistryRegistryJsonSectionComponent } from './sections/registry-json.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-registry',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    RegistryOverviewSectionComponent,
    RegistryHowItWorksSectionComponent,
    RegistryRegistryJsonSectionComponent,
    RegistryItemSchemaSectionComponent,
    RegistryIconCatalogSectionComponent,
    RegistryDependenciesSectionComponent,
    RegistryConsumingSectionComponent,
    RegistryBlocksSectionComponent,
    RegistryCustomRegistrySectionComponent,
    RegistryLocalDevelopmentSectionComponent,
    RegistryContributingSectionComponent,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Registry"
        description="The registry is how Zard UI ships components: a set of static JSON files that expose the full source code of every component, consumed by the CLI and the MCP server."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-registry-overview-section scrollSpyItem="what-is-it" id="what-is-it"></z-registry-overview-section>
      <z-registry-how-it-works-section scrollSpyItem="how-it-works" id="how-it-works"></z-registry-how-it-works-section>
      <z-registry-registry-json-section
        scrollSpyItem="registry-json"
        id="registry-json"
      ></z-registry-registry-json-section>
      <z-registry-item-schema-section scrollSpyItem="item-schema" id="item-schema"></z-registry-item-schema-section>
      <z-registry-icon-catalog-section scrollSpyItem="icon-catalog" id="icon-catalog"></z-registry-icon-catalog-section>
      <z-registry-dependencies-section scrollSpyItem="dependencies" id="dependencies"></z-registry-dependencies-section>
      <z-registry-consuming-section scrollSpyItem="consuming" id="consuming"></z-registry-consuming-section>
      <z-registry-blocks-section scrollSpyItem="blocks" id="blocks"></z-registry-blocks-section>
      <z-registry-custom-registry-section
        scrollSpyItem="custom-registry"
        id="custom-registry"
      ></z-registry-custom-registry-section>
      <z-registry-local-development-section
        scrollSpyItem="local-development"
        id="local-development"
      ></z-registry-local-development-section>
      <z-registry-contributing-section scrollSpyItem="contributing" id="contributing"></z-registry-contributing-section>
    </z-content>
  `,
})
export class RegistryPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'what-is-it', label: 'What is the registry?', type: 'custom' },
      { id: 'how-it-works', label: 'How it works', type: 'custom' },
      { id: 'registry-json', label: 'registry.json', type: 'custom' },
      { id: 'item-schema', label: 'Item schema', type: 'custom' },
      { id: 'icon-catalog', label: 'icons.json', type: 'custom' },
      { id: 'dependencies', label: 'Dependencies', type: 'custom' },
      { id: 'consuming', label: 'Consuming the registry', type: 'custom' },
      { id: 'blocks', label: 'Blocks registry', type: 'custom' },
      { id: 'custom-registry', label: 'Custom registry', type: 'custom' },
      { id: 'local-development', label: 'Local development', type: 'custom' },
      { id: 'contributing', label: 'Adding a component', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Registry',
      'The registry is how Zard UI ships components: a set of static JSON files that expose the full source code of every component, consumed by the CLI and the MCP server.',
      '/docs/registry',
      'og-registry.jpg',
    );
  }
}
