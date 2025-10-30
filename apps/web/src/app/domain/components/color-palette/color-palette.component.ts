import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { ColorCardComponent } from '../color-card/color-card.component';
import { ColorFormatSelectorComponent } from '../color-format-selector/color-format-selector.component';

import { ColorPalette } from '@zard/shared/constants/colors.constant';
import { ColorsService } from '@zard/shared/services/colors.service';

@Component({
  selector: 'z-color-palette',
  standalone: true,
  imports: [ColorCardComponent, ColorFormatSelectorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-palette.component.html',
})
export class ColorPaletteComponent {
  private readonly colorsService = inject(ColorsService);

  readonly palette = input.required<ColorPalette>();
  readonly currentFormat = this.colorsService.format;
}
