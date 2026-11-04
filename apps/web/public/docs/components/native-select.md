---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
---

# Native Select

A styled native HTML select element with consistent design system integration.

## Installation

### CLI

```bash
npx zard-cli@latest add native-select
```

### Manual

```angular-ts
import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { nativeSelectVariants, type ZardNativeSelectSizeVariants } from './native-select.variants';

@Directive({
  selector: 'select[z-native-select]',
  host: {
    'data-slot': 'native-select',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zNativeSelect',
})
export class ZardNativeSelectDirective {
  readonly zSize = input<ZardNativeSelectSizeVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(nativeSelectVariants({ zSize: this.zSize() }), this.class()),
  );
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

// Lucide `chevron-down`, inlined as a background image so the real <select> needs no wrapper or sibling element.
// The stroke matches `--muted-foreground` in light (#737373) and dark (#a1a1a1) themes.
const CHEVRON_LIGHT =
  'bg-[url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23737373%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E)]';
const CHEVRON_DARK =
  'dark:bg-[url(data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23a1a1a1%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27m6%209%206%206%206-6%27%2F%3E%3C%2Fsvg%3E)]';

export const nativeSelectVariants = cva(
  mergeClasses(
    'h-8 w-full min-w-0 appearance-none rounded-lg border border-input bg-transparent py-1 ps-2.5 pe-8 text-sm transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground',
    'bg-no-repeat bg-size-[1rem] bg-position-[right_0.625rem_center] rtl:bg-position-[left_0.625rem_center]',
    CHEVRON_LIGHT,
    CHEVRON_DARK,
    'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
    'dark:bg-input/30 dark:scheme-dark dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
    '[&[multiple]]:h-auto [&[multiple]]:bg-none dark:[&[multiple]]:bg-none',
    '[&_option]:bg-[Canvas] [&_option]:text-[CanvasText] [&_optgroup]:bg-[Canvas] [&_optgroup]:text-[CanvasText]',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-7 rounded-[min(var(--radius-md),10px)] py-0.5',
        default: '',
        lg: 'h-10 ps-3 pe-9 text-base md:text-sm',
      },
    },
    defaultVariants: { zSize: 'default' },
  },
);

type Variants = VariantProps<typeof nativeSelectVariants>;
export type ZardNativeSelectSizeVariants = NonNullable<Variants['zSize']>;
```

```angular-ts
export * from './native-select.directive';
export * from './native-select.variants';
```

## Usage

```angular-ts
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';
```

```angular-html
<select z-native-select>
  <option value="todo">Todo</option>
  <option value="in-progress">In progress</option>
  <option value="done">Done</option>
</select>
```

## Examples

### Groups

Use plain `<optgroup>` elements to organize options into categories.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-groups',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64">
      <label z-field-label for="native-select-department">Department</label>
      <select z-native-select id="native-select-department">
        <option value="" disabled selected>Select department</option>
        <optgroup label="Engineering">
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="devops">DevOps</option>
        </optgroup>
        <optgroup label="Sales">
          <option value="account-executive">Account executive</option>
          <option value="sales-development">Sales development</option>
        </optgroup>
        <optgroup label="Operations">
          <option value="support">Customer support</option>
          <option value="product-manager">Product manager</option>
        </optgroup>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectGroupsComponent {}
```

### Sizes

Use `zSize` to pick between `sm`, `default` and `lg`. The default height lines up with `z-input`.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-sizes',
  imports: [ZardNativeSelectDirective],
  template: `
    <div class="flex w-64 flex-col gap-4">
      <select z-native-select zSize="sm" aria-label="Small">
        <option>Small</option>
        <option>Option two</option>
      </select>
      <select z-native-select aria-label="Default">
        <option>Default</option>
        <option>Option two</option>
      </select>
      <select z-native-select zSize="lg" aria-label="Large">
        <option>Large</option>
        <option>Option two</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectSizesComponent {}
```

### Disabled

Set the native `disabled` attribute on `select[z-native-select]`, and add `data-disabled="true"` to the surrounding `z-field` so its label dims along with the control.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-disabled',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64" data-disabled="true">
      <label z-field-label for="native-select-disabled">Status</label>
      <select z-native-select id="native-select-disabled" disabled>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectDisabledComponent {}
```

### Invalid

Set `aria-invalid="true"` on `select[z-native-select]` and `data-invalid="true"` on the surrounding `z-field` to show the invalid state.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-invalid',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64" data-invalid="true">
      <label z-field-label for="native-select-invalid">Status</label>
      <select z-native-select id="native-select-invalid" aria-invalid="true">
        <option value="" disabled selected>Select status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
      </select>
      <z-field-error>Select a status to continue.</z-field-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectInvalidComponent {}
```

### Form

The directive adds no `ControlValueAccessor`: Angular binds `formControl`, `formControlName` and `ngModel` to the native `<select>` as usual.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-form',
  imports: [ZardNativeSelectDirective, ZardButtonComponent, ReactiveFormsModule, ...ZardFieldImports],
  template: `
    <form class="w-64" [formGroup]="form" (ngSubmit)="onSubmit()">
      <div z-field-group>
        @let statusControl = form.controls.status;
        @let statusInvalid = statusControl.invalid && statusControl.touched;
        <div z-field [attr.data-invalid]="statusInvalid || null">
          <label z-field-label for="native-select-form-status">Status</label>
          <select
            z-native-select
            id="native-select-form-status"
            formControlName="status"
            [attr.aria-invalid]="statusInvalid || null"
          >
            <option value="" disabled>Select status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
          @if (statusInvalid) {
            <z-field-error>Status is required.</z-field-error>
          } @else {
            <p z-field-description>Current value: {{ statusControl.value || 'none' }}</p>
          }
        </div>
        <div z-field zOrientation="horizontal">
          <button z-button type="button" zType="outline" (click)="form.reset()">Reset</button>
          <button z-button type="submit">Submit</button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectFormComponent {
  readonly form = new FormGroup({
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(): void {
    this.form.markAllAsTouched();
  }
}
```

### Native Vs Select

Native Select keeps the browser picker, keyboard handling and form behavior. Select is an overlay with custom items, search and templates.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-native-select-native-vs-select',
  imports: [ZardNativeSelectDirective, ZardSelectImports, ...ZardFieldImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-4 sm:flex-row">
      <div z-field>
        <label z-field-label for="native-select-compare-native">Native Select</label>
        <select z-native-select id="native-select-compare-native">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="blueberry">Blueberry</option>
        </select>
      </div>
      <div z-field>
        <label z-field-label for="native-select-compare-select">Select</label>
        <z-select id="native-select-compare-select" zPlaceholder="Select a fruit">
          <z-select-item zValue="apple">Apple</z-select-item>
          <z-select-item zValue="banana">Banana</z-select-item>
          <z-select-item zValue="blueberry">Blueberry</z-select-item>
        </z-select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectNativeVsSelectComponent {}
```

### Rtl

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). The chevron moves to the start side.

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface NativeSelectRtlValues {
  label: string;
  placeholder: string;
  todo: string;
  inProgress: string;
  done: string;
}

const translations: ZardRtlTranslations<NativeSelectRtlValues> = {
  en: {
    dir: 'ltr',
    values: { label: 'Status', placeholder: 'Select status', todo: 'Todo', inProgress: 'In progress', done: 'Done' },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'الحالة',
      placeholder: 'اختر الحالة',
      todo: 'قيد الانتظار',
      inProgress: 'قيد التنفيذ',
      done: 'مكتمل',
    },
  },
  he: {
    dir: 'rtl',
    values: { label: 'סטטוס', placeholder: 'בחר סטטוס', todo: 'לביצוע', inProgress: 'בתהליך', done: 'הושלם' },
  },
};

@Component({
  selector: 'z-demo-native-select-rtl',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64">
      <label z-field-label for="native-select-rtl">{{ i18n.t().label }}</label>
      <select z-native-select id="native-select-rtl">
        <option value="" disabled selected>{{ i18n.t().placeholder }}</option>
        <option value="todo">{{ i18n.t().todo }}</option>
        <option value="in-progress">{{ i18n.t().inProgress }}</option>
        <option value="done">{{ i18n.t().done }}</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## API Reference

### select[z-native-select]

A directive that styles a native `<select>` element. It adds no `ControlValueAccessor` and no wrapper, so `formControl`, `formControlName`, `ngModel` and every native attribute (`disabled`, `required`, `multiple`, `name`, `aria-invalid`, ...) keep working as-is. Options and groups are plain `<option>` and `<optgroup>` elements. Use Native Select for the native OS picker, built-in keyboard and form support, and zero overlay; use Select for custom styling, animations, rich items or complex interactions.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zSize]` | Size variant. `default` lines up with the height of `z-input` and `z-select` | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/native-select)
