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
    <main class="px-6 py-16">
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
