import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-rounded',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-col gap-8">
      <button z-button zType="outline" zSize="icon" class="rounded-full" aria-label="Submit">
        <ng-icon name="lucideArrowUp" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp })],
})
export class ZardDemoButtonRoundedComponent {}
