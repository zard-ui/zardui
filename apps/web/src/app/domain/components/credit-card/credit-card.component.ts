import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface CreditItem {
  title: string;
  description: string;
  url?: string;
  author?: string;
  authorUrl?: string;
}

@Component({
  selector: 'z-credit-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()">
      <h3 class="mb-3 text-base font-semibold sm:text-lg">
        @if (url(); as href) {
          <!-- Stretched link: keeps the whole card clickable without nesting anchors,
               so the author credit below can stay a link of its own. -->
          <a
            [href]="href"
            target="_blank"
            rel="noopener noreferrer"
            class="after:absolute after:inset-0 hover:underline"
          >
            {{ title() }}
          </a>
        } @else {
          {{ title() }}
        }
      </h3>

      <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
        {{ description() }}
      </p>

      @if (author(); as authorName) {
        <p class="text-muted-foreground mt-3 text-xs">
          Maintained by
          @if (authorUrl(); as authorHref) {
            <a
              [href]="authorHref"
              target="_blank"
              rel="noopener noreferrer"
              class="text-foreground relative z-10 font-medium hover:underline"
            >
              {{ authorName }}
            </a>
          } @else {
            <span class="text-foreground font-medium">{{ authorName }}</span>
          }
        </p>
      }
    </div>
  `,
})
export class CreditCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly url = input<string>();
  readonly author = input<string>();
  readonly authorUrl = input<string>();

  protected readonly cardClasses = computed(() =>
    [
      'bg-muted/30 relative rounded-lg border p-6 transition-colors sm:p-8',
      this.url() ? 'hover:bg-muted/60 hover:border-foreground/20' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
