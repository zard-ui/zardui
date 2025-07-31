import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

import { EnvCardComponent } from '../../components/env-card/env-card.component';

@Component({
  selector: 'z-enviroments',
  templateUrl: './enviroments.page.html',
  standalone: true,
  imports: [CommonModule, EnvCardComponent],
})
export class EnviromentsPage {
  protected readonly angularEnvs = [
    { name: 'angular', icon: 'angular.svg', path: '/docs/installation/angular' },
    { name: 'nx', icon: 'nx.svg', path: '/docs/installation/nx' },
    { name: 'analog.js', icon: 'analog.svg', path: '/docs/installation/analog' },
  ];

  constructor(private viewportScroller: ViewportScroller) {
    this.loadData();
  }

  private loadData() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
