---
title: Field
description: Composable building blocks for building accessible forms with labels, descriptions and errors.
---

# Field

Composable building blocks for building accessible forms with labels, descriptions and errors.

## Installation

### CLI

```bash
npx zard-cli@latest add field
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet.directive';
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
    '[attr.for]': 'for() || null',
    '[class]': 'classes()',
    '(click)': 'onLabelClick()',
  },
  exportAs: 'zFieldLabel',
})
export class ZardFieldLabelComponent {
  private readonly elementRef = inject(ElementRef);

  readonly class = input<ClassValue>('');
  readonly for = input('');
  protected readonly classes = computed(() => mergeClasses(fieldLabelVariants(), this.class()));

  protected onLabelClick(): void {
    if (!this.for()) {
      return;
    }

    const target = this.elementRef.nativeElement.getRootNode()?.querySelector(`#${CSS.escape(this.for())}`);
    if (target && target !== this.elementRef.nativeElement) {
      target.focus();
    }
  }
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
    if (!errs?.length) {
      return [] as ZardFieldErrorEntry[];
    }

    const map = new Map<string | undefined, ZardFieldErrorEntry>();
    for (const e of errs) {
      if (!e) {
        continue;
      }
      map.set(e.message, e);
    }
    return [...map.values()];
  });

  protected readonly classes = computed(() => mergeClasses(fieldErrorVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const fieldSetVariants = cva(
  'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
);

export const fieldLegendVariants = cva(
  'mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
);

export const fieldGroupVariants = cva(
  'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
);

export const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
  variants: {
    zOrientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    zOrientation: 'vertical',
  },
});

export const fieldContentVariants = cva('group/field-content flex flex-1 flex-col gap-0.5 leading-snug');

export const fieldLabelVariants = cva([
  'group/field-label peer/field-label flex w-fit gap-2 text-sm/snug font-medium',
  'group-data-[disabled=true]/field:opacity-50',
  'has-data-checked:border-primary/30 has-data-checked:bg-primary/5',
  'has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5',
  'dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10',
  'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
]);

export const fieldTitleVariants = cva(
  'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50',
);

export const fieldDescriptionVariants = cva([
  'text-left text-sm/normal font-normal text-muted-foreground',
  'group-has-data-horizontal/field:text-balance',
  '[[data-variant=legend]+&]:-mt-1.5',
  'last:mt-0 nth-last-2:-mt-1',
  '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
]);

export const fieldSeparatorVariants = cva(
  'relative -my-2 flex h-5 items-center text-sm group-data-[variant=outline]/field-group:-mb-2',
);

export const fieldErrorVariants = cva('text-sm font-normal text-destructive');

export type ZardFieldOrientationVariants = NonNullable<VariantProps<typeof fieldVariants>['zOrientation']>;
export type ZardFieldLegendVariants = 'legend' | 'label';
```

```angular-ts
export {
  ZardFieldComponent,
  ZardFieldContentComponent,
  ZardFieldDescriptionComponent,
  ZardFieldErrorComponent,
  ZardFieldGroupComponent,
  ZardFieldLabelComponent,
  ZardFieldLegendComponent,
  ZardFieldSeparatorComponent,
  ZardFieldSetComponent,
  ZardFieldTitleComponent,
} from './field.component';

import {
  ZardFieldComponent,
  ZardFieldContentComponent,
  ZardFieldDescriptionComponent,
  ZardFieldErrorComponent,
  ZardFieldGroupComponent,
  ZardFieldLabelComponent,
  ZardFieldLegendComponent,
  ZardFieldSeparatorComponent,
  ZardFieldSetComponent,
  ZardFieldTitleComponent,
} from './field.component';

export const ZardFieldImports = [
  ZardFieldSetComponent,
  ZardFieldLegendComponent,
  ZardFieldGroupComponent,
  ZardFieldComponent,
  ZardFieldContentComponent,
  ZardFieldLabelComponent,
  ZardFieldTitleComponent,
  ZardFieldDescriptionComponent,
  ZardFieldSeparatorComponent,
  ZardFieldErrorComponent,
] as const;
```

```angular-ts
export * from './field.component';
export * from './field.imports';
export * from './field.variants';
```

## Usage

```angular-ts
import { ZardFieldImports } from '@/shared/components/field/field.imports';
```

```angular-html
<div z-field-group>
  <div z-field>
    <label z-field-label for="email">Email</label>
    <input z-input id="email" placeholder="m@example.com" />
    <p z-field-description>We'll never share your email.</p>
  </div>
</div>
```

## Examples

### Input

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-field-input',
  imports: [...ZardFieldImports, ZardInputComponent],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="username">Username</label>
            <input z-input id="username" type="text" placeholder="Max Leiter" />
            <p z-field-description>Choose a unique username for your account.</p>
          </div>
          <div z-field>
            <label z-field-label for="password">Password</label>
            <p z-field-description>Must be at least 8 characters long.</p>
            <input z-input id="password" type="password" placeholder="••••••••" />
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldInputComponent {}
```

### Textarea

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-field-textarea',
  imports: [...ZardFieldImports, ZardTextareaComponent],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="feedback">Feedback</label>
            <textarea z-textarea id="feedback" placeholder="Your feedback helps us improve..." rows="4"></textarea>
            <p z-field-description>Share your thoughts about our service.</p>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldTextareaComponent {}
```

### Select

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-field-select',
  imports: [...ZardFieldImports, ZardSelectImports],
  template: `
    <div class="w-full min-w-xs">
      <div z-field>
        <label z-field-label for="department">Department</label>
        <z-select zPlaceholder="Choose department" id="department" zSize="sm">
          <z-select-item zValue="engineering">Engineering</z-select-item>
          <z-select-item zValue="design">Design</z-select-item>
          <z-select-item zValue="marketing">Marketing</z-select-item>
          <z-select-item zValue="sales">Sales</z-select-item>
          <z-select-item zValue="support">Customer Support</z-select-item>
          <z-select-item zValue="hr">Human Resources</z-select-item>
          <z-select-item zValue="finance">Finance</z-select-item>
          <z-select-item zValue="operations">Operations</z-select-item>
        </z-select>
        <p z-field-description>Select your department or area of work.</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSelectComponent {}
```

### Slider

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';

@Component({
  selector: 'z-demo-field-slider',
  imports: [...ZardFieldImports, ZardSliderComponent],
  template: `
    <div class="w-full min-w-xs">
      <div z-field>
        <div z-field-title>Volume</div>
        <p z-field-description>
          Set the playback volume (
          <span class="font-medium tabular-nums">{{ value() }}</span>
          %).
        </p>
        <z-slider
          class="mt-2 w-full"
          aria-label="Volume"
          [zDefault]="value()"
          [zMin]="0"
          [zMax]="100"
          [zStep]="1"
          (zSlideIndexChange)="value.set($event)"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSliderComponent {
  protected readonly value = signal([40]);
}
```

### Fieldset

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-field-fieldset',
  imports: [...ZardFieldImports, ZardInputComponent],
  template: `
    <div class="w-full min-w-sm">
      <fieldset z-field-set>
        <legend z-field-legend>Address Information</legend>
        <p z-field-description>We need your address to deliver your order.</p>

        <div z-field-group>
          <div z-field>
            <label z-field-label for="street">Street Address</label>
            <input z-input id="street" type="text" placeholder="123 Main St" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div z-field>
              <label z-field-label for="city">City</label>
              <input z-input id="city" type="text" placeholder="New York" />
            </div>
            <div z-field>
              <label z-field-label for="zip">Postal Code</label>
              <input z-input id="zip" type="text" placeholder="90502" />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldFieldsetComponent {}
```

### Checkbox

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-field-checkbox',
  imports: [...ZardFieldImports, ZardCheckboxComponent, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <div z-field-group>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Show these items on the desktop</legend>
          <p z-field-description>Select the items you want to show on the desktop.</p>

          <div z-field-group class="gap-3">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-hard-disks" [(ngModel)]="hardDisks" name="hardDisks"></span>
              <label z-field-label for="finder-hard-disks" class="font-normal">Hard disks</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-external-disks" [(ngModel)]="externalDisks" name="externalDisks"></span>
              <label z-field-label for="finder-external-disks" class="font-normal">External disks</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-cds" [(ngModel)]="cds" name="cds"></span>
              <label z-field-label for="finder-cds" class="font-normal">CDs, DVDs, and iPods</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="finder-servers" [(ngModel)]="servers" name="servers"></span>
              <label z-field-label for="finder-servers" class="font-normal">Connected servers</label>
            </div>
          </div>
        </fieldset>

        <z-field-separator />

        <div z-field zOrientation="horizontal">
          <span z-checkbox zId="finder-sync-folders" [(ngModel)]="syncFolders" name="syncFolders"></span>
          <div z-field-content>
            <label z-field-label for="finder-sync-folders">Sync Desktop &amp; Documents folders</label>
            <p z-field-description>
              Your Desktop &amp; Documents folders are being synced with iCloud Drive. You can access them from other
              devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldCheckboxComponent {
  protected hardDisks = true;
  protected externalDisks = false;
  protected cds = false;
  protected servers = false;
  protected syncFolders = true;
}
```

### Radio

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-field-radio',
  imports: [...ZardFieldImports, ...ZardRadioGroupImports, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <legend z-field-legend zVariant="label">Subscription Plan</legend>
        <p z-field-description>Yearly and lifetime plans offer significant savings.</p>

        <z-radio-group class="gap-3" [(ngModel)]="plan">
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-monthly" value="monthly" />
            <label z-field-label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-yearly" value="yearly" />
            <label z-field-label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</label>
          </div>
          <div z-field zOrientation="horizontal">
            <z-radio zId="plan-lifetime" value="lifetime" />
            <label z-field-label for="plan-lifetime" class="font-normal">Lifetime ($299.99)</label>
          </div>
        </z-radio-group>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldRadioComponent {
  protected plan = 'monthly';
}
```

### Switch

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-field-switch',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div class="flex w-full min-w-xs justify-center">
      <div z-field zOrientation="horizontal" class="w-fit">
        <label z-field-label for="2fa">Multi-factor authentication</label>
        <z-switch zId="2fa" zSize="sm" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldSwitchComponent {}
```

### Choice Card

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-field-choice-card',
  imports: [...ZardFieldImports, ...ZardRadioGroupImports, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <div z-field-group>
        <fieldset z-field-set>
          <legend z-field-legend zVariant="label">Compute Environment</legend>
          <p z-field-description>Select the compute environment for your cluster.</p>

          <z-radio-group class="gap-3" [(ngModel)]="env">
            <label z-field-label for="env-kubernetes">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Kubernetes</div>
                  <p z-field-description>Run GPU workloads on a K8s cluster.</p>
                </div>
                <z-radio zId="env-kubernetes" value="kubernetes" />
              </div>
            </label>

            <label z-field-label for="env-vm">
              <div z-field zOrientation="horizontal">
                <div z-field-content>
                  <div z-field-title>Virtual Machine</div>
                  <p z-field-description>Access a cluster to run GPU workloads.</p>
                </div>
                <z-radio zId="env-vm" value="vm" />
              </div>
            </label>
          </z-radio-group>
        </fieldset>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldChoiceCardComponent {
  protected env = 'kubernetes';
}
```

### Field Group

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-field-field-group',
  imports: [...ZardFieldImports, ZardCheckboxComponent, FormsModule],
  template: `
    <div class="w-full min-w-xs">
      <div z-field-group>
        <fieldset z-field-set>
          <label z-field-label>Responses</label>
          <p z-field-description>
            Get notified when ChatGPT responds to requests that take time, like research or image generation.
          </p>

          <div z-field-group data-slot="checkbox-group">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="responses-push" [(ngModel)]="responsesPush" name="responsesPush" zDisabled></span>
              <label z-field-label for="responses-push" class="font-normal">Push notifications</label>
            </div>
          </div>
        </fieldset>

        <z-field-separator />

        <fieldset z-field-set>
          <label z-field-label>Tasks</label>
          <p z-field-description>
            Get notified when tasks you've created have updates.
            <a href="#">Manage tasks</a>
          </p>

          <div z-field-group data-slot="checkbox-group">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="tasks-push" [(ngModel)]="tasksPush" name="tasksPush"></span>
              <label z-field-label for="tasks-push" class="font-normal">Push notifications</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="tasks-email" [(ngModel)]="tasksEmail" name="tasksEmail"></span>
              <label z-field-label for="tasks-email" class="font-normal">Email notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldFieldGroupComponent {
  protected responsesPush = true;
  protected tasksPush = false;
  protected tasksEmail = false;
}
```

## API Reference

### z-field

A field container that wraps a label, control and optional description / error.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zOrientation]` | Layout direction of the field | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` |

### z-field-set

A semantic <fieldset> wrapper that vertically stacks fields with consistent spacing.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-field-legend

Legend element for a field-set. Use the label variant when grouping inline controls.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zVariant]` | Visual size of the legend | `'legend' \| 'label'` | `'legend'` |

### z-field-group

Group of fields with consistent vertical spacing. Acts as a container query parent for responsive fields.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-field-content

Wrapper for the textual portion of a field (title + description) when used in horizontal layouts.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-field-label

Label for a form control. Use on <label> for proper semantics, or as <z-field-label>.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[for]` | Associates the label with a form control by referencing the control's id. | `string` |  |

### z-field-title

Non-interactive title for a field (e.g. when wrapping a checkbox/radio along with description).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-field-description

Helper text rendered below or beside a field control.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-field-separator

Horizontal separator with optional centered content.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zContent]` | Optional text or template displayed above the separator line | `string \| TemplateRef<void>` | `''` |

### z-field-error

Renders a single error message or a list of errors. Falls back to projected content when no errors are provided.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zErrors]` | Array of error objects with an optional `message` string. Duplicate messages are removed. | `Array<{ message?: string }>` | `[]` |

---

[Open in browser](https://zardui.com/docs/components/field)
