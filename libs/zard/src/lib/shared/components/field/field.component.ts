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

import {
  fieldContentVariants,
  fieldDescriptionVariants,
  fieldErrorVariants,
  fieldGroupVariants,
  fieldLabelVariants,
  fieldLegendVariants,
  fieldSeparatorVariants,
  fieldSetVariants,
  fieldTitleVariants,
  fieldVariants,
  type ZardFieldLegendVariants,
  type ZardFieldOrientationVariants,
} from './field.variants';

@Component({
  selector: 'z-field-set, fieldset[z-field-set]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-set',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldSet',
})
export class ZardFieldSetComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldSetVariants(), this.class()));
}

@Component({
  selector: 'z-field-legend, legend[z-field-legend]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-legend',
    '[attr.data-variant]': 'zVariant()',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldLegend',
})
export class ZardFieldLegendComponent {
  readonly zVariant = input<ZardFieldLegendVariants>('legend');
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldLegendVariants(), this.class()));
}

@Component({
  selector: 'z-field-group, [z-field-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-group',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldGroup',
})
export class ZardFieldGroupComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldGroupVariants(), this.class()));
}

@Component({
  selector: 'z-field, [z-field]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'field',
    '[attr.data-orientation]': 'zOrientation()',
    '[class]': 'classes()',
  },
  exportAs: 'zField',
})
export class ZardFieldComponent {
  readonly zOrientation = input<ZardFieldOrientationVariants>('vertical');
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(fieldVariants({ zOrientation: this.zOrientation() }), this.class()),
  );
}

@Component({
  selector: 'z-field-content, [z-field-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-content',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldContent',
})
export class ZardFieldContentComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldContentVariants(), this.class()));
}

@Component({
  selector: 'z-field-label, label[z-field-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-label',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldLabel',
})
export class ZardFieldLabelComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldLabelVariants(), this.class()));
}

@Component({
  selector: 'z-field-title, [z-field-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-label',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldTitle',
})
export class ZardFieldTitleComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldTitleVariants(), this.class()));
}

@Component({
  selector: 'z-field-description, p[z-field-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-description',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldDescription',
})
export class ZardFieldDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-field-separator',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    <div class="bg-border absolute inset-0 top-1/2 h-px"></div>
    @let content = zContent();
    @if (content) {
      <span
        class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
        data-slot="field-separator-content"
      >
        <ng-container *zStringTemplateOutlet="content">{{ content }}</ng-container>
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'field-separator',
    '[attr.data-content]': '!!zContent()',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldSeparator',
})
export class ZardFieldSeparatorComponent {
  readonly zContent = input<string | TemplateRef<void>>('');
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(fieldSeparatorVariants(), this.class()));
}

export interface ZardFieldErrorEntry {
  message?: string;
}

@Component({
  selector: 'z-field-error',
  template: `
    @let errs = uniqueErrors();
    @if (errs.length === 1) {
      {{ errs[0].message }}
    } @else if (errs.length > 1) {
      <ul class="ml-4 flex list-disc flex-col gap-1">
        @for (error of errs; track $index) {
          @if (error.message) {
            <li>{{ error.message }}</li>
          }
        }
      </ul>
    } @else {
      <ng-content />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'alert',
    'data-slot': 'field-error',
    '[class]': 'classes()',
  },
  exportAs: 'zFieldError',
})
export class ZardFieldErrorComponent {
  readonly zErrors = input<ReadonlyArray<ZardFieldErrorEntry | undefined>>([]);
  readonly class = input<ClassValue>('');

  protected readonly uniqueErrors = computed(() => {
    const errs = this.zErrors();
    if (!errs?.length) return [] as ZardFieldErrorEntry[];
    const map = new Map<string | undefined, ZardFieldErrorEntry>();
    for (const e of errs) {
      if (!e) continue;
      map.set(e.message, e);
    }
    return [...map.values()];
  });

  protected readonly classes = computed(() => mergeClasses(fieldErrorVariants(), this.class()));
}
