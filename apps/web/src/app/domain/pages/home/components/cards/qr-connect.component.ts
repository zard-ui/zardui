import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';

interface Cell {
  readonly x: number;
  readonly y: number;
}

/** O desenho do QR, linha a linha — `1` é módulo preto. */
const QR_ROWS = [
  '111111100101101111111',
  '100000101001001000001',
  '101110101111101011101',
  '101110100100001011101',
  '101110101010101011101',
  '100000100111001000001',
  '111111101010101111111',
  '000000001101000000000',
  '101011111001111010110',
  '010100001110010101001',
  '111010111011101111010',
  '001101000101000010101',
  '110111101111010111011',
  '000000001001010001010',
  '111111101101111101001',
  '100000100010001001111',
  '101110101011101110100',
  '101110100110100010011',
  '101110101000111101110',
  '100000101101000011001',
  '111111101011101101111',
];

/**
 * O QR de emparelhamento — o card que dá respiro à coluna.
 *
 * O código é desenhado em SVG a partir de uma matriz literal, e não gerado nem
 * carregado como imagem: ele não precisa levar a lugar nenhum, precisa parecer
 * um QR. Uma imagem custaria uma requisição e um `layout shift`; um gerador
 * custaria uma dependência para produzir sempre o mesmo desenho.
 *
 * O fundo branco é literal e fica branco em qualquer tema: um QR invertido não é
 * legível por leitor nenhum, e este card também é uma amostra do que o tema faz
 * *não* fazer.
 */
@Component({
  selector: 'z-card-qr-connect',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-content class="flex justify-center pt-6">
        <div class="rounded-xl border bg-white p-4">
          <svg viewBox="0 0 21 21" class="size-40 text-black" role="img" aria-label="Connect device QR code">
            <rect width="21" height="21" fill="white" />
            @for (cell of cells; track cell.x + '-' + cell.y) {
              <rect [attr.x]="cell.x" [attr.y]="cell.y" width="1" height="1" />
            }
          </svg>
        </div>
      </z-card-content>

      <z-card-header class="text-center">
        <h3 z-card-title zTitle="Scan to connect your mobile device"></h3>
        <p
          z-card-description
          class="text-balance"
          zDescription="Open the Ledger mobile app and scan this code to link your device."
        ></p>
      </z-card-header>
    </z-card>
  `,
})
export class CardQrConnectComponent {
  readonly cells: readonly Cell[] = QR_ROWS.flatMap((row, y) =>
    [...row].map((value, x) => ({ value, x, y })).filter(cell => cell.value === '1'),
  ).map(({ x, y }) => ({ x, y }));
}
