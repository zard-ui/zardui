import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon } from '@ng-icons/core';

/** Index-page card linking to one form guide. Mirrors `z-env-card` on the installation page. */
@Component({
  selector: 'z-form-approach-card',
  imports: [NgIcon, RouterLink],
  template: `
    <a [routerLink]="available() ? path() : null" [class]="cardClasses()">
      <ng-icon [name]="icon()" class="text-foreground !size-14" />
      <p class="mt-2 font-medium first-letter:uppercase">{{ name() }}</p>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormApproachCardComponent {
  readonly name = input.required<string>();
  readonly icon = input.required<string>();
  readonly path = input.required<string>();
  readonly available = input(true);

  protected cardClasses(): string {
    // `h-full` keeps every card the same height when a longer name wraps to two lines.
    const baseClasses =
      'flex h-full w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors sm:p-10';

    if (!this.available()) {
      return `${baseClasses} cursor-not-allowed`;
    }

    return `${baseClasses} cursor-pointer hover:bg-muted/50`;
  }
}
