import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-preview',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <button z-button zType="outline">Button</button>
      <button z-button zType="outline" zSize="icon" aria-label="Submit">
        <ng-icon name="lucideArrowUp" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp })],
})
export class ZardDemoButtonPreviewComponent {}
