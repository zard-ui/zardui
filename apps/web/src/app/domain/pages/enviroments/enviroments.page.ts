import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';

import { EnvCardComponent } from '../../components/env-card/env-card.component';
import { DynamicAnchorComponent, NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { ZardBadgeComponent, ZardAlertComponent } from '@zard/components/components';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'z-enviroments',
  templateUrl: './enviroments.page.html',
  standalone: true,
  imports: [CommonModule, EnvCardComponent, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, ZardBadgeComponent, ZardAlertComponent],
})
export class EnviromentsPage implements OnInit {
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
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly title = 'Installation - zard/ui';
  activeAnchor?: string;

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }
}
