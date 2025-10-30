import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ZardSelectComponent } from '@zard/components/select/select.component';
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';

import { ColorsService, ColorFormat } from '@zard/shared/services/colors.service';
import { COLOR_FORMATS } from '@zard/shared/constants/colors.constant';

@Component({
  selector: 'z-color-format-selector',
  standalone: true,
  imports: [ZardSelectComponent, ZardSelectItemComponent, ZardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-format-selector.component.html',
})
export class ColorFormatSelectorComponent {
  private readonly colorsService = inject(ColorsService);

  readonly formats = COLOR_FORMATS;
  readonly currentFormat = this.colorsService.format;
  readonly isLoading = this.colorsService.isLoading;

  readonly getCurrentFormatLabel = () => {
    const format = this.currentFormat();
    return this.formats.find(f => f.value === format)?.label || 'Format';
  };

  onFormatChange(format: ColorFormat): void {
    this.colorsService.setFormat(format);
  }
}
