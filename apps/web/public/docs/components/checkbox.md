---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
---

# Checkbox

A control that allows the user to toggle between checked and not checked.

## Installation

### CLI

```bash
npx zard-cli@latest add checkbox
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

import { checkboxLabelVariants, checkboxVariants } from './checkbox.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-checkbox, [z-checkbox]',
  imports: [NgIcon, ZardIdDirective],
  template: `
    <span class="relative flex" zardId="checkbox" #z="zardId">
      <input
        #input
        type="checkbox"
        name="checkbox"
        [id]="zId() || z.id()"
        [class]="classes()"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.data-state]="checked() ? 'checked' : 'unchecked'"
        [attr.data-checked]="checked() ? '' : null"
        [attr.aria-invalid]="zInvalid() ? 'true' : null"
        (blur)="onCheckboxBlur()"
        (click)="onCheckboxChange()"
      />
      <ng-icon
        name="lucideCheck"
        class="text-primary-foreground pointer-events-none absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center transition-opacity"
        [class]="checked() ? 'opacity-100' : 'opacity-0'"
      />
    </span>
    <label [class]="labelClasses()" [for]="zId() || z.id()">
      <ng-content />
    </label>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardCheckboxComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck })],
  host: {
    'data-slot': 'checkbox',
    '[class]': "(disabled() ? 'cursor-not-allowed' : 'cursor-pointer') + ' flex items-center gap-2'",
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-invalid]': 'zInvalid() ? "true" : null',
    '[attr.data-checked]': "checked() ? '' : null",
    '[attr.data-state]': "checked() ? 'checked' : 'unchecked'",
  },
  exportAs: 'zCheckbox',
})
export class ZardCheckboxComponent implements ControlValueAccessor {
  readonly checkChange = output<boolean>();

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zId = input<string>('');

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  protected readonly classes = computed(() => mergeClasses(checkboxVariants(), this.class()));

  readonly disabledByForm = signal(false);
  protected readonly labelClasses = computed(() => mergeClasses(checkboxLabelVariants()));
  protected readonly disabled = computed(() => this.zDisabled() || this.disabledByForm());
  readonly checked = signal(false);

  writeValue(val: boolean): void {
    this.checked.set(val);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onCheckboxBlur(): void {
    this.onTouched();
  }

  onCheckboxChange(): void {
    if (this.disabled()) {
      return;
    }

    this.checked.update(v => !v);
    this.onChange(this.checked());
    this.checkChange.emit(this.checked());
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'cursor-[unset] peer size-4 shrink-0 appearance-none rounded-[4px] border border-input shadow-sm transition outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 checked:border-primary checked:bg-primary checked:text-primary-foreground dark:checked:bg-primary',
);

export const checkboxLabelVariants = cva('cursor-[unset] text-sm text-current empty:hidden select-none');
```

```angular-ts
export * from './checkbox.component';
export * from './checkbox.variants';
```

## Usage

```angular-ts
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
```

```angular-html
<z-checkbox zLabel="Accept terms and conditions"></z-checkbox>
```

## Examples

### Invalid

Set `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to show the invalid styles.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-invalid',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal" data-invalid="true">
        <z-checkbox zId="terms-checkbox-invalid" [(ngModel)]="terms" zInvalid />
        <label z-field-label for="terms-checkbox-invalid">Accept terms and conditions</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxInvalidComponent {
  terms = false;
}
```

### Basic

Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-basic',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-basic" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox-basic">Accept terms and conditions</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxBasicComponent {
  terms = false;
}
```

### Description

Use `FieldContent` and `FieldDescription` for helper text.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-description',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-72">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-desc" [(ngModel)]="terms" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-desc">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms and conditions.</p>
        </div>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxDescriptionComponent {
  terms = true;
}
```

### Disabled

Use the `disabled` prop to prevent interaction and add the `data-disabled` attribute to the `Field` component for disabled styles.

```angular-ts
import { Component } from '@angular/core';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-disabled',
  imports: [ZardCheckboxComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="mx-auto w-56">
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox-disabled" zDisabled />
        <label z-field-label for="toggle-checkbox-disabled">Enable notifications</label>
      </div>
    </div>
  `,
})
export class ZardDemoCheckboxDisabledComponent {}
```

### Group

Use multiple fields to create a checkbox list.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-group',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <fieldset z-field-set>
      <legend z-field-legend zVariant="label">Show these items on the desktop:</legend>
      <p z-field-description>Select the items you want to show on the desktop.</p>
      <div z-field-group class="gap-3">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-hard-disks-ljj-checkbox" [(ngModel)]="hardDisks" />
          <label z-field-label for="finder-pref-9k2-hard-disks-ljj-checkbox" class="font-normal">Hard disks</label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-external-disks-1yg-checkbox" [(ngModel)]="externalDisks" />
          <label z-field-label for="finder-pref-9k2-external-disks-1yg-checkbox" class="font-normal">
            External disks
          </label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-cds-dvds-fzt-checkbox" [(ngModel)]="cds" />
          <label z-field-label for="finder-pref-9k2-cds-dvds-fzt-checkbox" class="font-normal">
            CDs, DVDs, and iPods
          </label>
        </div>
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="finder-pref-9k2-connected-servers-6l2-checkbox" [(ngModel)]="connectedServers" />
          <label z-field-label for="finder-pref-9k2-connected-servers-6l2-checkbox" class="font-normal">
            Connected servers
          </label>
        </div>
      </div>
    </fieldset>
  `,
})
export class ZardDemoCheckboxGroupComponent {
  hardDisks = true;
  externalDisks = true;
  cds = false;
  connectedServers = false;
}
```

### Table

Combine the checkbox with the `Table` component for selectable rows.

```angular-ts
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TABLE_DATA: readonly Row[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Admin' },
  { id: '2', name: 'Marcus Rodriguez', email: 'marcus.rodriguez@example.com', role: 'User' },
  { id: '3', name: 'Priya Patel', email: 'priya.patel@example.com', role: 'User' },
  { id: '4', name: 'David Kim', email: 'david.kim@example.com', role: 'Editor' },
];

@Component({
  selector: 'z-demo-checkbox-table',
  imports: [ZardCheckboxComponent, ...ZardTableImports, FormsModule],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head class="w-8">
            <z-checkbox zId="select-all-checkbox" [ngModel]="allSelected()" (checkChange)="toggleAll($event)" />
          </th>
          <th z-table-head>Name</th>
          <th z-table-head>Email</th>
          <th z-table-head>Role</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (row of rows; track row.id) {
          <tr z-table-row [attr.data-state]="isSelected(row.id) ? 'selected' : null">
            <td z-table-cell>
              <z-checkbox
                [zId]="'row-' + row.id + '-checkbox'"
                [ngModel]="isSelected(row.id)"
                (checkChange)="toggleRow(row.id, $event)"
              />
            </td>
            <td z-table-cell class="font-medium">{{ row.name }}</td>
            <td z-table-cell>{{ row.email }}</td>
            <td z-table-cell>{{ row.role }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class ZardDemoCheckboxTableComponent {
  protected readonly rows = TABLE_DATA;
  private readonly selectedRows = signal<ReadonlySet<string>>(new Set(['1']));

  protected readonly allSelected = computed(() => this.selectedRows().size === this.rows.length);

  protected isSelected(id: string): boolean {
    return this.selectedRows().has(id);
  }

  protected toggleAll(checked: boolean): void {
    this.selectedRows.set(checked ? new Set(this.rows.map(row => row.id)) : new Set());
  }

  protected toggleRow(id: string, checked: boolean): void {
    const next = new Set(this.selectedRows());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedRows.set(next);
  }
}
```

## API Reference

### z-checkbox

A control that allows the user to toggle between checked and not checked.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zDisabled]` | Checkbox disabled state | `boolean` | `false` |
| `[zInvalid]` | Checkbox invalid state (sets aria-invalid) | `boolean` | `false` |
| `[zId]` | Checkbox id | `string` | `auto-generated` |
| `(checkChange)` | Emits when the checkbox value changes | `EventEmitter<boolean>` | `-` |

---

[Open in browser](https://zardui.com/docs/components/checkbox)
