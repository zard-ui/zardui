import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-spinner',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex gap-2">
      <button z-button zType="outline" [zLoading]="true" [zDisabled]="true">Generating</button>
      <button z-button zType="secondary" [zDisabled]="true">
        Downloading
        <ng-icon name="lucideLoaderCircle" class="animate-spin" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
})
export class ZardDemoButtonSpinnerComponent {}
