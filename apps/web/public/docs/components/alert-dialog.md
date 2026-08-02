---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
---

# Alert Dialog

A modal dialog that interrupts the user with important content and expects a response.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-default',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogDefaultComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

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

## Installation

## Command

```
npx zard-cli@latest add alert-dialog
```

## Usage

```
import { ZardAlertDialogComponent } from '@/shared/components/alert-dialog/alert-dialog.component';
```

```
<z-alert-dialog
  zTitle="Are you absolutely sure?"
  zDescription="This action cannot be undone."
></z-alert-dialog>
```

## Examples

### small

Use the `zSize: "sm"` option to make the alert dialog smaller.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-small',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogSmallComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open() {
    this.alertDialogService.create({
      zSize: 'sm',
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}
```

### media

Pass a `<ng-template>` via `zMedia` to add a media element such as an icon or image to the alert dialog.

```
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleFadingPlus } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideCircleFadingPlus" />
    </ng-template>
    <button z-button zType="outline" (click)="open(mediaIcon)">Share Project</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleFadingPlus })],
})
export class ZardDemoAlertDialogMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zMedia: media,
      zTitle: 'Share this project?',
      zDescription: 'Anyone with the link will be able to view and edit this project.',
      zOkText: 'Share',
      zCancelText: 'Cancel',
    });
  }
}
```

### small with media

Combine `zSize: "sm"` with the `zMedia` template to add a media element to the smaller alert dialog.

```
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-small-with-media',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideBluetooth" />
    </ng-template>
    <button z-button zType="outline" (click)="open(mediaIcon)">Show Dialog</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth })],
})
export class ZardDemoAlertDialogSmallWithMediaComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zTitle: 'Allow accessory to connect?',
      zDescription: 'Do you want to allow the USB accessory to connect to this device?',
      zOkText: 'Allow',
      zCancelText: "Don't allow",
    });
  }
}
```

### destructive

Use `zOkDestructive: true` along with `zMediaClass` to add a destructive action to the alert dialog.

```
import { ChangeDetectionStrategy, Component, inject, type TemplateRef } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';

import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'zard-demo-alert-dialog-destructive',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <ng-template #mediaIcon>
      <ng-icon name="lucideTrash2" />
    </ng-template>
    <button z-button zType="destructive" (click)="open(mediaIcon)">Delete Chat</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrash2 })],
})
export class ZardDemoAlertDialogDestructiveComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  open(media: TemplateRef<void>) {
    this.alertDialogService.create({
      zSize: 'sm',
      zMedia: media,
      zMediaClass: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
      zTitle: 'Delete chat?',
      zDescription:
        'This will permanently delete this chat conversation. View <a href="#">Settings</a> delete any memories saved during this chat.',
      zOkText: 'Delete',
      zCancelText: 'Cancel',
      zOkDestructive: true,
    });
  }
}
```

## API Reference

ZardAlertDialogService Component

Configuration options for creating alert dialogs.

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| `zTitle` | Dialog title text or template | `string \| TemplateRef<T>` | `-` |
| `zDescription` | Dialog description/body text | `string` | `-` |
| `zContent` | Custom content component, template, or HTML | `string \| TemplateRef<T> \| Type<T>` | `-` |
| `zData` | Data to pass to custom content components | `object` | `-` |
| `zOkText` | OK button text, null to hide button | `string \| null` | `'Continue'` |
| `zCancelText` | Cancel button text, null to hide button | `string \| null` | `'Cancel'` |
| `zOkDestructive` | Whether OK button should have destructive styling | `boolean` | `false` |
| `zOkDisabled` | Whether OK button should be disabled | `boolean` | `false` |
| `zMaskClosable` | Whether clicking outside closes the dialog | `boolean` | `false` |
| `zClosable` | Whether dialog can be closed | `boolean` | `true` |
| `zWidth` | Custom width (e.g., '400px', '50%') | `string` | `-` |
| `zCustomClasses` | Additional CSS classes to apply | `ClassValue` | `-` |
| `zOnOk` | OK button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zOnCancel` | Cancel button click handler | `EventEmitter<T> \| OnClickCallback<T>` | `-` |
| `zViewContainerRef` | View container for rendering custom content | `ViewContainerRef` | `-` |
