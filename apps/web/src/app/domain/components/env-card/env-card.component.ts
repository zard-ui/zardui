import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-env-card',
  template: `
    <a
      [routerLink]="path()"
      class="cursor-pointer flex w-full flex-col items-center rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:bg-muted/50 sm:p-10"
    >
      <img [src]="'images/envs/' + icon()" class="h-14 w-14 dark:invert invert-0" [alt]="name() + 'logo'" />
      <p class="font-medium mt-2 first-letter:uppercase">{{ name() }}</p>
    </a>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class EnvCardComponent {
  readonly name = input('');
  readonly icon = input('');
  readonly path = input('');
}
