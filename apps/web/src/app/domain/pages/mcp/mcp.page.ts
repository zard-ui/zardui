import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { McpConfigurationSection } from './sections/configuration.component';
import { McpInstallationSection } from './sections/installation.component';
import { McpOverviewSection } from './sections/overview.component';
import { McpToolsSection } from './sections/tools.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-mcp',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    McpOverviewSection,
    McpInstallationSection,
    McpToolsSection,
    McpConfigurationSection,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="MCP Server"
        description="Give your AI assistant the real zard/ui components: the source code, the docs and the CLI, instead of what it remembers about them."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <mcp-overview-section scrollSpyItem="what-is-it" id="what-is-it"></mcp-overview-section>
      <mcp-installation-section scrollSpyItem="installation" id="installation"></mcp-installation-section>
      <mcp-tools-section scrollSpyItem="tools" id="tools"></mcp-tools-section>
      <mcp-configuration-section scrollSpyItem="configuration" id="configuration"></mcp-configuration-section>
    </z-content>
  `,
})
export class McpPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'what-is-it', label: 'What it is', type: 'custom' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'tools', label: 'Tools', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'MCP Server',
      'Connect your AI assistant to zard/ui: list and search components, read their source and docs, and install them through the CLI.',
      '/docs/mcp',
      'og-mcp.jpg',
    );
  }
}
