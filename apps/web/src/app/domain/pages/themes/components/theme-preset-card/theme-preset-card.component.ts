import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';

import type { ThemePreset } from '../../models/theme.model';
import { oklchToHex } from '../../utils/oklch-converter';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'app-theme-preset-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '(click)': 'select.emit(preset().name)',
  },
  template: `
    <div class="flex items-center gap-2">
      <div class="size-5 rounded-full border shadow-sm" [style.background-color]="primaryHex()"></div>
      <div class="size-5 rounded-full border shadow-sm" [style.background-color]="secondaryHex()"></div>
    </div>
    <span class="text-xs font-medium">{{ preset().name }}</span>
  `,
})
export class ThemePresetCardComponent {
  readonly preset = input.required<ThemePreset>();
  readonly isActive = input<boolean>(false);
  readonly select = output<string>();

  readonly primaryHex = computed(() => oklchToHex(this.preset().previewColors.primary));
  readonly secondaryHex = computed(() => oklchToHex(this.preset().previewColors.secondary));

  readonly classes = computed(() =>
    mergeClasses(
      'flex cursor-pointer items-center gap-2 rounded-md border p-2 transition-colors hover:bg-accent',
      this.isActive() && 'border-primary bg-accent',
    ),
  );
}
