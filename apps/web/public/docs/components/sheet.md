---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

# Sheet

Extends the Dialog component to display content that complements the main content of the screen.

```
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { Z_SHEET_DATA, ZardSheetService } from '@/shared/components/sheet/sheet.service';

interface iSheetData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-sheet-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input
          z-input
          formControlName="name"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input
          z-input
          formControlName="username"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetBasic',
})
export class ZardDemoSheetBasicInputComponent implements AfterViewInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);

  form = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardButtonComponent, ZardSheetImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetBasicComponent {
  private sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetBasicInputComponent,
      zData: {
        name: 'Matheus Ribeiro',
        username: '@ribeiromatheus.dev',
      },
      zOkText: 'Save changes',
      zOkIcon: lucideSave,
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

## Installation

## Command

```
npx zard-cli@latest add sheet
```

## Usage

```
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
```

```
<z-sheet
  zTitle="Edit profile"
  zDescription="Make changes to your profile here."
  zSide="right"
>
  <p>Sheet content goes here.</p>
</z-sheet>
```

## Examples

### basic

```
import { ChangeDetectionStrategy, Component, inject, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { lucideSave } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { Z_SHEET_DATA, ZardSheetService } from '@/shared/components/sheet/sheet.service';

interface iSheetData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-sheet-basic',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input
          z-input
          formControlName="name"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input
          z-input
          formControlName="username"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetBasic',
})
export class ZardDemoSheetBasicInputComponent implements AfterViewInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);

  form = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
  });

  ngAfterViewInit(): void {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [ZardButtonComponent, ZardSheetImports],
  template: `
    <button type="button" z-button zType="outline" (click)="openSheet()">Edit profile</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetBasicComponent {
  private sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetBasicInputComponent,
      zData: {
        name: 'Matheus Ribeiro',
        username: '@ribeiromatheus.dev',
      },
      zOkText: 'Save changes',
      zOkIcon: lucideSave,
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

### side

top

bottom

left

right

```
import { ChangeDetectionStrategy, Component, inject, signal, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardRadioGroupImports } from '@/shared/components/radio-group';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { Z_SHEET_DATA, ZardSheetService } from '@/shared/components/sheet/sheet.service';

interface iSheetData {
  name: string;
  username: string;
}

@Component({
  selector: 'zard-demo-sheet-side',
  imports: [FormsModule, ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label
          for="name"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Name
        </label>
        <input
          z-input
          formControlName="name"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>

      <div class="grid gap-3">
        <label
          for="username"
          class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          Username
        </label>
        <input
          z-input
          formControlName="username"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetSide',
})
export class ZardDemoSheetSideInputComponent implements AfterViewInit {
  private zData: iSheetData = inject(Z_SHEET_DATA);

  form = new FormGroup({
    name: new FormControl(''),
    username: new FormControl(''),
  });

  ngAfterViewInit() {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }
}

@Component({
  imports: [...ZardRadioGroupImports, FormsModule, ZardSheetImports, ZardButtonComponent],
  template: `
    <div class="flex flex-col justify-center space-y-6">
      <z-radio-group class="flex flex-row gap-4" [(ngModel)]="placement">
        <label class="flex items-center gap-2 text-sm">
          <z-radio value="top" />
          top
        </label>
        <label class="flex items-center gap-2 text-sm">
          <z-radio value="bottom" />
          bottom
        </label>
        <label class="flex items-center gap-2 text-sm">
          <z-radio value="left" />
          left
        </label>
        <label class="flex items-center gap-2 text-sm">
          <z-radio value="right" />
          right
        </label>
      </z-radio-group>
      <button type="button" z-button zType="outline" class="m-auto" (click)="openSheet()">Edit profile</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetSideComponent {
  protected readonly placement = signal<'right' | 'left' | 'top' | 'bottom' | null | undefined>('right');

  private sheetService = inject(ZardSheetService);

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetSideInputComponent,
      zData: {
        name: 'Matheus Ribeiro',
        username: '@ribeiromatheus.dev',
      },
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
      zSide: this.placement(),
    });
  }
}
```

### dimensions

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';

@Component({
  selector: 'z-demo-sheet-dimensions',
  imports: [ZardButtonComponent],
  template: `
    <div class="flex flex-col gap-4">
      <button z-button type="button" zType="outline" (click)="openWideSheet()">Wide Sheet (500px)</button>
      <button z-button type="button" zType="outline" (click)="openTallSheet()">Tall Sheet (80vh)</button>
      <button z-button type="button" zType="outline" (click)="openCustomSheet()">Custom Dimensions</button>
      <button z-button type="button" zType="outline" (click)="openTopSheet()">Top Sheet</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetDimensionsComponent {
  private sheetService = inject(ZardSheetService);

  openWideSheet() {
    this.sheetService.create({
      zTitle: 'Wide Sheet',
      zDescription: 'This sheet has a custom width of 500px',
      zContent: `
        <div class="p-4">
          <p>This is a wide sheet with custom width.</p>
          <p>Perfect for forms that need more horizontal space.</p>
        </div>
      `,
      zSide: 'right',
      zWidth: '500px',
      zOkText: 'Got it',
    });
  }

  openTallSheet() {
    this.sheetService.create({
      zTitle: 'Tall Sheet',
      zDescription: 'This sheet has a custom height of 80vh',
      zContent: `
        <div class="p-4 space-y-4">
          <p>This is a tall sheet with custom height (80% of viewport height).</p>
          <p>Great for content that needs vertical space.</p>
          <div class="h-96 bg-gray-100 rounded-md flex items-center justify-center">
            <p class="text-gray-500">Large content area</p>
          </div>
        </div>
      `,
      zSide: 'left',
      zHeight: '80vh',
      zOkText: 'Close',
    });
  }

  openCustomSheet() {
    this.sheetService.create({
      zTitle: 'Custom Dimensions',
      zDescription: 'Both width and height customized',
      zContent: `
        <div class="p-4">
          <p>Width: 400px, Height: 60vh</p>
          <p>Complete control over dimensions.</p>
        </div>
      `,
      zSide: 'right',
      zWidth: '400px',
      zHeight: '60vh',
      zOkText: 'Close',
    });
  }

  openTopSheet() {
    this.sheetService.create({
      zTitle: 'Top Sheet',
      zDescription: 'Custom height for top position',
      zContent: `
        <div class="p-4">
          <p>This top sheet has a custom height.</p>
          <p>Height: 50vh</p>
        </div>
      `,
      zSide: 'top',
      zHeight: '50vh',
      zOkText: 'Done',
    });
  }
}
```

## API Reference

ZardSheetOptions Component

Configuration options for creating and managing sheet overlays.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zTitle` | Sheet title text or template | `string \| TemplateRef<T>` | `-` |
| `zDescription` | Sheet description/body text | `string` | `-` |
| `zContent` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `zSide` | Position of the sheet on screen | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` |
| `zWidth` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `zHeight` | Custom height (e.g., '80vh', '500px') | `string` | `-` |
| `zOkText` | OK button text, null to hide button | `string \| null` | `'OK'` |
| `zCancelText` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `zOkIcon` | OK button icon class name | `string` | `-` |
| `zCancelIcon` | Cancel button icon class name | `string` | `-` |
| `zOkDestructive` | Whether OK button should have destructive styling | `boolean` | `false` |
| `zOkDisabled` | Whether OK button should be disabled | `boolean` | `false` |
| `zHideFooter` | Whether to hide the footer with action buttons | `boolean` | `false` |
| `zMaskClosable` | Whether clicking outside closes the sheet | `boolean` | `true` |
| `zClosable` | Whether sheet can be closed | `boolean` | `true` |
| `zCustomClasses` | Additional CSS classes to apply | `string` | `-` |
| `zOnOk` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zOnCancel` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zData` | Data to pass to custom content components | `object` | `-` |
| `zViewContainerRef` | View container for rendering custom content | `ViewContainerRef` | `-` |

ZardSheetComponent Component

Sheet overlay component outputs.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `okTriggered` | Emitted when OK button is clicked | `EventEmitter<void>` | `-` |
| `cancelTriggered` | Emitted when Cancel button is clicked | `EventEmitter<void>` | `-` |
