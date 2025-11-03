import { Component, input } from '@angular/core';

export interface CreditItem {
  title: string;
  description: string;
}

@Component({
  selector: 'z-credit-card',
  standalone: true,
  template: `
    <div class="bg-muted/30 rounded-lg border p-6 sm:p-8">
      <h3 class="mb-3 text-base font-semibold sm:text-lg">{{ title() }}</h3>
      <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
        {{ description() }}
      </p>
    </div>
  `,
})
export class CreditCardComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
