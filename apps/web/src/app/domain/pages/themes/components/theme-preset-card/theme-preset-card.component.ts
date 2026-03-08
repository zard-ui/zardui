import { ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';

import { ZardIconRegistry } from '@zard/core';

import { mergeClasses } from '@/shared/utils/merge-classes';

import type { ThemePreset } from '../../models/theme.model';
import { oklchToHex } from '../../utils/oklch-converter';

@Component({
  selector: 'app-theme-preset-card',
  standalone: true,
  imports: [NgIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '(click)': 'select.emit(preset().name)',
  },
  template: `
    <div class="flex items-center gap-1.5">
      <div
        class="size-4 rounded-full ring-1 ring-black/10 dark:ring-white/10"
        [style.background-color]="primaryHex()"
      ></div>
      <div
        class="size-4 rounded-full ring-1 ring-black/10 dark:ring-white/10"
        [style.background-color]="secondaryHex()"
      ></div>
    </div>
    <span class="text-foreground flex-1 truncate text-xs font-medium">{{ preset().name }}</span>
    @if (isActive()) {
      <ng-icon name="check" class="text-primary size-3.5! shrink-0" />
    }
  `,
  viewProviders: [provideIcons({ check: ZardIconRegistry.check })],
})
export class ThemePresetCardComponent {
  readonly preset = input.required<ThemePreset>();
  readonly isActive = input<boolean>(false);
  readonly select = output<string>();

  readonly primaryHex = computed(() => oklchToHex(this.preset().previewColors.primary));
  readonly secondaryHex = computed(() => oklchToHex(this.preset().previewColors.secondary));

  readonly classes = computed(() =>
    mergeClasses(
      'flex cursor-pointer items-center gap-2.5 rounded-lg border bg-white/50 p-2.5 transition-all hover:bg-accent hover:shadow-sm dark:bg-white/5',
      this.isActive() && 'border-primary bg-primary/5 ring-1 ring-primary/20',
    ),
  );
}
