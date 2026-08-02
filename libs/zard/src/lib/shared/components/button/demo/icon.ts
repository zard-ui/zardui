import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-icon',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button z-button zType="outline" zSize="icon" aria-label="Submit">
      <ng-icon name="lucideCircleFadingArrowUp" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingArrowUp })],
})
export class ZardDemoButtonIconComponent {}
