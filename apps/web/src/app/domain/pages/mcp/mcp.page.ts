import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { McpConfigurationSectionComponent } from './sections/configuration.component';
import { McpInstallationSectionComponent } from './sections/installation.component';
import { McpOverviewSectionComponent } from './sections/overview.component';
import { McpSecuritySectionComponent } from './sections/security.component';
import { McpToolsSectionComponent } from './sections/tools.component';
import { McpTroubleshootingSectionComponent } from './sections/troubleshooting.component';
import { McpUsageSectionComponent } from './sections/usage.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-mcp',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    McpOverviewSectionComponent,
    McpInstallationSectionComponent,
    McpUsageSectionComponent,
    McpToolsSectionComponent,
    McpConfigurationSectionComponent,
    McpSecuritySectionComponent,
    McpTroubleshootingSectionComponent,
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

      <z-mcp-overview-section scrollSpyItem="what-is-it" id="what-is-it"></z-mcp-overview-section>
      <z-mcp-installation-section scrollSpyItem="installation" id="installation"></z-mcp-installation-section>
      <z-mcp-usage-section scrollSpyItem="usage" id="usage"></z-mcp-usage-section>
      <z-mcp-tools-section scrollSpyItem="tools" id="tools"></z-mcp-tools-section>
      <z-mcp-configuration-section scrollSpyItem="configuration" id="configuration"></z-mcp-configuration-section>
      <z-mcp-security-section scrollSpyItem="security" id="security"></z-mcp-security-section>
      <z-mcp-troubleshooting-section
        scrollSpyItem="troubleshooting"
        id="troubleshooting"
      ></z-mcp-troubleshooting-section>
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
      { id: 'usage', label: 'Usage', type: 'custom' },
      { id: 'tools', label: 'Tools', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
      { id: 'security', label: 'Security', type: 'custom' },
      { id: 'troubleshooting', label: 'Troubleshooting', type: 'custom' },
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
