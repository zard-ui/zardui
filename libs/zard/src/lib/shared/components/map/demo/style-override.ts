import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardMapImports } from '@/shared/components/map/map.imports';
import { ZardMapStyleSelectComponent } from '@/shared/components/map-style-select/map-style-select.component';

/** Defined once, outside the component: `<ng-map>` compares styles by identity before it restyles. */
const FIORD = {
  light: 'https://tiles.openfreemap.org/styles/fiord',
  dark: 'https://tiles.openfreemap.org/styles/fiord',
};

@Component({
  selector: 'z-demo-map-style-override',
  imports: [ZardMapImports, ZardMapStyleSelectComponent, ZardBadgeComponent],
  template: `
    <div class="flex w-full flex-col gap-3">
      <z-map-style-select class="max-w-60" />

      <div class="grid gap-4 md:grid-cols-2">
        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <ng-map [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Follows the picker</z-badge>
        </div>

        <div class="relative h-[320px] overflow-hidden rounded-xl border">
          <!-- A map with its own [styles] ignores the picker. -->
          <ng-map [styles]="fiord" [center]="[4.9041, 52.3676]" [zoom]="11" />
          <z-badge zType="secondary" class="absolute top-3 left-3">Own [styles]: Fiord</z-badge>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMapStyleOverrideComponent {
  protected readonly fiord = FIORD;
}
