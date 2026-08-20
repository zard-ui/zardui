---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
---

# Textarea

Displays a form textarea or a component that looks like a textarea.

## Installation

### CLI

```bash
npx zard-cli@latest add textarea
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardInputGroupComponent } from '@/shared/components/input-group';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import { inputGroupTextAreaVariants, textareaVariants } from './textarea.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'textarea[z-textarea]',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardTextareaComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': 'parentGroup ? "input-group-control" : "textarea"',
    '[class]': 'classes()',
    '(input)': 'updateValue($event.target)',
    '(blur)': 'onBlur()',
  },
  exportAs: 'zTextarea',
})
export class ZardTextareaComponent implements ControlValueAccessor {
  readonly parentGroup = inject(ZardInputGroupComponent, { optional: true });
  private readonly elementRef = inject(ElementRef<HTMLTextAreaElement>);

  private onTouchedFn: OnTouchedType = noopFn;
  private onChangeFn: OnChangeType = noopFn;

  readonly class = input<ClassValue>('');
  readonly value = model<string>('');

  protected readonly classes = computed(() =>
    mergeClasses(textareaVariants(), this.parentGroup ? inputGroupTextAreaVariants() : '', this.class()),
  );

  constructor() {
    effect(() => {
      const value = this.value();
      if (value !== undefined && value !== null) {
        this.elementRef.nativeElement.value = value;
      }
    });
  }

  disable(b: boolean): void {
    this.elementRef.nativeElement.disabled = b;
  }

  protected updateValue(target: EventTarget | null): void {
    const el = target as HTMLTextAreaElement | null;
    this.value.set(el?.value ?? '');
    this.onChangeFn(this.value());
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  writeValue(value?: string): void {
    this.value.set(value ?? '');
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
);

export const inputGroupTextAreaVariants = cva(
  'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
);
```

```angular-ts
export * from './textarea.component';
export * from './textarea.variants';
```

## Usage

```angular-ts
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';
```

```angular-html
<textarea z-textarea rows="6" placeholder="Type your message"></textarea>
```

## Examples

### Field

Use Field, FieldLabel, and FieldDescription to create a textarea with a label and description.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-field',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="textarea-message">Message</label>
      <p z-field-description>Enter your message below.</p>
      <textarea z-textarea id="textarea-message" placeholder="Type your message here."></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaFieldComponent {}
```

### Disabled

Use the disabled prop to disable the textarea. To style the disabled state, add the data-disabled attribute to the Field component.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-disabled',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-disabled="true">
      <label z-field-label for="textarea-disabled">Message</label>
      <textarea z-textarea id="textarea-disabled" placeholder="Type your message here." disabled></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaDisabledComponent {}
```

### Invalid

Use the aria-invalid prop to mark the textarea as invalid. To style the invalid state, add the data-invalid attribute to the Field component.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-invalid',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72" data-invalid="true">
      <label z-field-label for="textarea-invalid">Message</label>
      <textarea z-textarea id="textarea-invalid" placeholder="Type your message here." aria-invalid="true"></textarea>
      <p z-field-description>Please enter a valid message.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaInvalidComponent {}
```

### Button

Pair with Button to create a textarea with a submit button.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-button',
  imports: [ZardTextareaComponent, ZardButtonComponent],
  template: `
    <div class="grid w-72 gap-2">
      <textarea z-textarea placeholder="Type your message here."></textarea>
      <button type="button" z-button>Send message</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaButtonComponent {}
```

## API Reference

### textarea[z-textarea]

A multi-line text input directive applied to a native textarea. All native HTML textarea attributes (placeholder, name, disabled, readonly, aria-invalid, etc.) are supported.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[value]` | Textarea value, two-way bindable | `string` | `''` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[(value)]` | Textarea value (two-way binding) | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/textarea)
