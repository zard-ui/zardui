import { InjectionToken } from '@angular/core';

export interface ZardInputOtpSlotApi {
  readonly zIndex: () => number;
  focus(): void;
  updateState(char: string, isActive: boolean, hasFakeCaret: boolean): void;
}

export const ZARD_INPUT_OTP_SLOT = new InjectionToken<ZardInputOtpSlotApi>('ZardInputOtpSlot');
