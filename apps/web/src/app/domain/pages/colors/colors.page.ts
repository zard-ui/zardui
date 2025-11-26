import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ColorPaletteComponent } from '@doc/domain/components/color-palette/color-palette.component';
import { COLOR_PALETTES } from '@doc/shared/constants/colors.constant';
import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '../../../../../../../libs/zard/button/button.component';

@Component({
  selector: 'z-colors',
  standalone: true,
  imports: [ZardButtonComponent, ColorPaletteComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './colors.page.html',
})
export class ColorsPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);
  readonly palettes = COLOR_PALETTES;

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Tailwind Colors in Every Format',
      'The complete Tailwind color palette in HEX, RGB, HSL, CSS variables, and classes. Ready to copy and paste into your project.',
      '/colors',
      'og-colors.jpg',
    );
  }
}
