---
title: October 2025 - Sheet and Empty
description: Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.
---

# October 2025 - Sheet and Empty

Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.

## New Components

### [Sheet](/docs/components/sheet)

A versatile sheet component for side panels and overlays with customizable positioning and smooth transitions.

```
npx zard-cli@latest add sheet
```

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders inside the sheet. */
@Component({
  selector: 'z-demo-sheet-preview-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="sheet-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetPreviewForm',
})
export class ZardDemoSheetPreviewFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  selector: 'z-demo-sheet-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ZardSheetImports, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

        <z-sheet [(zVisible)]="visible">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label for="sheet-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="sheet-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="sheet-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="sheet-username" formControlName="username" />
            </div>
          </form>
          <z-sheet-footer>
            <button type="button" z-button (click)="save()">Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Close</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetPreviewComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetPreviewFormComponent,
      zOkText: 'Save changes',
      zCancelText: 'Close',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

### [Empty](/docs/components/empty)

Clean empty state component for "no data" scenarios with customizable messages and icons.

```
npx zard-cli@latest add empty
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-preview',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      zTitle="No Projects Yet"
      zDescription="You haven't created any projects yet. Get started by creating your first project."
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>Create Project</button>
      </ng-template>

      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">Import Project</button>
      </ng-template>

      <a z-button zType="link" zSize="sm" class="text-muted-foreground" href="#">
        Learn More
        <ng-icon name="lucideArrowUpRight" />
      </a>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideFolderCode,
    }),
  ],
})
export class ZardDemoEmptyPreviewComponent {}
```
