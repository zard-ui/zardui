import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { McpConfigurationSectionComponent } from './sections/configuration-section.component';
import { McpInstallationSectionComponent } from './sections/installation-section.component';
import { McpIntroductionSectionComponent } from './sections/introduction-section.component';
import { McpToolsSectionComponent } from './sections/tools-section.component';
import { McpTroubleshootingSectionComponent } from './sections/troubleshooting-section.component';
import { McpUsageSectionComponent } from './sections/usage-section.component';

@Component({
  selector: 'z-mcp',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    McpIntroductionSectionComponent,
    McpInstallationSectionComponent,
    McpToolsSectionComponent,
    McpUsageSectionComponent,
    McpConfigurationSectionComponent,
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
        description="Connect your AI assistant to the ZardUI registry — browse, read and install components without leaving the editor."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-mcp-introduction-section />
      <z-mcp-installation-section scrollSpyItem="installation" id="installation" />
      <z-mcp-tools-section scrollSpyItem="tools" id="tools" />
      <z-mcp-usage-section scrollSpyItem="usage" id="usage" />
      <z-mcp-configuration-section scrollSpyItem="configuration" id="configuration" />
      <z-mcp-troubleshooting-section scrollSpyItem="troubleshooting" id="troubleshooting" />
    </z-content>
  `,
})
export class McpPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'tools', label: 'Tools', type: 'custom' },
      { id: 'usage', label: 'Usage', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
      { id: 'troubleshooting', label: 'Troubleshooting', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'MCP Server',
      'Connect Claude, Cursor, VS Code or Windsurf to the ZardUI registry through the Model Context Protocol and let your AI assistant read and install components.',
      '/docs/mcp',
      'og-mcp.jpg',
    );
  }
}
