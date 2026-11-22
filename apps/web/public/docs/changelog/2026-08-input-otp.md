---
title: August 2026 - Input OTP
description: One-time passwords land this month. We added the Input OTP component, with grouped slots, separators, pattern validation, and paste support out of the box.
---

# August 2026 - Input OTP

One-time passwords land this month. We added the Input OTP component, with grouped slots, separators, pattern validation, and paste support out of the box.

## New Components

### [Input OTP](/docs/components/input-otp)

Accessible one-time password input with grouped slots, custom separators, and copy-paste support.

```
npx zard-cli@latest add input-otp
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-preview',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpPreviewComponent {
  value = '123456';
}
```
