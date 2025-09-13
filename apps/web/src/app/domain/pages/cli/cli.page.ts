import type { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { Component } from '@angular/core';

import { CliConfigurationSection } from './sections/configuration.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { CliInstallationSection } from './sections/installation.component';
import { CliOverviewSection } from './sections/overview.component';
import { CliCommandsSection } from './sections/commands.component';

@Component({
  selector: 'z-cli',
  standalone: true,
  imports: [DocContentComponent, DocHeadingComponent, ScrollSpyDirective, CliOverviewSection, CliInstallationSection, CliCommandsSection, CliConfigurationSection],
  template: `
    <z-content [title]="title" [navigationConfig]="navigationConfig" [activeAnchor]="activeAnchor" scrollSpy (scrollSpyChange)="activeAnchor = $event">
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
      <cli-configuration-section scrollSpyItem="configuration" id="configuration"></cli-configuration-section>
    </z-content>
  `,
})
export class CliPage {
  readonly title = 'CLI - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'cli-overview', label: 'CLI Overview', type: 'custom' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'commands', label: 'Commands', type: 'custom' },
      { id: 'components', label: 'Available Components', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
      { id: 'requirements', label: 'Requirements & Troubleshooting', type: 'custom' },
    ],
  };
}
