import { Component, inject, ChangeDetectionStrategy, input, computed } from '@angular/core';

import { COLOR_FORMATS, type Color } from '@doc/shared/constants/colors.constant';
import { ColorsService, ColorFormat } from '@doc/shared/services/colors.service';

import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';

@Component({
  selector: 'z-color-format-selector',
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-format-selector.component.html',
})
export class ColorFormatSelectorComponent {
  private readonly colorsService = inject(ColorsService);

  readonly firstColor = input<Color | null>(null);

  readonly formats = COLOR_FORMATS;
  readonly currentFormat = this.colorsService.format;
  readonly isLoading = this.colorsService.isLoading;

  readonly getCurrentFormatLabel = computed(() => {
    const format = this.currentFormat();
    return this.formats.find(f => f.value === format)?.label || 'Format';
  });

  readonly getFormatExample = computed(() => (format: ColorFormat): string => {
    const color = this.firstColor();
    if (!color) return this.formats.find(f => f.value === format)?.example || '';

    switch (format) {
      case 'class':
        return color.className;
      case 'hex':
        return color.hex;
      case 'rgb':
        return color.rgb;
      case 'hsl':
        return color.hsl;
      case 'oklch':
        return color.oklch;
      case 'var':
        return color.var;
      default:
        return color.hsl;
    }
  });

  onFormatChange(format: ColorFormat): void {
    this.colorsService.setFormat(format);
  }
}
