import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-rounded',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex gap-2">
      <button z-button zShape="circle">Get Started</button>
      <button z-button zType="outline" zSize="icon" zShape="circle">
        <ng-icon name="lucideArrowUp" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp })],
})
export class ZardDemoButtonRoundedComponent {}
