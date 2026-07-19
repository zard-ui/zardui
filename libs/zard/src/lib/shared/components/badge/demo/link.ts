import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-link',
  imports: [ZardBadgeComponent, NgIcon, RouterLink],
  template: `
    <div class="flex w-full flex-wrap gap-2">
      <a z-badge [routerLink]="[]" fragment="link">
        <span class="flex items-center">
          Open Link
          <ng-icon name="lucideArrowUpRight" />
        </span>
      </a>
    </div>
  `,
  viewProviders: [provideIcons({ lucideArrowUpRight })],
})
export class ZardDemoBadgeLinkComponent {}
