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

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { generateId, mergeClasses } from '@/shared/utils/merge-classes';

import { cardBodyVariants, cardFooterVariants, cardHeaderVariants, cardVariants } from './card.variants';
import { ZardButtonComponent } from '../button';

@Component({
  selector: 'z-card',
  imports: [ZardStringTemplateOutletDirective, ZardButtonComponent],
  template: `
    @let title = zTitle();
    @if (title) {
      <div [class]="headerClasses()" data-slot="card-header">
        <div class="leading-none font-semibold" [id]="titleId()" data-slot="card-title">
          <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
        </div>

        @let description = zDescription();
        @if (description) {
          <div class="text-muted-foreground text-sm" [id]="descriptionId()" data-slot="card-description">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'region',
    'data-slot': 'card',
    '[class]': 'classes()',
    '[attr.aria-labelledby]': 'titleId() || null',
    '[attr.aria-describedby]': 'descriptionId() || null',
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

  protected readonly descriptionId = computed(() => (this.zDescription() ? generateId('card-description') : ''));
  protected readonly titleId = computed(() => (this.zTitle() ? generateId('card-title') : ''));
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
