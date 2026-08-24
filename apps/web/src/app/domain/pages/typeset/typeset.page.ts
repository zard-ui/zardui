import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { TypesetCodePanelComponent } from './components/typeset-code-panel/typeset-code-panel.component';
import { TypesetCustomizerComponent } from './components/typeset-customizer/typeset-customizer.component';
import { TypesetPreviewComponent } from './components/typeset-preview/typeset-preview.component';
import { TypesetGeneratorService } from './services/typeset-generator.service';

@Component({
  selector: 'app-typeset-page',
  standalone: true,
  imports: [TypesetCustomizerComponent, TypesetPreviewComponent, TypesetCodePanelComponent],
  // The service holds the state that lives in this route's URL; scoping it to the
  // page keeps it from outliving a navigation and coming back with old choices.
  providers: [TypesetGeneratorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './typeset.page.html',
  styleUrl: './typeset-fonts.css',
})
export class TypesetPage implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Typeset generator',
      'Pick the fonts and the rhythm for your prose, see it applied to real content, and take away the CSS, the font install commands and the preset.',
      '/typeset',
      'og-typeset-generator.jpg',
    );
  }
}
