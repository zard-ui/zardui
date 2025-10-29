import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardIconComponent } from '../../icon/icon.component';
import { ZardEmptyComponent } from '../empty.component';

@Component({
  selector: 'z-demo-empty-custom-image',
  standalone: true,
  imports: [ZardButtonComponent, ZardEmptyComponent, ZardIconComponent],
  template: `
    <z-empty zImage="/images/icons8-nothing-found-100.png" zTitle="No results found" zDescription="Try adjusting your search terms" [zActions]="[actionClear]" />

    <ng-template #actionClear>
      <button type="button" z-button zType="ghost">
        <span z-icon zType="x"></span>
        Clear Search
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoEmptyCustomImageComponent {}
