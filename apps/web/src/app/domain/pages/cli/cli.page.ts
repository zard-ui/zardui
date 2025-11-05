import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { CliCommandsSection } from './sections/commands.component';
import { CliConfigurationSection } from './sections/configuration.component';
import { CliInstallationSection } from './sections/installation.component';
import { CliOverviewSection } from './sections/overview.component';
import { CliUpdateSection } from './sections/update.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-cli',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    CliOverviewSection,
    CliInstallationSection,
    CliCommandsSection,
    CliUpdateSection,
    CliConfigurationSection,
  ],
  template: `
    <z-content [navigationConfig]="navigationConfig" [activeAnchor]="activeAnchor" scrollSpy (scrollSpyChange)="activeAnchor = $event">
      <z-doc-heading
        title="CLI"
        description="Use the ZardUI CLI to add beautiful, accessible components to your Angular project with a single command."
        scrollSpyItem="overview"
        id="overview"
      >
      </z-doc-heading>

      <cli-overview-section scrollSpyItem="cli-overview" id="cli-overview"></cli-overview-section>
      <cli-installation-section scrollSpyItem="installation" id="installation"></cli-installation-section>
      <cli-commands-section scrollSpyItem="commands" id="commands"></cli-commands-section>
      <cli-update-section scrollSpyItem="update" id="update"></cli-update-section>
      <cli-configuration-section scrollSpyItem="configuration" id="configuration"></cli-configuration-section>
    </z-content>
  `,
})
export class CliPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'cli-overview', label: 'CLI Overview', type: 'custom' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'commands', label: 'Commands', type: 'custom' },
      { id: 'update', label: 'Update', type: 'custom' },
      { id: 'components', label: 'Available Components', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
      { id: 'requirements', label: 'Requirements & Troubleshooting', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo('CLI', 'Use the Zard CLI to add components to your project.', '/docs/cli', 'og-cli.jpg');
  }
}
