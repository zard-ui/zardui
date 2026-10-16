import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMapImports } from '@/shared/components/map/map.imports';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

type ControlsPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

@Component({
  selector: 'z-demo-map-controls',
  imports: [ZardMapImports, ZardToggleGroupComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        [zItems]="positions"
        [zDefaultValue]="position()"
        (valueChange)="onPositionChange($event)"
      />

      <div class="h-[420px] w-full overflow-hidden rounded-xl border">
        <ng-map [center]="[139.6917, 35.6895]" [zoom]="10">
          <ng-map-controls
            [position]="position()"
            [showZoom]="true"
            [showCompass]="true"
            [showLocate]="true"
            [showFullscreen]="true"
          />
        </ng-map>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapControlsComponent {
  protected readonly position = signal<ControlsPosition>('bottom-right');

  protected readonly positions: ZardToggleGroupItem[] = [
    { value: 'top-left', label: 'Top left' },
    { value: 'top-right', label: 'Top right' },
    { value: 'bottom-left', label: 'Bottom left' },
    { value: 'bottom-right', label: 'Bottom right' },
  ];

  protected onPositionChange(value: string | string[]): void {
    if (typeof value === 'string' && value) {
      this.position.set(value as ControlsPosition);
    }
  }
}
