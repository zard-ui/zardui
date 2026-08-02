import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NEXT_STEPS } from '../../data/troubleshooting.data';
import { InlineCodePipe } from '../../pipes/inline-code.pipe';

@Component({
  selector: 'z-theming-next-steps',
  standalone: true,
  imports: [RouterLink, InlineCodePipe],
  template: `
    <ul class="grid list-none gap-3 sm:grid-cols-2">
      @for (step of steps; track step.href) {
        <li>
          <a
            [routerLink]="step.href"
            class="hover:bg-muted/50 focus-visible:outline-ring flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            <span class="text-sm font-semibold sm:text-base">{{ step.title }}</span>
            <span class="text-muted-foreground text-xs sm:text-sm" [innerHTML]="step.description | inlineCode"></span>
          </a>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingNextStepsComponent {
  readonly steps = NEXT_STEPS;
}
