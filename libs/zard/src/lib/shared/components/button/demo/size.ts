import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-size',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col items-start gap-8 sm:flex-row">
      <div class="flex items-start gap-2">
        <button z-button zSize="xs" zType="outline">Extra Small</button>
        <button z-button zSize="icon-xs" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zSize="sm" zType="outline">Small</button>
        <button z-button zSize="icon-sm" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zType="outline">Default</button>
        <button z-button zSize="icon" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
      <div class="flex items-start gap-2">
        <button z-button zType="outline" zSize="lg">Large</button>
        <button z-button zSize="icon-lg" zType="outline" aria-label="Submit">
          <ng-icon name="lucideArrowUpRight" />
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight })],
})
export class ZardDemoButtonSizeComponent {}
