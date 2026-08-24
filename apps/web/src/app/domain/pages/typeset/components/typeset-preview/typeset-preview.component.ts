import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';

import { ZardTooltipImports } from '@zard/components/tooltip/tooltip.imports';

import { TypesetGeneratorService } from '../../services/typeset-generator.service';
import { TypesetSurfaceComponent } from '../typeset-surface/typeset-surface.component';

/**
 * The framed preview: the prose in a card, with the sample switcher floating
 * over it.
 *
 * The switcher is numbered rather than named because it sits on top of the
 * text it is switching — six words there would read as part of the sample. The
 * name stays in the tooltip and in the accessible name.
 */
@Component({
  selector: 'app-typeset-preview',
  standalone: true,
  imports: [NgIcon, TypesetSurfaceComponent, ZardTooltipImports],
  providers: [provideIcons({ lucideExternalLink })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
  template: `
    <div
      class="bg-background ring-foreground/10 relative isolate flex h-full flex-col overflow-hidden rounded-2xl ring-1"
    >
      <div class="min-h-0 flex-1 overflow-y-auto px-6 py-10 sm:px-10 sm:py-16">
        <app-typeset-surface />

        <!-- The switcher floats over the end of the text; without this the last line sits behind it. -->
        <div class="h-16" aria-hidden="true"></div>
      </div>

      <div class="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-1.5">
        <div class="bg-card/90 flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl">
          @for (fixture of service.fixtures; track fixture.id; let index = $index) {
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[active=true]:bg-accent data-[active=true]:text-accent-foreground h-7 min-w-7 rounded-lg px-2 text-xs font-medium tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none"
              [attr.data-active]="fixture.id === service.state().item"
              [attr.aria-pressed]="fixture.id === service.state().item"
              [attr.aria-label]="fixture.label"
              [zTooltip]="fixture.description"
              (click)="service.setItem(fixture.id)"
            >
              {{ ordinal(index) }}
            </button>
          }
        </div>

        <!-- Its own pill: the link leaves the preview, the numbers only swap it. -->
        <div class="bg-card/90 flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl">
          <a
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
            target="_blank"
            rel="noopener"
            [href]="standaloneUrl()"
          >
            <!-- No room for the phrase on a phone, so it keeps the icon and the desktop keeps the words. -->
            <span class="max-md:sr-only">Open in New Tab</span>
            <ng-icon name="lucideExternalLink" class="size-3.5 md:hidden" />
          </a>
        </div>
      </div>
    </div>
  `,
})
export class TypesetPreviewComponent {
  protected readonly service = inject(TypesetGeneratorService);

  /*
   * Built by hand rather than with `routerLink`: `target="_blank"` makes the
   * browser open the href, and the builder state only exists in the query string.
   */
  protected readonly standaloneUrl = computed(() => `/typeset/preview${this.service.queryString()}`);

  protected ordinal(index: number): string {
    return String(index + 1).padStart(2, '0');
  }
}
