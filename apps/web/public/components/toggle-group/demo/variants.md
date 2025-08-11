```angular-ts showLineNumbers
import { Component } from '@angular/core';

import { ZardToggleGroupComponent, ZardToggleGroupItem } from '../toggle-group.component';

@Component({
  selector: 'demo-toggle-group-variants',
  standalone: true,
  imports: [ZardToggleGroupComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium mb-2">Outline Variant</h3>
        <z-toggle-group zMode="multiple" zType="outline" [items]="formattingItems" (valueChange)="onToggleChange($event)"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Single Selection</h3>
        <z-toggle-group zMode="single" [items]="alignmentItems" defaultValue="center" (valueChange)="onToggleChange($event)"></z-toggle-group>
      </div>

      <div>
        <h3 class="text-sm font-medium mb-2">Sizes</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-muted-foreground mb-1">Small</p>
            <z-toggle-group zMode="multiple" zSize="sm" [items]="formattingItems" (valueChange)="onToggleChange($event)"></z-toggle-group>
          </div>
          <div>
            <p class="text-xs text-muted-foreground mb-1">Medium (Default)</p>
            <z-toggle-group zMode="multiple" zSize="md" [items]="formattingItems" (valueChange)="onToggleChange($event)"></z-toggle-group>
          </div>
          <div>
            <p class="text-xs text-muted-foreground mb-1">Large</p>
            <z-toggle-group zMode="multiple" zSize="lg" [items]="formattingItems" (valueChange)="onToggleChange($event)"></z-toggle-group>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class ToggleGroupVariantsComponent {
  formattingItems: ZardToggleGroupItem[] = [
    {
      value: 'bold',
      icon: 'icon-bold',
      ariaLabel: 'Toggle bold',
    },
    {
      value: 'italic',
      icon: 'icon-italic',
      ariaLabel: 'Toggle italic',
    },
    {
      value: 'underline',
      icon: 'icon-underline',
      ariaLabel: 'Toggle underline',
    },
  ];

  alignmentItems: ZardToggleGroupItem[] = [
    {
      value: 'left',
      icon: 'icon-align-left',
      ariaLabel: 'Align left',
    },
    {
      value: 'center',
      icon: 'icon-align-center',
      ariaLabel: 'Align center',
    },
    {
      value: 'right',
      icon: 'icon-align-right',
      ariaLabel: 'Align right',
    },
  ];

  onToggleChange(value: string | string[]) {
    console.log('Toggle group changed:', value);
  }
}

```