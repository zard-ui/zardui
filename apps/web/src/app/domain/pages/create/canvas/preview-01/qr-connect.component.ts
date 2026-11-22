import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';

/**
 * The modules of `https://ledger.app/connect/jd-4829` at error correction level M — the matrix shadcn's `react-qr-code`
 * draws, generated once with the same encoder (qr.js) so the code scans and looks identical.
 */
const QR_MODULES = [
  '11111110000011001111001111111',
  '10000010010011110010001000001',
  '10111010000101001111101011101',
  '10111010010001110010001011101',
  '10111010010111101010001011101',
  '10000010101101100011001000001',
  '11111110101010101010101111111',
  '00000000010110100111100000000',
  '10010110110100011001010100000',
  '11011000111110110100111001001',
  '11111011011000001111010101110',
  '10111000011010110010100100110',
  '01111011110010010100111001011',
  '00101100011110001111100000000',
  '10011010100000001100101111111',
  '10110000000101100100111001010',
  '01101110001001101110100000010',
  '00000000000100000100111101001',
  '10011011000001001100110110011',
  '00001000011011011110010000011',
  '10100111000100110000111110100',
  '00000000111101000000100010111',
  '11111110000001100110101010010',
  '10000010110101011000100011111',
  '10111010000000100100111110001',
  '10111010111010101100001111110',
  '10111010010010000100000011101',
  '10000010001100011100110100010',
  '11111110100011010110110101010',
];

const QR_PATH = QR_MODULES.flatMap((row, y) =>
  [...row].flatMap((cell, x) => (cell === '1' ? [`M${x} ${y}h1v1h-1z`] : [])),
).join('');

@Component({
  selector: 'z-preview-01-qr-connect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <z-card>
      <z-card-content class="flex justify-center pt-6">
        <div class="rounded-xl border bg-white p-4">
          <svg width="160" height="160" [attr.viewBox]="viewBox" role="img" aria-label="QR code">
            <path fill="#FFFFFF" [attr.d]="background" shape-rendering="crispEdges" />
            <path fill="#000000" [attr.d]="path" shape-rendering="crispEdges" />
          </svg>
        </div>
      </z-card-content>
      <z-card-header class="text-center">
        <z-card-title zTitle="Scan to connect your mobile device" />
        <z-card-description zDescription="Open the Ledger mobile app and scan this code to link your device." />
      </z-card-header>
      <z-card-footer>
        <button type="button" z-button zType="secondary" class="w-full">Got it</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01QrConnectComponent {
  protected readonly viewBox = `0 0 ${QR_MODULES.length} ${QR_MODULES.length}`;
  protected readonly background = `M0,0 h${QR_MODULES.length}v${QR_MODULES.length}H0z`;
  protected readonly path = QR_PATH;
}
