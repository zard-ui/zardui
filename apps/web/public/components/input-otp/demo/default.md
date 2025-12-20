```angular-ts showLineNumbers copyButton
import { Component } from '@angular/core';

import { ZardInputOtpGroupComponent } from '../input-otp-group.component';
import { ZardInputOtpSeparatorComponent } from '../input-otp-separator.component';
import { ZardInputOtpSlotComponent } from '../input-otp-slot.component';
import { ZardInputOtpComponent } from '../input-otp.component';

@Component({
  selector: 'zard-demo-input-otp-default',
  imports: [
    ZardInputOtpComponent,
    ZardInputOtpSlotComponent,
    ZardInputOtpGroupComponent,
    ZardInputOtpSeparatorComponent,
  ],
  standalone: true,
  template: `
    <z-input-otp [zMaxLength]="6">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpDefaultComponent {}

```