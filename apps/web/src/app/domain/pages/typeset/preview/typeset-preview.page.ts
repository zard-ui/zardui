import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { TypesetSurfaceComponent } from '../components/typeset-surface/typeset-surface.component';
import { TypesetGeneratorService } from '../services/typeset-generator.service';

/**
 * The preset on a bare page, for reading it the way a reader would.
 *
 * The builder frames the prose in a card between two panels, which is the one
 * thing a typography preview cannot be judged inside. This route drops the
 * chrome and keeps the same query string, so the "Open in New Tab" link is the
 * same preset at full width.
 */
@Component({
  selector: 'z-typeset-preview-page',
  standalone: true,
  imports: [TypesetSurfaceComponent],
  providers: [TypesetGeneratorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--
      overflow-x-auto, same reasoning as the builder's own preview card: this
      route has no code panel or customizer squeezing it, but a chosen measure
      can still be wider than a narrow phone, and content the CSS can't wrap
      (a table cell's unbroken code token, an unwrapped &lt;pre&gt;) must not be
      allowed to grow the page itself — it scrolls in place instead.
    -->
    <main class="overflow-x-auto px-6 py-16">
      <z-typeset-surface />
    </main>
  `,
  styleUrl: '../typeset-fonts.css',
})
export class TypesetPreviewPage implements OnInit {
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Typeset preview',
      'The typeset preset from the builder, rendered on a page of its own.',
      '/typeset/preview',
      'og-typeset-generator.jpg',
    );
  }
}
