

```angular-ts title="card.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '@/shared/utils/merge-classes';

import { cardBodyVariants, cardFooterVariants, cardHeaderVariants, cardVariants } from './card.variants';

@Component({
  selector: 'z-card',
  imports: [ZardStringTemplateOutletDirective, ZardButtonComponent],
  template: `
    @let title = zTitle();
    @if (title) {
      <div [class]="headerClasses()" data-slot="card-header">
        <div class="leading-none font-semibold" [id]="titleId" data-slot="card-title">
          <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
        </div>

        @let description = zDescription();
        @if (description) {
          <div class="text-muted-foreground text-sm" [id]="descriptionId" data-slot="card-description">
            <ng-container *zStringTemplateOutlet="description">{{ description }}</ng-container>
          </div>
        }

        @let action = zAction();
        @if (action) {
          <button
            z-button
            type="button"
            zType="link"
            class="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
            data-slot="card-action"
            (click)="onClick()"
          >
            {{ action }}
          </button>
        }
      </div>
    }

    <div [class]="bodyClasses()" data-slot="card-content">
      <ng-content />
    </div>

    <div [class]="footerClasses()" data-slot="card-footer">
      <ng-content select="[card-footer]" />
    </div>
  `,
  styles: `
    [data-slot='card-footer']:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'card',
    '[class]': 'classes()',
    '[attr.aria-labelledby]': 'zTitle() ? titleId : null',
    '[attr.aria-describedby]': 'zDescription() ? descriptionId : null',
  },
  exportAs: 'zCard',
})
export class ZardCardComponent {
  readonly class = input<ClassValue>('');
  readonly zFooterBorder = input(false);
  readonly zHeaderBorder = input(false);
  readonly zAction = input('');
  readonly zDescription = input<string | TemplateRef<void>>();
  readonly zTitle = input<string | TemplateRef<void>>();

  readonly zActionClick = output<void>();

  protected readonly titleId = generateId('card-title');
  protected readonly descriptionId = generateId('card-description');

  protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));
  protected readonly bodyClasses = computed(() => mergeClasses(cardBodyVariants()));
  protected readonly footerClasses = computed(() =>
    mergeClasses(cardFooterVariants(), this.zFooterBorder() ? 'border-t' : ''),
  );

  protected readonly headerClasses = computed(() =>
    mergeClasses(cardHeaderVariants(), this.zHeaderBorder() ? 'border-b' : ''),
  );

  protected onClick(): void {
    this.zActionClick.emit();
  }
}

```



```angular-ts title="card.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const cardVariants = cva('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm');

export const cardHeaderVariants = cva(
  mergeClasses(
    '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6',
    'has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
  ),
);

export const cardActionVariants = cva('col-start-2 row-span-2 row-start-1 self-start justify-self-end');

export const cardBodyVariants = cva('px-6');

export const cardFooterVariants = cva('flex flex-col gap-2 items-center px-6 [.border-t]:pt-6');

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './card.component';
export * from './card.variants';

```

