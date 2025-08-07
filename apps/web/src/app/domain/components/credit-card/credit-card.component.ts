import { Component, input } from '@angular/core';

export interface CreditItem {
  title: string;
  description: string;
}

@Component({
  selector: 'z-credit-card',
  standalone: true,
  template: `
    <div class="rounded-lg border bg-muted/30 p-6 sm:p-8">
      <h3 class="text-base sm:text-lg font-semibold mb-3">{{ title() }}</h3>
      <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {{ description() }}
      </p>
    </div>
  `,
})
export class CreditCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
