---
title: June 2025 - Dialog, Popover and Dropdown Menu
description: Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.
---

# June 2025 - Dialog, Popover and Dropdown Menu

Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.

## New Components

### [Dialog](/docs/components/dialog)

Modal dialog component for displaying important content that requires user attention with backdrop overlay.

```
npx zard-cli@latest add dialog
```

```
import { ChangeDetectionStrategy, Component, inject, signal, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { Z_MODAL_DATA, ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface DialogData {
  name: string;
  username: string;
}

/** Content the service renders inside the dialog; reads what was passed through `zData`. */
@Component({
  selector: 'z-demo-dialog-preview-content',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="dialog-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="dialog-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="dialog-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="dialog-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogPreviewContent',
})
export class ZardDemoDialogPreviewContentComponent implements AfterViewInit {
  private readonly data = inject(Z_MODAL_DATA) as DialogData;

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}

@Component({
  selector: 'z-demo-dialog-preview',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Edit profile</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Edit profile</z-dialog-title>
            <z-dialog-description>Make changes to your profile here. Click save when you're done.</z-dialog-description>
          </z-dialog-header>
          <form [formGroup]="form" class="grid gap-4">
            <div class="grid gap-3">
              <label for="dialog-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="dialog-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="dialog-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="dialog-username" formControlName="username" />
            </div>
          </form>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="button" z-button (click)="save()">Save changes</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogPreviewComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Samuel Rizzon'),
    username: new FormControl('@samuelrizzondev'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogPreviewContentComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } satisfies DialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

### [Popover](/docs/components/popover)

Floating content container that appears on trigger with customizable positioning and close behavior.

```
npx zard-cli@latest add popover
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="popoverContent">Open popover</button>

    <ng-template #popoverContent>
      <z-popover class="w-80">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div class="grid gap-2">
          @for (dimension of dimensions; track dimension.id) {
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm" [attr.for]="dimension.id">{{ dimension.label }}</label>
              <input
                z-input
                type="text"
                class="col-span-2 h-8"
                [id]="dimension.id"
                [value]="dimension.value"
                [attr.aria-label]="dimension.label"
              />
            </div>
          }
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPreviewComponent {
  readonly dimensions = [
    { id: 'width', label: 'Width', value: '100%' },
    { id: 'maxWidth', label: 'Max. width', value: '300px' },
    { id: 'height', label: 'Height', value: '25px' },
    { id: 'maxHeight', label: 'Max. height', value: 'none' },
  ];
}
```

### [Alert Dialog](/docs/components/alert-dialog)

Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.

```
npx zard-cli@latest add alert-dialog
```

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-preview',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account from our servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogPreviewComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription: 'This action cannot be undone. This will permanently delete your account from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}
```

### [Dropdown](/docs/components/dropdown)

Context menu with hierarchical actions, keyboard navigation, and support for nested submenus.

```
npx zard-cli@latest add dropdown
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-basic',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDropdownBasicComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```
