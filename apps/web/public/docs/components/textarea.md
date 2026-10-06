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

Wrap `textarea[z-textarea]` in `z-field` with a `z-field-label` and `z-field-description` to add a label and helper text.

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

Set the native `disabled` attribute on `textarea[z-textarea]`, and add `data-disabled="true"` to the surrounding `z-field` so its label dims along with the control.

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

Set `aria-invalid="true"` on `textarea[z-textarea]` and `data-invalid="true"` on the surrounding `z-field` to mark the field as invalid; see the `form` example for wiring these attributes to a reactive form control.

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

Pair `textarea[z-textarea]` with `z-button` to build a message box with a submit action.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-button',
  imports: [ZardTextareaComponent, ZardButtonComponent],
  template: `
    <div class="grid w-72 gap-2">
      <textarea
        z-textarea
        id="textarea-button-message"
        placeholder="Type your message here."
        [(value)]="message"
      ></textarea>
      <button type="button" z-button [zDisabled]="!message().trim()" (click)="send()">Send message</button>
      @if (sentMessage()) {
        <p class="text-muted-foreground text-sm" aria-live="polite">Sent: "{{ sentMessage() }}"</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaButtonComponent {
  protected readonly message = signal('');
  protected readonly sentMessage = signal('');

  protected send(): void {
    this.sentMessage.set(this.message());
    this.message.set('');
  }
}
```

### Form

A reactive form built from `z-field` and `formControlName`, with a live validation message on the feedback textarea once it's touched and invalid.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-form',
  imports: [ZardTextareaComponent, ZardButtonComponent, ReactiveFormsModule, ...ZardFieldImports],
  template: `
    <form class="grid w-72 gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
      @let feedbackControl = form.controls.feedback;
      @let feedbackInvalid = feedbackControl.invalid && feedbackControl.touched;
      <div z-field [attr.data-invalid]="feedbackInvalid || null">
        <label z-field-label for="textarea-form-feedback">Feedback</label>
        <textarea
          z-textarea
          id="textarea-form-feedback"
          placeholder="Tell us what you think..."
          formControlName="feedback"
          [attr.aria-invalid]="feedbackInvalid || null"
        ></textarea>
        @if (feedbackInvalid) {
          <z-field-error>
            @if (feedbackControl.hasError('required')) {
              Feedback is required.
            } @else if (feedbackControl.hasError('minlength')) {
              Feedback must be at least 10 characters.
            }
          </z-field-error>
        } @else {
          <p z-field-description>Share as much detail as you can.</p>
        }
      </div>
      <button z-button type="submit">Submit feedback</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaFormComponent {
  protected readonly form = new FormGroup({
    feedback: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('Feedback submitted:', this.form.getRawValue());
    }
  }
}
```

## API Reference

### textarea[z-textarea]

A directive that styles a native `<textarea>` element. All native HTML textarea attributes (`rows`, `placeholder`, `disabled`, `required`, `readonly`, `maxlength`, `aria-invalid`, etc.) keep working as-is; the control grows with its content via CSS `field-sizing: content`, with no dedicated auto-resize input and no built-in character-count display.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[value]` | Textarea value, two-way bindable | `string` | `''` |
| `[(value)]` | Textarea value (two-way binding) | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/textarea)
