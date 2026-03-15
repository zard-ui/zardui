import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

@Component({
  selector: 'z-block-spinner-empty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardEmptyComponent, ZardIconComponent],
  template: `
    <z-empty
      zTitle="Processing your request"
      zDescription="Please wait while we process your request. Do not refresh the page."
      [zImage]="spinnerTemplate"
      class="w-full border md:p-6"
    >
      <button z-button zType="outline" zSize="sm" class="mt-4">Cancel</button>
    </z-empty>

    <ng-template #spinnerTemplate>
      <div class="bg-muted text-foreground mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg">
        <z-icon zType="loader-circle" class="size-4 animate-spin" />
      </div>
    </ng-template>
  `,
})
export class BlockSpinnerEmptyComponent {}
