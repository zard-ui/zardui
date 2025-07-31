### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">card.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { cardBodyVariants, cardHeaderVariants, cardVariants } from './card.variants';

@Component({
  selector: 'z-card',
  exportAs: 'zCard',
  standalone: true,
  imports: [ZardStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (zTitle()) {
      <div [class]="headerClasses()">
        <div class="text-2xl font-semibold leading-none tracking-tight">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>

        @if (zDescription()) {
          <div class="text-sm text-muted-foreground">
            <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
          </div>
        }
      </div>
    }

    <div [class]="bodyClasses()">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardCardComponent {
  readonly zTitle = input<string | TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>();

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
  protected readonly headerClasses = computed(() => mergeClasses(cardHeaderVariants()));
  protected readonly bodyClasses = computed(() => mergeClasses(cardBodyVariants()));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">card.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const cardVariants = cva('block rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6', {
  variants: {},
});
export type ZardCardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva('flex flex-col space-y-1.5 pb-0 gap-1.5', {
  variants: {},
});
export type ZardCardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardBodyVariants = cva('block mt-6', {
  variants: {},
});
export type ZardCardBodyVariants = VariantProps<typeof cardBodyVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">index.ts

```angular-ts showLineNumbers
export * from './card.component';
export * from './card.module';

```

