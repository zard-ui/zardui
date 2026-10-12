import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  Preview01AccountAccessComponent,
  Preview01CardOverviewComponent,
  Preview01ClaimableBalanceComponent,
  Preview01ContributionHistoryComponent,
  Preview01CoverArtComponent,
  Preview01DividendIncomeComponent,
  Preview01EmptyConnectBankComponent,
  Preview01EmptyDistributeTrackComponent,
  Preview01EmptyExploreCatalogComponent,
  Preview01FaqComponent,
  Preview01FrontDoorComponent,
  Preview01IndexInvestingComponent,
  Preview01KitchenIslandComponent,
  Preview01LoadingCardComponent,
  Preview01NewMilestoneComponent,
  Preview01NotificationSettingsComponent,
  Preview01PaymentsComponent,
  Preview01PayoutThresholdComponent,
  Preview01PowerUsageComponent,
  Preview01PreferencesComponent,
  Preview01QrConnectComponent,
  Preview01ReceivingMethodComponent,
  Preview01RecentTransactionsComponent,
  Preview01ReleaseCatalogComponent,
  Preview01RollerShadesComponent,
  Preview01SavingsProgressComponent,
  Preview01SavingsTargetsComponent,
  Preview01SidebarNavComponent,
  Preview01SocialLinksComponent,
  Preview01StockPerformanceComponent,
  Preview01SyncingStateComponent,
  Preview01TransferFundsComponent,
  Preview01UpcomingPaymentsComponent,
} from './preview-01';

/**
 * Canvas "01": shadcn's `blocks/preview-02` — 33 cards in seven columns (the third spans two) on a very wide grid that
 * scrolls sideways. The wrappers carry shadcn's classes verbatim; each card is a port of its card file.
 */
@Component({
  selector: 'z-create-canvas-01',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Preview01AccountAccessComponent,
    Preview01CardOverviewComponent,
    Preview01ClaimableBalanceComponent,
    Preview01ContributionHistoryComponent,
    Preview01CoverArtComponent,
    Preview01DividendIncomeComponent,
    Preview01EmptyConnectBankComponent,
    Preview01EmptyDistributeTrackComponent,
    Preview01EmptyExploreCatalogComponent,
    Preview01FaqComponent,
    Preview01FrontDoorComponent,
    Preview01IndexInvestingComponent,
    Preview01KitchenIslandComponent,
    Preview01LoadingCardComponent,
    Preview01NewMilestoneComponent,
    Preview01NotificationSettingsComponent,
    Preview01PaymentsComponent,
    Preview01PayoutThresholdComponent,
    Preview01PowerUsageComponent,
    Preview01PreferencesComponent,
    Preview01QrConnectComponent,
    Preview01ReceivingMethodComponent,
    Preview01RecentTransactionsComponent,
    Preview01ReleaseCatalogComponent,
    Preview01RollerShadesComponent,
    Preview01SavingsProgressComponent,
    Preview01SavingsTargetsComponent,
    Preview01SidebarNavComponent,
    Preview01SocialLinksComponent,
    Preview01StockPerformanceComponent,
    Preview01SyncingStateComponent,
    Preview01TransferFundsComponent,
    Preview01UpcomingPaymentsComponent,
  ],
  host: { class: 'block' },
  template: `
    <div
      class="bg-muted 3xl:[--gap:--spacing(12)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)] overflow-x-auto overflow-y-hidden contain-[paint] [--gap:--spacing(4)] md:[--gap:--spacing(10)]"
    >
      <div class="flex w-full min-w-max justify-center">
        <div
          class="bg-muted dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] grid w-[2400px] grid-cols-7 items-start gap-(--gap) p-(--gap) md:w-[3000px] *:[div]:gap-(--gap)"
          data-slot="capture-target"
          data-canvas="preview-01"
        >
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-01-contribution-history />
            <z-preview-01-empty-distribute-track />
            <z-preview-01-qr-connect />
            <z-preview-01-dividend-income />
            <z-preview-01-index-investing />
            <z-preview-01-syncing-state />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-01-payout-threshold />
            <z-preview-01-claimable-balance />
            <z-preview-01-preferences />
            <z-preview-01-savings-progress />
            <z-preview-01-kitchen-island />
          </div>
          <div class="col-span-2 flex flex-col p-1 [contain-intrinsic-size:760px_1200px] [content-visibility:auto]">
            <z-preview-01-savings-targets />
            <z-preview-01-recent-transactions />
            <div class="grid grid-cols-2 items-start gap-(--gap)">
              <div class="flex flex-col gap-(--gap)">
                <z-preview-01-sidebar-nav />
                <z-preview-01-faq />
              </div>
              <div class="flex flex-col gap-(--gap)">
                <z-preview-01-payments />
                <z-preview-01-front-door />
              </div>
            </div>
            <z-preview-01-release-catalog />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-01-account-access />
            <z-preview-01-card-overview />
            <z-preview-01-transfer-funds />
            <z-preview-01-cover-art />
            <z-preview-01-loading-card />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-01-receiving-method />
            <z-preview-01-power-usage />
            <z-preview-01-empty-connect-bank />
            <z-preview-01-upcoming-payments />
            <z-preview-01-roller-shades />
          </div>
          <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
            <z-preview-01-stock-performance />
            <z-preview-01-empty-explore-catalog />
            <z-preview-01-new-milestone />
            <z-preview-01-social-links />
            <z-preview-01-notification-settings />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CanvasOneComponent {}
