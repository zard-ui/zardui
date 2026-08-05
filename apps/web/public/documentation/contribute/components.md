```bash title="Scaffold a component" copyButton
npm run generate:component
# or, non-interactively:
npx nx generate @zardui/generators:component --name=date-badge --description="Displays a formatted date badge"
```

```angular-ts title="libs/zard/src/lib/shared/components/button/button.component.ts" showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation, booleanAttribute } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { buttonVariants, type ZardButtonSizeVariants, type ZardButtonTypeVariants } from './button.variants';

@Component({
  selector: 'z-button, button[z-button], a[z-button]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'button',
    '[class]': 'classes()',
  },
  exportAs: 'zButton',
  template: `
    <ng-content />
  `,
})
export class ZardButtonComponent {
  readonly zType = input<ZardButtonTypeVariants>('default');
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(buttonVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()),
  );
}
```

```typescript title="libs/zard/src/lib/shared/components/button/button.variants.ts" showLineNumbers copyButton
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const buttonVariants = cva(
  mergeClasses('inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium'),
  {
    variants: {
      zType: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border-border bg-background hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
      },
      zSize: {
        default: 'h-8 gap-1.5 px-2.5',
        sm: 'h-7 gap-1 px-2.5 text-[0.8rem]',
        lg: 'h-9 gap-1.5 px-2.5',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;
```

```typescript title="demo/<component>.ts — the demo registry" showLineNumbers copyButton
import { BADGE_DEMO_DEFAULT } from '@generated/components/badge/demo/default';
import { BADGE_CLI_ADD } from '@generated/installation/cli/add-badge';
import { BADGE_MANUAL_CODE } from '@generated/installation/manual/badge';
import { BADGE_USAGE_CODE, BADGE_USAGE_IMPORT } from '@generated/usage/badge';

import { ZardDemoBadgeDefaultComponent } from './default';
import { BADGE_API } from '../doc/api';

export const BADGE = {
  componentName: 'badge',
  componentType: 'badge',
  description: 'Displays a badge or a component that looks like a badge.',
  api: BADGE_API,
  installData: {
    cliAdd: BADGE_CLI_ADD,
    manualCode: BADGE_MANUAL_CODE,
  },
  usage: { importBlock: BADGE_USAGE_IMPORT, codeBlock: BADGE_USAGE_CODE },
  examples: [
    {
      name: 'default',
      component: ZardDemoBadgeDefaultComponent,
      codeData: BADGE_DEMO_DEFAULT,
    },
  ],
};
```

```typescript title="doc/api.ts — the API reference" showLineNumbers copyButton
import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUTTON_API: ApiSection[] = [
  {
    selector: 'z-button',
    description: 'Displays a button or a component that looks like a button.',
    props: [
      { name: 'zDisabled', description: 'Button disabled state', type: 'boolean', default: 'false' },
      { name: 'zLoading', description: 'Button loading state', type: 'boolean', default: 'false' },
      {
        name: 'zType',
        description: 'Button type',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        default: "'default'",
      },
    ],
  },
];
```

```typescript title="packages/highlight/src/generator/usage-data.ts" showLineNumbers copyButton
export const USAGE_DATA: Record<string, RawUsageData> = {
  badge: {
    importCode: `import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';`,
    templateCode: `<z-badge>Badge</z-badge>`,
  },
};
```

```bash title="Regenerate and verify" copyButton
npm run generate:highlight
npx nx run zard:lint
npm test
npm run build
```
