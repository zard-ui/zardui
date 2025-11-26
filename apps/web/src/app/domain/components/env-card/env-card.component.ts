import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-env-card',
  template: `
    <a [routerLink]="disabled() ? null : path()" [class]="cardClasses()">
      <img [src]="'images/envs/' + icon()" class="h-14 w-14 invert-0 dark:invert" [alt]="name() + 'logo'" />
      <p class="mt-2 font-medium first-letter:uppercase">{{ name() }}</p>
    </a>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class EnvCardComponent {
  readonly name = input('');
  readonly icon = input('');
  readonly path = input('');
  readonly disabled = input(false);

  protected cardClasses() {
    const baseClasses =
      'flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors sm:p-10';

    if (this.disabled()) {
      return `${baseClasses} cursor-not-allowed`;
    }

    return `${baseClasses} cursor-pointer hover:bg-muted/50`;
  }
}
