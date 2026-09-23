import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  inject,
  ViewEncapsulation,
  type OnDestroy,
  type OnInit,
} from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { TypesetCodePanelComponent } from './components/typeset-code-panel/typeset-code-panel.component';
import { TypesetCustomizerComponent } from './components/typeset-customizer/typeset-customizer.component';
import { TypesetPreviewComponent } from './components/typeset-preview/typeset-preview.component';
import { TypesetGeneratorService } from './services/typeset-generator.service';

/** Defined in the global stylesheet, next to the other scrollbar utilities. */
const SCROLL_LOCK_CLASS = 'scroll-locked';

@Component({
  selector: 'z-typeset-page',
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
export class TypesetPage implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly seoService = inject(SeoService);
  private readonly viewportScroller = inject(ViewportScroller);

  /*
   * The lock rides the component's own lifetime rather than a router
   * subscription: whichever way the page leaves — a link, the back button, a
   * hard navigation — the page is destroyed, and the document scrolls again.
   */
  ngOnInit(): void {
    this.document.documentElement.classList.add(SCROLL_LOCK_CLASS);

    this.viewportScroller.scrollToPosition([0, 0]);
    this.seoService.setDocsSeo(
      'Typeset',
      'Pick the fonts and the rhythm for your prose, see it applied to real content, and take away the CSS, the font install commands and the preset.',
      '/typeset',
      'og-typeset-generator.jpg',
    );
  }

  ngOnDestroy(): void {
    this.document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  }
}
