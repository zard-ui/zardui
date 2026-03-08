

```angular-ts title="alert.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { ZardIconRegistry, type ZardIconName } from '@/shared/core/icons-registry';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  alertDescriptionVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  type ZardAlertTypeVariants,
} from './alert.variants';

@Component({
  selector: 'z-alert, [z-alert]',
  imports: [NgIcon, ZardStringTemplateOutletDirective],
  template: `
    @if (zIcon() || iconName()) {
      <span [class]="iconClasses()" data-slot="alert-icon">
        <ng-container *zStringTemplateOutlet="zIcon()">
          <ng-icon [name]="iconName()" class="size-4!" />
        </ng-container>
      </span>
    }

    <div class="flex-1">
      @if (zTitle()) {
        <div [class]="titleClasses()" data-slot="alert-title">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>
      }

      @if (zDescription()) {
        <div [class]="descriptionClasses()" data-slot="alert-description">
          <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ circleAlert: ZardIconRegistry['circle-alert'] })],
  host: {
    role: 'alert',
    '[class]': 'classes()',
    '[attr.data-slot]': '"alert"',
  },
  exportAs: 'zAlert',
})
export class ZardAlertComponent {
  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>('');
  readonly zDescription = input<string | TemplateRef<void>>('');
  readonly zIcon = input<TemplateRef<void> | ZardIconName>();
  readonly zType = input<ZardAlertTypeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType() }), this.class()));

  protected readonly iconClasses = computed(() => alertIconVariants());

  protected readonly titleClasses = computed(() => alertTitleVariants());

  protected readonly descriptionClasses = computed(() => alertDescriptionVariants({ zType: this.zType() }));

  protected readonly shouldShowIcon = computed(() => this.zIcon() !== undefined || this.zType() === 'destructive');

  protected readonly iconName = computed((): ZardIconName | undefined => {
    const customIcon = this.zIcon();
    if (customIcon && !(customIcon instanceof TemplateRef)) {
      return customIcon;
    }

    if (this.zType() === 'destructive') {
      return 'circle-alert';
    }

    return undefined;
  });
}

```



```angular-ts title="alert.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('relative w-full rounded-lg border px-4 py-3 text-sm flex items-center gap-3', {
  variants: {
    zType: {
      default: 'bg-card text-card-foreground',
      destructive: 'text-destructive bg-card',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export const alertIconVariants = cva('shrink-0 self-start text-base!');

export const alertTitleVariants = cva('font-medium tracking-tight leading-none');

export const alertDescriptionVariants = cva('text-sm/relaxed mt-1', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      destructive: 'text-destructive/90',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardAlertTypeVariants = NonNullable<VariantProps<typeof alertVariants>['zType']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './alert.component';
export * from './alert.variants';

```

