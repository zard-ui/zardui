import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

interface Reading {
  readonly hour: string;
  readonly usage: number;
}

/**
 * Consumo por hora, e dois números embaixo do gráfico.
 *
 * Mesma escolha do histórico de aportes: barras em `div`. Oito retângulos e
 * oito rótulos não justificam uma biblioteca de gráficos num card que fecha a
 * quinta coluna.
 */
@Component({
  selector: 'z-card-power-usage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardSeparatorComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Power Usage"></h3>
        <p z-card-description zDescription="Whole Home"></p>
      </z-card-header>

      <z-card-content class="flex flex-col gap-4">
        <div class="flex h-[140px] w-full items-end gap-2" role="img" aria-label="Power usage by hour">
          @for (reading of readings; track reading.hour) {
            <div class="flex h-full flex-1 flex-col justify-end gap-1.5">
              <div class="bg-chart-2 min-h-2 rounded-t" [style.height.%]="(reading.usage / maxUsage) * 100"></div>
              <span class="text-muted-foreground text-center text-xs">{{ reading.hour }}</span>
            </div>
          }
        </div>

        <z-separator />

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-0.5">
            <span class="text-muted-foreground text-sm">Currently Using</span>
            <span class="text-lg font-semibold tabular-nums">3.4 kW</span>
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-muted-foreground text-sm">Solar Gen</span>
            <span class="text-lg font-semibold tabular-nums">+1.2 kW</span>
          </div>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardPowerUsageComponent {
  readonly readings: readonly Reading[] = [
    { hour: '6a', usage: 1.2 },
    { hour: '8a', usage: 2.8 },
    { hour: '10a', usage: 3.1 },
    { hour: '12p', usage: 2.4 },
    { hour: '2p', usage: 3.4 },
    { hour: '4p', usage: 2.9 },
    { hour: '6p', usage: 3.8 },
    { hour: '8p', usage: 3.2 },
  ];

  readonly maxUsage = Math.max(...this.readings.map(reading => reading.usage));
}
