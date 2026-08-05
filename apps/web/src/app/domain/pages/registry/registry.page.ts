import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { RegistryBlocksSection } from './sections/blocks.component';
import { RegistryConsumingSection } from './sections/consuming.component';
import { RegistryContributingSection } from './sections/contributing.component';
import { RegistryCustomRegistrySection } from './sections/custom-registry.component';
import { RegistryDependenciesSection } from './sections/dependencies.component';
import { RegistryHowItWorksSection } from './sections/how-it-works.component';
import { RegistryItemSchemaSection } from './sections/item-schema.component';
import { RegistryLocalDevelopmentSection } from './sections/local-development.component';
import { RegistryOverviewSection } from './sections/overview.component';
import { RegistryRegistryJsonSection } from './sections/registry-json.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-registry',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    RegistryOverviewSection,
    RegistryHowItWorksSection,
    RegistryRegistryJsonSection,
    RegistryItemSchemaSection,
    RegistryDependenciesSection,
    RegistryConsumingSection,
    RegistryBlocksSection,
    RegistryCustomRegistrySection,
    RegistryLocalDevelopmentSection,
    RegistryContributingSection,
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

      <registry-overview-section scrollSpyItem="what-is-it" id="what-is-it"></registry-overview-section>
      <registry-how-it-works-section scrollSpyItem="how-it-works" id="how-it-works"></registry-how-it-works-section>
      <registry-registry-json-section scrollSpyItem="registry-json" id="registry-json"></registry-registry-json-section>
      <registry-item-schema-section scrollSpyItem="item-schema" id="item-schema"></registry-item-schema-section>
      <registry-dependencies-section scrollSpyItem="dependencies" id="dependencies"></registry-dependencies-section>
      <registry-consuming-section scrollSpyItem="consuming" id="consuming"></registry-consuming-section>
      <registry-blocks-section scrollSpyItem="blocks" id="blocks"></registry-blocks-section>
      <registry-custom-registry-section
        scrollSpyItem="custom-registry"
        id="custom-registry"
      ></registry-custom-registry-section>
      <registry-local-development-section
        scrollSpyItem="local-development"
        id="local-development"
      ></registry-local-development-section>
      <registry-contributing-section scrollSpyItem="contributing" id="contributing"></registry-contributing-section>
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
