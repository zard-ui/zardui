import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-spinner',
  imports: [ZardButtonComponent, ZardSpinnerComponent],
  template: `
    <div class="flex gap-2">
      <button type="button" z-button zType="outline" [zLoading]="true" [zDisabled]="true">Generating</button>
      <button type="button" z-button zType="secondary" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        Downloading
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonSpinnerComponent {}
