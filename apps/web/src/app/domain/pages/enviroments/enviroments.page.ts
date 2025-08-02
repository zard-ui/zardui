import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, signal } from '@angular/core';

import { EnvCardComponent } from '../../components/env-card/env-card.component';
import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';

@Component({
  selector: 'z-enviroments',
  templateUrl: './enviroments.page.html',
  standalone: true,
  imports: [CommonModule, EnvCardComponent, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class EnviromentsPage {
  activeAnchor?: string;
  protected readonly environments = [
    { name: 'angular', icon: 'angular.svg', path: '/docs/installation/angular', available: true },
    { name: 'nx', icon: 'nx.svg', path: '/docs/installation/nx', available: false },
    { name: 'analog.js', icon: 'analog.svg', path: '/docs/installation/analog', available: false },
  ];

  readonly pageTopics = signal<Topic[]>([{ name: 'introduction' }, { name: 'environments' }]);

  constructor(private viewportScroller: ViewportScroller) {
    this.loadData();
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
