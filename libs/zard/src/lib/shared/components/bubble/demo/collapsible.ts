import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

const TEXT = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

const PREVIEW_LENGTH = 180;

@Component({
  selector: 'z-demo-bubble-collapsible',
  host: { class: 'contents' },
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>How can I help you today?</z-bubble-content>
      </z-bubble>

      <z-bubble zVariant="muted" zAlign="end">
        <z-bubble-content class="whitespace-pre-line">
          <div id="bubble-collapsible-text">{{ visibleText() }}</div>
          @if (isLong) {
            <button
              type="button"
              z-button
              zType="link"
              class="text-muted-foreground gap-1 p-0"
              aria-controls="bubble-collapsible-text"
              [attr.aria-expanded]="open()"
              (click)="open.set(!open())"
            >
              {{ open() ? 'Show less' : 'Show more' }}
              <ng-icon
                name="lucideChevronDown"
                data-icon="inline-end"
                class="transition-transform"
                [class.rotate-180]="open()"
              />
            </button>
          }
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
})
export class ZardDemoBubbleCollapsibleComponent {
  protected readonly open = signal(false);
  protected readonly isLong = TEXT.length > PREVIEW_LENGTH;
  protected readonly visibleText = computed(() =>
    this.open() || !this.isLong ? TEXT : `${TEXT.slice(0, PREVIEW_LENGTH)}...`,
  );
}
