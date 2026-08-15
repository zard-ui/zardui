---
title: Contributing Components
description: From an empty folder to a component page that renders demos, installation instructions and a typed API reference.
---

# Contributing Components

From an empty folder to a component page that renders demos, installation instructions and a typed API reference.

A component lives entirely inside `libs/zard/src/lib/shared/components/<name>` . Its demos and its API reference sit next to the implementation, and the documentation site reads them from there — you never write a page by hand for a component.

## Run the Generator

Always start here. The generator creates seven files and updates four existing ones, so nothing is forgotten.

Scaffold a component

```
npm run generate:component
# or, non-interactively:
npx nx generate @zardui/generators:component --name=date-badge --description="Displays a formatted date badge"
```

### Files it creates

| File | Purpose |
| --- | --- |
| <name>.component.ts | The component, already wired to its variants and class input. |
| <name>.variants.ts | An empty CVA definition plus the derived variant type. |
| <name>.component.spec.ts | A Jest spec that asserts the component is created. |
| index.ts | The barrel that re-exports the component and its variants. |
| demo/default.ts | The first demo component. |
| demo/<name>.ts | The demo registry read by the docs page. |
| doc/api.ts | A starter ApiSection[] with the class prop. |

### Files it updates

| File | Change |
| --- | --- |
| libs/zard/src/index.ts | Adds the barrel export in alphabetical order. |
| apps/web/src/app/shared/constants/components.constant.ts | Appends the COMPONENTS_REGISTRY entry. |
| apps/web/src/app/shared/constants/routes.constant.ts | Appends the sidebar item to COMPONENTS_PATH. |
| packages/highlight/src/generator/usage-data.ts | Seeds the usage snippet so @generated/usage/<name> exists. |

i

#### Run the highlight generator right after

The demo registry imports from `@generated/…` , and those files only exist once you run `npm run generate:highlight` . Skipping it leaves the build failing on unresolved imports.

## Anatomy

The component file declares its inputs as signals and computes the final class list once. Styling never lives in the template.

libs/zard/src/lib/shared/components/button/button.component.ts

```
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

### Variants

The `.variants.ts` file is the single source of truth for both the classes and the types. Deriving the types from the CVA definition means a new variant key cannot be forgotten in the component signature.

libs/zard/src/lib/shared/components/button/button.variants.ts

```
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

## Conventions

Consistency is what makes the library predictable. Reviewers check these.

Prefix inputs with z

zType, zSize, zDisabled, zLoading. Only the class input keeps its plain name.

Boolean inputs use booleanAttribute

input(false, { transform: booleanAttribute }) so <z-thing zDisabled> works without a binding.

class is a ClassValue

Accept ClassValue from clsx and merge it last inside mergeClasses so consumers can always override.

Dual selector when it makes sense

z-name, [z-name] lets the component be used as an element or applied to a native tag, like a[z-button].

Use @/ inside the library

Imports within libs/zard go through @/shared/…, never through a long relative path.

OnPush and ViewEncapsulation.None

Both are mandatory; classes are applied to the host through the [class] host binding.

Set exportAs

Use the camelCase z-prefixed name (zButton, zCardTitle) so templates can grab a reference.

## Demos

The `demo/` folder holds one standalone component per example, plus a registry named after the component. The registry is what the docs page loads — a demo file that is not listed there is never rendered.

Each example pairs its component with a `codeData` import, which is the highlighted source of that very file. Add an optional `preview` entry to control the hero demo at the top of the page; without it the first example is used.

demo/<component>.ts — the demo registry

```
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

## API Reference

The API reference is TypeScript, not Markdown. Export an `ApiSection[]` from `doc/api.ts` and the `z-api-reference` component renders the table. One section per public selector.

doc/api.ts — the API reference

```
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

## Usage Snippet

The "Usage" section of a component page comes from `packages/highlight/src/generator/usage-data.ts` , a hand-maintained record keyed by component name. The generator seeds an entry for you; replace it with the smallest snippet that shows the component doing something useful.

packages/highlight/src/generator/usage-data.ts

```
export const USAGE_DATA: Record<string, RawUsageData> = {
  badge: {
    importCode: `import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';`,
    templateCode: `<z-badge>Badge</z-badge>`,
  },
};
```

## Checklist

Walk through this before opening the pull request.

- •The component compiles and the unit spec passes: npx nx run zard:test.
- •Every public input appears in doc/api.ts with its real type and default.
- •Each demo has an entry in demo/<name>.ts with its codeData import.
- •usage-data.ts holds a snippet that actually compiles for consumers.
- •npm run generate:highlight was run and apps/web/src/generated/ is staged.
- •npm run build succeeds — that is the job the CI runs.
- •The E2E spec was updated if the component or its first demo changed.

Regenerate and verify

```
npm run generate:highlight
npx nx run zard:lint
npm test
npm run build
```
