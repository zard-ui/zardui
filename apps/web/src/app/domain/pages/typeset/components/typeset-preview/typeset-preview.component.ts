import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';

import { ZardTooltipImports } from '@zard/components/tooltip/tooltip.imports';

import { TypesetGeneratorService } from '../../services/typeset-generator.service';

/**
 * The preview, styled by the same stylesheet the consumer installs.
 *
 * No iframe: the variables ride on the container as an inline `style`, which is
 * synchronous, survives prerendering, and keeps the preview reading the site's
 * own theme tokens for colour and radius.
 */
@Component({
  selector: 'app-typeset-preview',
  standalone: true,
  imports: [ZardTooltipImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full overflow-y-auto' },
  template: `
    <div class="border-b px-4 py-3 sm:px-6">
      <div class="flex flex-wrap items-center gap-1.5">
        @for (fixture of service.fixtures; track fixture.id) {
          <button
            type="button"
            class="focus-visible:ring-ring rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            [class.bg-primary]="fixture.id === service.state().item"
            [class.text-primary-foreground]="fixture.id === service.state().item"
            [class.border-transparent]="fixture.id === service.state().item"
            [class.text-muted-foreground]="fixture.id !== service.state().item"
            [class.hover:bg-muted]="fixture.id !== service.state().item"
            [attr.aria-pressed]="fixture.id === service.state().item"
            [zTooltip]="fixture.description"
            (click)="service.setItem(fixture.id)"
          >
            {{ fixture.label }}
          </button>
        }
      </div>
    </div>

    <div class="px-4 py-8 sm:px-6 sm:py-12">
      <div class="mx-auto" [style.max-width]="service.measureWidth()">
        <div class="typeset" [style]="service.previewStyles()" [innerHTML]="html()"></div>
      </div>
    </div>
  `,
})
export class TypesetPreviewComponent {
  protected readonly service = inject(TypesetGeneratorService);
  private readonly sanitizer = inject(DomSanitizer);

  /*
   * Os fixtures são constantes do próprio repositório, não entrada de usuário.
   * O sanitizador padrão remove `details`, `summary` e os atributos `align` das
   * tabelas — exatamente os elementos que a prévia existe para demonstrar.
   */
  protected readonly html = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.service.fixture().html),
  );
}
