import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { CliCommandsSectionComponent } from './sections/commands.component';
import { CliConfigurationSectionComponent } from './sections/configuration.component';
import { CliInstallationSectionComponent } from './sections/installation.component';
import { CliProjectTypesSectionComponent } from './sections/project-types.component';
import { CliUpdateSectionComponent } from './sections/update.component';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-cli',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    CliInstallationSectionComponent,
    CliProjectTypesSectionComponent,
    CliCommandsSectionComponent,
    CliConfigurationSectionComponent,
    CliUpdateSectionComponent,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="CLI"
        description="Use the zard/ui CLI to add beautiful, accessible components to your Angular project with a single command."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-cli-installation-section scrollSpyItem="installation" id="installation"></z-cli-installation-section>
      <z-cli-project-types-section scrollSpyItem="project-types" id="project-types"></z-cli-project-types-section>
      <z-cli-commands-section scrollSpyItem="commands" id="commands"></z-cli-commands-section>
      <z-cli-configuration-section scrollSpyItem="configuration" id="configuration"></z-cli-configuration-section>
      <z-cli-update-section scrollSpyItem="update" id="update"></z-cli-update-section>
    </z-content>
  `,
})
export class CliPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  // One entry per section that actually exists — the old list pointed at anchors
  // with no target ("Available Components", "Requirements").
  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'project-types', label: 'Project Types', type: 'custom' },
      { id: 'commands', label: 'Commands', type: 'custom' },
      { id: 'configuration', label: 'Configuration', type: 'custom' },
      { id: 'update', label: 'Update', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo('CLI', 'Use the Zard CLI to add components to your project.', '/docs/cli', 'og-cli.jpg');
  }
}
