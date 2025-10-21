import { Component } from '@angular/core';
import { Heart, CircleCheck, TriangleAlert, Info, Star, Zap } from 'lucide-angular';

import { ZardIconComponent } from '../icon.component';

@Component({
  standalone: true,
  imports: [ZardIconComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-icon [zType]="HeartIcon" class="text-destructive" />
      <z-icon [zType]="CheckCircleIcon" class="text-green-500" />
      <z-icon [zType]="AlertTriangleIcon" class="text-warning" />
      <z-icon [zType]="InfoIcon" class="text-blue-500" />
      <z-icon [zType]="StarIcon" class="text-yellow-500" />
      <z-icon [zType]="ZapIcon" class="text-purple-500" />
    </div>
  `,
})
export class ZardDemoIconColorsComponent {
  readonly HeartIcon = Heart;
  readonly CheckCircleIcon = CircleCheck;
  readonly AlertTriangleIcon = TriangleAlert;
  readonly InfoIcon = Info;
  readonly StarIcon = Star;
  readonly ZapIcon = Zap;
}
