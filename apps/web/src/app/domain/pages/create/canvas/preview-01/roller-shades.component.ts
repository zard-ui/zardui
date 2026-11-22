import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCardImports } from '@zard/components/card';
import { ZardSliderComponent } from '@zard/components/slider';
import { ZardToggleGroupComponent, type ZardToggleGroupItem } from '@zard/components/toggle-group';

const PRESETS: ZardToggleGroupItem[] = [
  { value: 'open', label: 'Open' },
  { value: 'half', label: 'Half' },
  { value: 'closed', label: 'Closed' },
];

const PRESET_POSITIONS: Record<string, number> = { open: 0, half: 50, closed: 100 };

/** Bound through `ngModel`: the group keeps its own value once clicked, yet the slider must still move it. */
@Component({
  selector: 'z-preview-01-roller-shades',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ZardCardImports, ZardSliderComponent, ZardToggleGroupComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Living Room" />
        <z-card-description zDescription="Roller Shades" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <div class="bg-muted flex h-32 flex-col overflow-hidden rounded-lg border">
          <div class="bg-muted-foreground transition-all duration-300" [style.height.%]="position()[0]"></div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Open</span>
          <z-slider class="flex-1" zMax="100" [zValue]="position()" (zSlideIndexChange)="position.set($event)" />
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Close</span>
        </div>
      </z-card-content>
      <z-card-footer>
        <z-toggle-group
          zMode="single"
          zType="outline"
          [zSpacing]="1"
          class="w-full"
          zItemClass="flex-1"
          [zItems]="presets"
          [ngModel]="preset()"
          (ngModelChange)="applyPreset($event)"
        />
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01RollerShadesComponent {
  protected readonly presets = PRESETS;
  protected readonly position = signal([50]);

  protected readonly preset = computed(() => {
    const [value] = this.position();
    if (value <= 10) return 'open';
    return value >= 90 ? 'closed' : 'half';
  });

  protected applyPreset(value: string | string[]): void {
    if (typeof value !== 'string' || !(value in PRESET_POSITIONS)) return;
    this.position.set([PRESET_POSITIONS[value]]);
  }
}
