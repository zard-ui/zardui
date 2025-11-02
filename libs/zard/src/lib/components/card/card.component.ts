import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { cardBodyVariants, cardHeaderVariants, cardVariants } from './card.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';

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
        <div class="text-2xl leading-none font-semibold tracking-tight">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>

        @if (zDescription()) {
          <div class="text-muted-foreground text-sm">
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
