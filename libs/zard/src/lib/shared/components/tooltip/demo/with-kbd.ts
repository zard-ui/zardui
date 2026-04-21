import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardKbdComponent } from '@/shared/components/kbd';
import { ZardTooltipDirective } from '@/shared/components/tooltip/tooltip';

@Component({
  selector: 'z-demo-kbd-tooltip',
  imports: [NgIcon, ZardButtonComponent, ZardTooltipDirective, ZardKbdComponent],
  template: `
    <button type="button" z-button [zTooltip]="shortcutTip" zType="outline" zSize="icon-sm">
      <ng-icon name="lucideSave" />
    </button>

    <ng-template #shortcutTip>
      Save changes
      <z-kbd>S</z-kbd>
    </ng-template>
  `,
  viewProviders: [provideIcons({ lucideSave })],
})
export class ZardDemoTooltipWithKbdComponent {}
