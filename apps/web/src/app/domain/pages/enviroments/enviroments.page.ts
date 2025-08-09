import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { EnvCardComponent } from '../../components/env-card/env-card.component';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { ZardBadgeComponent, ZardAlertComponent } from '@zard/components/components';

@Component({
  selector: 'z-enviroments',
  templateUrl: './enviroments.page.html',
  standalone: true,
  imports: [CommonModule, EnvCardComponent, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective, ZardBadgeComponent, ZardAlertComponent],
})
export class EnviromentsPage {
  protected readonly environments = [
    { name: 'angular', icon: 'angular.svg', path: '/docs/installation/angular', available: true },
    { name: 'nx', icon: 'nx.svg', path: '/docs/installation/nx', available: false },
    { name: 'analog.js', icon: 'analog.svg', path: '/docs/installation/analog', available: false },
  ];
  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'environments', label: 'Environments', type: 'custom' },
    ],
  };
  readonly title = 'Installation - zard/ui';
  activeAnchor?: string;
}
