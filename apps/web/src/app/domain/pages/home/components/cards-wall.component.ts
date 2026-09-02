import { ChangeDetectionStrategy, Component } from '@angular/core';

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
  CardUiElementsComponent,
} from './cards';

/**
 * A parede de cards da home.
 *
 * Cinco colunas que aparecem uma a uma conforme a tela cresce, sobre um fundo
 * `muted` no claro e `background` no escuro. O gradiente de cima e o de baixo
 * não são decoração: eles é que fazem a parede *terminar* sem terminar — o corte
 * comunica que há mais biblioteca do que cabe na tela, o que um grid que acaba
 * limpo não comunicaria.
 *
 * As colunas são fixas, e não um `masonry`: a ordem em que os cards aparecem é
 * uma decisão de leitura (o card de componentes primeiro, o denso no meio, o
 * vazio por último), e um algoritmo de empacotamento a desfaria a cada largura.
 */
@Component({
  selector: 'z-cards-wall',
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
    CardEmptyDistributeTrackComponent,
    CardAnalyticsComponent,
    CardNotificationSettingsComponent,
    CardPowerUsageComponent,
  ],
  host: { class: 'block' },
  template: `
    <!-- As colunas respondem à largura da parede, e não à da janela.
         Não é preciosismo: o site tem um modo de layout fixo que ainda encolhe
         quem estiver em volta, e num breakpoint de viewport a quinta coluna
         apareceria a 1900px de janela dentro do espaço que sobrou — cinco
         colunas espremidas, com "Help Center" quebrando em duas linhas. A
         largura que importa é a que a parede realmente tem. -->
    <div
      class="bg-muted dark:bg-background @container relative flex w-full max-w-none flex-col overflow-hidden p-6 pb-0!"
    >
      <!-- Os cortes saem de 320px por coluna mais o gap: 2 × 320 + 40 = 680px,
           3 × 320 + 80 = 1024px, e assim por diante.

           O gap é declarado aqui, e não no elemento acima: quem declara o
           container não responde às próprias container queries, e lá as três
           faixas de gap nunca valeriam — o valor cairia sempre no primeiro. -->
      <div
        class="relative z-10 mx-auto grid max-w-[1900px] grid-cols-1 gap-(--gap) [--gap:--spacing(6)] @min-[42.5rem]:grid-cols-2 @min-[64rem]:grid-cols-3 @min-[64rem]:[--gap:--spacing(8)] @min-[85.5rem]:grid-cols-4 @min-[107rem]:grid-cols-5 @min-[107rem]:[--gap:--spacing(10)]"
      >
        <div class="flex flex-col items-start gap-(--gap)">
          <z-card-ui-elements />
          <z-card-sidebar-nav />
          <z-card-savings-targets />
        </div>

        <div class="hidden flex-col gap-(--gap) @min-[64rem]:flex">
          <z-card-contribution-history />
          <z-card-claimable-balance />
          <z-card-dividend-income />
        </div>

        <div class="hidden flex-col gap-(--gap) @min-[85.5rem]:flex">
          <z-card-new-milestone />
          <z-card-payout-threshold />
          <z-card-account-access />
        </div>

        <!-- Vem depois no DOM mas aparece já com duas colunas: é o par que abre a
             parede na tela mais estreita que ainda a mostra. -->
        <div class="hidden flex-col gap-(--gap) @min-[42.5rem]:flex">
          <z-card-qr-connect />
          <z-card-new-chat />
          <z-card-payments />
        </div>

        <div class="hidden flex-col gap-(--gap) @min-[107rem]:flex">
          <z-card-empty-distribute-track />
          <z-card-analytics />
          <z-card-notification-settings />
          <z-card-power-usage />
        </div>
      </div>

      <!-- Dois véus, e não um mask-image: a máscara cobraria composite do
           elemento inteiro a cada scroll, e esta é a página mais visitada. -->
      <div
        class="from-background via-muted absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b to-transparent dark:hidden"
        aria-hidden="true"
      ></div>
      <div
        class="from-background via-muted/80 dark:via-background/80 absolute inset-x-0 bottom-0 z-20 h-64 bg-linear-to-t to-transparent"
        aria-hidden="true"
      ></div>
    </div>
  `,
})
export class CardsWallComponent {}
