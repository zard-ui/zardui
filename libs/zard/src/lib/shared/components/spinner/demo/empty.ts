import { Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-empty',
  imports: [ZardButtonComponent, ZardEmptyComponent, ZardSpinnerComponent],
  template: `
    <z-empty
      class="w-full"
      [zImage]="iconTpl"
      zTitle="Processing your request"
      zDescription="Please wait while we process your request. Do not refresh the page."
      [zActions]="[cancelAction]"
    />

    <ng-template #iconTpl>
      <div class="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
        <z-spinner />
      </div>
    </ng-template>

    <ng-template #cancelAction>
      <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
    </ng-template>
  `,
})
export class ZardDemoSpinnerEmptyComponent {}
