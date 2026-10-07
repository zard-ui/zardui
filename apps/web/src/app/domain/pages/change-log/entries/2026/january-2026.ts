import { type ChangelogEntry } from '../changelog-entry.interface';

export const JANUARY_2026: ChangelogEntry = {
  meta: {
    month: 'January 2026',
    year: 2026,
    monthNumber: 1,
    date: new Date(2026, 0, 1),
    id: '01-2026',
  },

  overview:
    'A quiet month by commit count but not by API surface: Angular 21 becomes the floor, every generated id moves to a new `ZardIdDirective` so server and client stop disagreeing, and both the input directive and Checkbox learn to honour the Reactive Forms disabled state.',

  highlights: [
    {
      title: 'Angular 21 is now required',
      description:
        'Peer dependencies move to `^21.0.0` for `@angular/core`, `common`, `forms`, `router`, `platform-browser`, and `cdk` (previously pinned to 20.3.14), with `embla-carousel-angular` on `^21` and `tailwind-merge` on `^3.4`. Apps still on Angular 20 need to update before installing new components.',
      icon: 'package',
      code: 'ng update @angular/core@21 @angular/cli@21 @angular/cdk@21',
    },
    {
      title: 'SSR-stable ids with ZardIdDirective',
      description:
        'Alert Dialog, Card, Checkbox, Input Group, Radio, Switch, Tooltip, and Menu now generate their ids through the public `ZardIdDirective` instead of `crypto.randomUUID()`, so the id is deterministic and the server and browser render the same markup — no more hydration mismatch. `generateId` from `@/shared/utils/merge-classes` is gone; use `ZardIdDirective` from `@/shared/core` instead.',
      icon: 'zap',
      code: '<label zardId="email" #e="zardId" [for]="e.id()">Email</label>',
    },
    {
      title: 'ZardTooltipModule replaced by ZardTooltipImports',
      description:
        'The tooltip module is gone. Import `ZardTooltipImports` (or the standalone directive/component directly) instead.',
      icon: 'code',
      code: 'imports: [ZardTooltipImports]',
    },
    {
      title: 'Input directive is a ControlValueAccessor',
      description:
        'The `input[z-input]` and `textarea[z-input]` directives now register `NG_VALUE_ACCESSOR`: `setValue`/`patchValue` work, `control.disable()` disables the field, and blur marks it touched. A new signal-form demo shows it wired through `[formField]` from `@angular/forms/signals`.',
      icon: 'code',
    },
    {
      title: 'Checkbox: zDisabled input and form disabled state',
      description:
        'The `disabled` input is renamed to `zDisabled`, `setDisabledState` is implemented so reactive forms can disable a checkbox directly, and `checked` is now a signal. The outer `<span>` wrapper is gone — the host itself carries the layout and `aria-disabled`.',
      icon: 'shield',
      code: '<span z-checkbox [zDisabled]="true">Disabled</span>',
    },
    {
      title: 'Avatar and Empty render images with NgOptimizedImage',
      description:
        'Avatar gains a `zPriority` input and accepts a `SafeUrl` for `zSrc`; the image fills its container and lazy-loads unless marked priority. Empty renders its `zImage` at 64×64 by default. Both reject `data:`/`blob:` URLs in dev mode.',
      icon: 'rocket',
      code: '<z-avatar zSrc="/me.png" zPriority />',
    },
    {
      title: 'Variant helper types renamed',
      description:
        'Several exported variant types split or renamed for consistency: `ZardAlertVariants` → `ZardAlertTypeVariants`; `ZardBadgeVariants` → `ZardBadgeTypeVariants` and `ZardBadgeShapeVariants`; `ZardCheckboxVariants` → `ZardCheckboxTypeVariants`, `SizeVariants`, and `ShapeVariants`; `ZardIconVariants` → `ZardIconSizeVariants`. `ZardAlertIconVariants`, `ZardAlertTitleVariants`, `ZardAlertDescriptionVariants`, and `ZardCheckLabelVariants` are removed without replacement.',
      icon: 'code',
    },
  ],
};
