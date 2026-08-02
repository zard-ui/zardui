import { ZardInputOtpGroupComponent } from '@/shared/components/input-otp/input-otp-group.component';
import { ZardInputOtpSeparatorComponent } from '@/shared/components/input-otp/input-otp-separator.component';
import { ZardInputOtpSignalComponent } from '@/shared/components/input-otp/input-otp-signal.component';
import { ZardInputOtpSlotComponent } from '@/shared/components/input-otp/input-otp-slot.component';
import { ZardInputOtpComponent } from '@/shared/components/input-otp/input-otp.component';

export const ZardInputOtpImports = [
  ZardInputOtpComponent,
  ZardInputOtpSignalComponent,
  ZardInputOtpGroupComponent,
  ZardInputOtpSlotComponent,
  ZardInputOtpSeparatorComponent,
] as const;
