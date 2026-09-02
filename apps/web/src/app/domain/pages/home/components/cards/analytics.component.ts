import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

/**
 * O card baixo da parede: título, número e uma linha.
 *
 * A linha é um `path` desenhado à mão em `viewBox` sem escala fixa — ela precisa
 * ocupar a largura do card, seja qual for, e um SVG com `preserveAspectRatio`
 * desligado faz isso sem nenhum cálculo em tempo de execução.
 */
@Component({
  selector: 'z-card-analytics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardBadgeComponent, ZardButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card zSize="sm" class="pb-0!">
      <z-card-header>
        <h3 z-card-title zTitle="Analytics"></h3>
        <!-- A descrição mistura texto e badge, e o componente só aceita string
             ou template — daí o ng-template em vez de conteúdo projetado. -->
        <ng-template #visitors>
          418.2K Visitors
          <z-badge>+10%</z-badge>
        </ng-template>
        <p z-card-description class="flex items-center gap-1.5" [zDescription]="visitors"></p>
        <div z-card-action>
          <button type="button" z-button zType="outline" zSize="sm">View Analytics</button>
        </div>
      </z-card-header>

      <svg
        viewBox="0 0 100 86"
        preserveAspectRatio="none"
        class="text-chart-1 aspect-[1/0.35] w-full"
        role="img"
        aria-label="Visitor trend"
      >
        <path [attr.d]="areaPath" fill="currentColor" opacity="0.28" />
        <path
          [attr.d]="strokePath"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </z-card>
  `,
})
export class CardAnalyticsComponent {
  readonly areaPath = 'M0 52L18 40L36 46L54 70L72 50L100 49V86H0Z';
  readonly strokePath = 'M0 52L18 40L36 46L54 70L72 50L100 49';
}
