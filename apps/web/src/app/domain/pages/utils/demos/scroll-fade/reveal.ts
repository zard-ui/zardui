import { ChangeDetectionStrategy, Component } from '@angular/core';

const ROWS = [
  'Attach a payment method',
  'Confirm the billing address',
  'Choose an invoice cadence',
  'Set a spending alert',
  'Invite a billing contact',
  'Review the tax settings',
  'Enable receipts by email',
  'Download the last statement',
  'Close the account',
];

@Component({
  selector: 'z-utils-scroll-fade-reveal',
  template: `
    <div class="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">default reveal</p>
        <div class="bg-card scroll-fade h-56 overflow-y-auto rounded-lg border px-4">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-muted-foreground font-mono text-xs">[--scroll-fade-reveal:32px]</p>
        <div class="bg-card scroll-fade h-56 overflow-y-auto rounded-lg border px-4 [--scroll-fade-reveal:32px]">
          @for (row of rows; track row) {
            <p class="border-b py-3 text-sm last:border-0">{{ row }}</p>
          }
        </div>
      </div>
    </div>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardUtilsScrollFadeRevealComponent {
  protected readonly rows = ROWS;
}
