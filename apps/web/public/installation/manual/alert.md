

```angular-ts title="alert.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { alertVariants, type ZardAlertVariants } from './alert.variants';
import { ZardIconComponent } from '../icon/icon.component';
import { mergeClasses } from '../../shared/utils/utils';
import type { ZardIcon } from '../icon/icons';

@Component({
  selector: 'z-alert',
  standalone: true,
  imports: [ZardIconComponent],
  exportAs: 'zAlert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (iconName()) {
      <z-icon [zType]="iconName()!" />
    }

    <div class="flex flex-col gap-1 w-full">
      <h5 class="font-medium leading-none tracking-tight mt-1">{{ zTitle() }}</h5>
      <span class="text-sm leading-[1.625]">{{ zDescription() }}</span>
    </div>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.data-type]': 'zType()',
    '[attr.data-appearance]': 'zAppearance()',
  },
})
export class ZardAlertComponent {
  readonly class = input<ClassValue>('');
  readonly zTitle = input.required<string>();
  readonly zDescription = input.required<string>();
  readonly zIcon = input<ZardIcon>();
  readonly zType = input<ZardAlertVariants['zType']>('default');
  readonly zAppearance = input<ZardAlertVariants['zAppearance']>('outline');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType(), zAppearance: this.zAppearance() }), this.class()));

  protected readonly iconsType: Record<NonNullable<ZardAlertVariants['zType']>, ZardIcon | ''> = {
    default: '',
    info: 'info',
    success: 'circle-check',
    warning: 'triangle-alert',
    error: 'circle-x',
  };

  protected readonly iconName = computed((): ZardIcon | null => {
    const customIcon = this.zIcon();
    if (customIcon) return customIcon;

    const typeIcon = this.iconsType[this.zType() ?? 'default'];
    return typeIcon || null;
  });
}

```



```angular-ts title="alert.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('relative flex gap-2 w-full rounded-lg p-4', {
  variants: {
    zType: {
      default: 'dark:data-[appearance="soft"]:text-zinc-800 data-[appearance="fill"]:text-white',
      info: 'text-blue-500 data-[appearance="fill"]:text-white',
      success: 'text-green-600 data-[appearance="fill"]:text-white',
      warning: 'text-yellow-600 data-[appearance="fill"]:text-white',
      error: 'text-red-500 data-[appearance="fill"]:text-white',
    },
    zAppearance: {
      outline: 'border data-[type="info"]:border-blue-500 data-[type="success"]:border-green-600 data-[type="warning"]:border-yellow-600 data-[type="error"]:border-red-500',
      soft: 'bg-zinc-100 data-[type="info"]:bg-blue-50 data-[type="success"]:bg-green-50 data-[type="warning"]:bg-yellow-50 data-[type="error"]:bg-red-50',
      fill: 'bg-zinc-500 data-[type="info"]:bg-blue-500 data-[type="success"]:bg-green-600 data-[type="warning"]:bg-yellow-600 data-[type="error"]:bg-red-500',
    },
  },
  defaultVariants: {
    zType: 'default',
    zAppearance: 'outline',
  },
});
export type ZardAlertVariants = VariantProps<typeof alertVariants>;

```

