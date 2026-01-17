import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  type TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardIdDirective, ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { cardBodyVariants, cardFooterVariants, cardHeaderVariants, cardVariants } from './card.variants';

@Component({
  selector: 'z-card',
  imports: [ZardStringTemplateOutletDirective, ZardButtonComponent, ZardIdDirective],
  template: `
    <ng-container zardId="card" #z="zardId">
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
    </ng-container>
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
    '[attr.aria-labelledby]': 'titleId()',
    '[attr.aria-describedby]': 'descriptionId()',
  },
  exportAs: 'zCard',
})
export class ZardCardComponent {
  private readonly generatedId = viewChild<ZardIdDirective>('z');

  readonly class = input<ClassValue>('');
  readonly zFooterBorder = input(false);
  readonly zHeaderBorder = input(false);
  readonly zAction = input('');
  readonly zDescription = input<string | TemplateRef<void>>();
  readonly zTitle = input<string | TemplateRef<void>>();

  readonly zActionClick = output<void>();

  protected readonly titleId = computed(() => {
    const baseId = this.generatedId()?.id();
    return this.zTitle() && baseId ? `${baseId}-title` : null;
  });

  protected readonly descriptionId = computed(() => {
    const baseId = this.generatedId()?.id();
    return this.zDescription() && baseId ? `${baseId}-description` : null;
  });

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
