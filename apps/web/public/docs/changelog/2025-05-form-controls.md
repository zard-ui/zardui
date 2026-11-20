---
title: May 2025 - Form Controls
description: Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.
---

# May 2025 - Form Controls

Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.

## New Components

### [Select](/docs/components/select)

Dropdown select with grouped options, multi-select support, keyboard navigation, and custom item rendering.

```
npx zard-cli@latest add select
```

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-preview',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit">
      <z-select-label>Fruits</z-select-label>
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectPreviewComponent {
  readonly selectedFruit = signal('');
}
```

### [Checkbox](/docs/components/checkbox)

Checkbox input component with indeterminate state support and full accessibility features.

```
npx zard-cli@latest add checkbox
```

```
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-preview',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox">Accept terms and conditions</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-2" [(ngModel)]="termsWithDesc" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-2">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox" zDisabled />
        <label z-field-label for="toggle-checkbox">Enable notifications</label>
      </div>
      <label z-field-label for="toggle-checkbox-2">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="toggle-checkbox-2" [(ngModel)]="notifications" />
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>You can enable or disable notifications at any time.</p>
          </div>
        </div>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxPreviewComponent {
  terms = false;
  termsWithDesc = true;
  notifications = false;
}
```

### [Radio Group](/docs/components/radio-group)

Radio button group for mutually exclusive options with customizable layouts and orientation.

```
npx zard-cli@latest add radio-group
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-preview',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div class="flex items-center gap-3">
        <z-radio zId="r1" value="default" />
        <label z-field-label for="r1">Default</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r2" value="comfortable" />
        <label z-field-label for="r2">Comfortable</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r3" value="compact" />
        <label z-field-label for="r3">Compact</label>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupPreviewComponent {
  selected: unknown = 'comfortable';
}
```

### [Switch](/docs/components/switch)

Toggle switch component for boolean settings with smooth animation transitions.

```
npx zard-cli@latest add switch
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-preview',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zId="airplane-mode">Airplane Mode</z-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchPreviewComponent {}
```

### [Slider](/docs/components/slider)

Range slider for numeric value selection with min/max bounds, step support, and value display.

```
npx zard-cli@latest add slider
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-preview',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[75]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderPreviewComponent {}
```
