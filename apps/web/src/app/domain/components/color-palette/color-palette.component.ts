import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';

import { ColorPalette } from '../../../shared/constants/colors.constant';
import { ColorsService } from '../../../shared/services/colors.service';
import { ColorCardComponent } from '../color-card/color-card.component';
import { ColorFormatSelectorComponent } from '../color-format-selector/color-format-selector.component';

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
