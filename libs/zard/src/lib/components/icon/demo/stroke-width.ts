import { Component } from '@angular/core';
import { House } from 'lucide-angular';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-6">
      <div class="flex flex-col items-center gap-2">
        <z-icon [zType]="HouseIcon" [zStrokeWidth]="1" />
        <span class="text-xs text-muted-foreground">Stroke 1</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon [zType]="HouseIcon" [zStrokeWidth]="2" />
        <span class="text-xs text-muted-foreground">Stroke 2</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon [zType]="HouseIcon" [zStrokeWidth]="3" />
        <span class="text-xs text-muted-foreground">Stroke 3</span>
      </div>

      <div class="flex flex-col items-center gap-2">
        <z-icon [zType]="HouseIcon" [zStrokeWidth]="4" />
        <span class="text-xs text-muted-foreground">Stroke 4</span>
      </div>
    </div>
  `,
})
export class ZardDemoIconStrokeWidthComponent {
  readonly HouseIcon = House;
}
