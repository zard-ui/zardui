import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-spinner',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let icon = zIcon();
    @if (icon) {
      <ng-container *zStringTemplateOutlet="icon; context: iconContext()" />
    } @else {
      <svg
        data-slot="spinner"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="classes()"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'inline-flex',
    role: 'status',
    'aria-label': 'Loading',
  },
  exportAs: 'zSpinner',
})
export class ZardSpinnerComponent {
  readonly class = input<ClassValue>('');
  readonly zIcon = input<TemplateRef<{ $implicit: string }> | undefined>(undefined);

  protected readonly classes = computed(() => mergeClasses('size-4 animate-spin', this.class()));
  protected readonly iconContext = computed(() => ({ $implicit: this.classes() }));
}
