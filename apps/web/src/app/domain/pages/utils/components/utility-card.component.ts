import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

/**
 * Index-page card linking to one utility. Mirrors `z-form-approach-card` on the forms index.
 *
 * The link wraps the name only, and covers the card through an `after` pseudo-element.
 * Wrapping the summary too would fold it into the link text of the generated
 * `public/docs/utils.md`, which is built from this page's prerendered HTML.
 */
@Component({
  selector: 'z-utility-card',
  imports: [NgIcon, RouterLink],
  template: `
    <div
      class="bg-card text-card-foreground hover:bg-muted/50 relative flex h-full w-full flex-col gap-2 rounded-xl border p-6 shadow transition-colors"
    >
      <ng-icon [name]="icon()" class="text-foreground !size-8" />
      <a [routerLink]="path()" class="mt-2 font-medium after:absolute after:inset-0">{{ name() }}</a>
      <p class="text-muted-foreground text-sm leading-relaxed">{{ summary() }}</p>
    </div>
  `,
  host: { class: 'block h-full' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilityCardComponent {
  readonly name = input.required<string>();
  readonly summary = input.required<string>();
  readonly icon = input.required<string>();
  readonly path = input.required<string>();
}
