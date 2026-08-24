import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { TypesetGeneratorService } from '../../services/typeset-generator.service';

/**
 * The styled prose itself, measure and all.
 *
 * No iframe: the variables ride on the container as an inline `style`, which is
 * synchronous, survives prerendering, and keeps the preview reading the site's
 * own theme tokens for colour and radius. The builder frames it in a card; the
 * standalone route renders it on the bare page.
 */
@Component({
  selector: 'app-typeset-surface',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="mx-auto" [style.max-width]="service.measureWidth()">
      <div class="typeset" [style]="service.previewStyles()" [innerHTML]="html()"></div>
    </div>
  `,
})
export class TypesetSurfaceComponent {
  protected readonly service = inject(TypesetGeneratorService);
  private readonly sanitizer = inject(DomSanitizer);

  /*
   * The fixtures are constants of this repository, not user input. The default
   * sanitizer strips `details`, `summary` and the `align` attributes of tables —
   * exactly the elements the preview exists to demonstrate.
   */
  protected readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.service.fixture().html),
  );
}
