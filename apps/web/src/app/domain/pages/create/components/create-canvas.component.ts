import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import {
  CardAccountAccessComponent,
  CardAnalyticsComponent,
  CardClaimableBalanceComponent,
  CardContributionHistoryComponent,
  CardDividendIncomeComponent,
  CardEmptyDistributeTrackComponent,
  CardNewChatComponent,
  CardNewMilestoneComponent,
  CardNotificationSettingsComponent,
  CardPaymentsComponent,
  CardPayoutThresholdComponent,
  CardPowerUsageComponent,
  CardQrConnectComponent,
  CardSavingsTargetsComponent,
  CardSidebarNavComponent,
  CardTransferFundsComponent,
  CardUiElementsComponent,
} from '../../home/components/cards';
import { CreateBuilderService } from '../services/create-builder.service';

/**
 * O canvas: os mesmos cards da home, com os tokens do preset aplicados.
 *
 * Serem os mesmos é o ponto. Não existe uma versão "de demonstração" que possa
 * divergir do que o `add` instala — o que a pessoa vê aqui é literalmente o que
 * a home mostra, com outras variáveis CSS.
 *
 * O mosaico é deliberadamente **cortado** nas bordas. A tentação é encolhê-lo
 * até caber, e isso mataria o efeito: são os cards saindo pela borda que
 * comunicam "tem mais coisa aqui" em vez de "isto é tudo".
 *
 * As duas páginas existem porque um preset muda coisas que nenhum conjunto de
 * quatro colunas mostra ao mesmo tempo — a página 2 é onde estão o vazio, o
 * gráfico e a lista de preferências.
 */
@Component({
  selector: 'z-create-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardUiElementsComponent,
    CardSidebarNavComponent,
    CardSavingsTargetsComponent,
    CardContributionHistoryComponent,
    CardClaimableBalanceComponent,
    CardDividendIncomeComponent,
    CardNewMilestoneComponent,
    CardPayoutThresholdComponent,
    CardAccountAccessComponent,
    CardQrConnectComponent,
    CardNewChatComponent,
    CardPaymentsComponent,
    CardTransferFundsComponent,
    CardEmptyDistributeTrackComponent,
    CardAnalyticsComponent,
    CardNotificationSettingsComponent,
    CardPowerUsageComponent,
  ],
  host: {
    class:
      'ring-foreground/10 md:ring-muted dark:ring-foreground/10 relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] ring',
  },
  template: `
    <div
      class="bg-muted text-foreground dark:bg-background no-scrollbar h-full min-h-0 overflow-x-hidden overflow-y-auto"
      [class.dark]="builder.previewDark()"
      [style]="builder.scopedStyles()"
      [attr.dir]="builder.preset().rtl ? 'rtl' : 'ltr'"
    >
      <!-- Colunas de largura fixa, e não um grid que se ajusta: é o que faz o
           mosaico transbordar a moldura e ser cortado nela. Um grid elástico
           caberia sempre, e um preview que cabe sempre parece um catálogo
           completo com quatro cards.

           400px por coluna, e não os 320px da parede da home: aqui cabem menos
           colunas de propósito. O preview existe para julgar tipografia, raio e
           espaçamento de um card, e num terço a menos de largura o que se julga
           é a compressão, não o preset. -->
      <div
        class="3xl:[--canvas-gap:--spacing(10)] grid auto-cols-(--canvas-col) grid-flow-col items-start gap-(--canvas-gap) p-(--canvas-gap) [--canvas-col:25rem] [--canvas-gap:--spacing(7)]"
      >
        @if (page() === 1) {
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-ui-elements />
            <z-card-sidebar-nav />
            <z-card-savings-targets />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-contribution-history />
            <z-card-claimable-balance />
            <z-card-dividend-income />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-new-milestone />
            <z-card-payout-threshold />
            <z-card-account-access />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-qr-connect />
            <z-card-new-chat />
            <z-card-payments />
          </div>
        } @else {
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-notification-settings />
            <z-card-power-usage />
            <z-card-analytics />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-transfer-funds />
            <z-card-empty-distribute-track />
            <z-card-claimable-balance />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-payments />
            <z-card-contribution-history />
            <z-card-qr-connect />
          </div>
          <div class="flex flex-col gap-(--canvas-gap)">
            <z-card-account-access />
            <z-card-savings-targets />
            <z-card-dividend-income />
          </div>
        }
      </div>
    </div>

    <nav
      class="dark bg-card/90 absolute right-3 bottom-3 z-20 flex items-center gap-1 rounded-xl p-1 shadow-xl backdrop-blur-xl"
      aria-label="Preview pages"
    >
      @for (item of pages; track item) {
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground h-7 min-w-8 rounded-lg px-2.5 text-xs font-medium transition-colors"
          [class]="page() === item ? 'bg-accent text-accent-foreground' : ''"
          [attr.aria-current]="page() === item ? 'true' : null"
          [attr.aria-label]="'Preview page ' + item"
          (click)="page.set(item)"
        >
          {{ item.toString().padStart(2, '0') }}
        </button>
      }
    </nav>
  `,
})
export class CreateCanvasComponent {
  readonly builder = inject(CreateBuilderService);

  readonly pages = [1, 2] as const;
  readonly page = signal<(typeof this.pages)[number]>(1);
}
