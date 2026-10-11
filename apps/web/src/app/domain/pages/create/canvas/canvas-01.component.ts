import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';
import { ZardSkeletonComponent } from '@zard/components/skeleton/skeleton.component';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

import { canvasIcons } from './canvas-icons';
import {
  CardAccountAccessComponent,
  CardClaimableBalanceComponent,
  CardContributionHistoryComponent,
  CardDividendIncomeComponent,
  CardEmptyDistributeTrackComponent,
  CardNewMilestoneComponent,
  CardNotificationSettingsComponent,
  CardPayoutThresholdComponent,
  CardPowerUsageComponent,
  CardQrConnectComponent,
  CardSavingsTargetsComponent,
  CardSidebarNavComponent,
  CardTransferFundsComponent,
} from '../../home/components/cards';

interface Transaction {
  readonly name: string;
  readonly category: string;
  readonly when: string;
  readonly amount: string;
  readonly positive?: boolean;
}

/**
 * Canvas "01": the finance overview. The thirteen cards of the home wall plus the ones the wall does not carry,
 * laid out as seven columns in a very wide, horizontally scrolling grid.
 */
@Component({
  selector: 'z-create-canvas-01',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardInputComponent,
    ZardProgressComponent,
    ZardSkeletonComponent,
    ZardSwitchComponent,
    NgIcon,
    CardAccountAccessComponent,
    CardClaimableBalanceComponent,
    CardContributionHistoryComponent,
    CardDividendIncomeComponent,
    CardEmptyDistributeTrackComponent,
    CardNewMilestoneComponent,
    CardNotificationSettingsComponent,
    CardPayoutThresholdComponent,
    CardPowerUsageComponent,
    CardQrConnectComponent,
    CardSavingsTargetsComponent,
    CardSidebarNavComponent,
    CardTransferFundsComponent,
  ],
  viewProviders: [canvasIcons()],
  host: { class: 'block' },
  template: `
    <div class="grid w-[2960px] grid-cols-7 items-start gap-11 p-11" data-canvas="preview-01">
      <div class="flex flex-col gap-11">
        <z-card-contribution-history />
        <z-card-empty-distribute-track />
        <z-card-qr-connect />
        <z-card-dividend-income />
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Dollar-Cost Averaging" />
            <p z-card-description zDescription="A strategy for building wealth over time."></p>
          </z-card-header>
          <z-card-content>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Over time, this smooths out the average cost of your investments. When prices drop, your fixed amount buys
              more shares. When prices rise, you buy fewer. The result is a lower average cost per share.
            </p>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-8 text-center">
            <ng-icon name="lucideRefreshCw" class="text-muted-foreground size-5" />
            <p class="text-sm font-medium">Syncing your accounts</p>
            <p class="text-muted-foreground text-sm">
              We're pulling in your latest transactions. This usually takes a few seconds.
            </p>
            <button type="button" z-button zType="outline" zSize="sm">Cancel</button>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card-payout-threshold />
        <z-card-claimable-balance />
        <z-card-notification-settings />
        <z-card>
          <z-card-content class="flex flex-col items-center gap-4">
            <div
              class="border-muted flex size-36 items-center justify-center rounded-full border-[14px] border-t-(--chart-1) border-r-(--chart-1) border-b-(--chart-1)"
              role="img"
              aria-label="80% of the goal reached"
            >
              <div class="text-center">
                <div class="text-xl font-semibold tabular-nums">$24,000</div>
                <div class="text-muted-foreground text-xs">80% of $30,000</div>
              </div>
            </div>
            <dl class="grid w-full gap-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-muted-foreground">Projected Finish</dt>
                <dd class="font-medium">October 2024</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted-foreground">Monthly Average</dt>
                <dd class="font-medium">$1,250</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted-foreground">Top Contributor</dt>
                <dd class="font-medium">Auto-Transfer</dd>
              </div>
            </dl>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Kitchen Island" />
            <p z-card-description zDescription="Hue Color Ambient"></p>
            <div z-card-action>
              <z-switch [zChecked]="true"><span class="sr-only">Kitchen island lights</span></z-switch>
            </div>
          </z-card-header>
          <z-card-content class="flex flex-col gap-4">
            @for (control of lights; track control.label) {
              <div class="grid gap-2">
                <div class="flex justify-between text-sm font-medium">
                  <span>{{ control.label }}</span>
                  <span class="text-muted-foreground tabular-nums">{{ control.value }}%</span>
                </div>
                <z-progress [value]="control.value" [attr.aria-label]="control.label" />
              </div>
            }
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card-savings-targets />
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Recent Transactions" />
            <p z-card-description zDescription="Your latest account activity."></p>
            <div z-card-action><button type="button" z-button zType="outline" zSize="sm">View All</button></div>
          </z-card-header>
          <z-card-content class="flex flex-col divide-y">
            @for (transaction of transactions; track transaction.name) {
              <div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span class="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <ng-icon name="lucideWallet" class="size-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="truncate text-sm font-medium">{{ transaction.name }}</div>
                  <div class="text-muted-foreground truncate text-xs">
                    {{ transaction.category }} · {{ transaction.when }}
                  </div>
                </div>
                <span class="text-sm font-medium tabular-nums" [class.text-emerald-600]="transaction.positive">
                  {{ transaction.amount }}
                </span>
              </div>
            }
          </z-card-content>
        </z-card>
        <z-card-sidebar-nav />
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Buy Investment" />
          </z-card-header>
          <z-card-content class="flex flex-col gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Amount to Invest
              <input z-input value="$ 1,000.00" aria-label="Amount to invest" />
            </label>
            <label class="grid gap-1.5 text-sm font-medium">
              Order Type
              <input z-input value="Market Order" aria-label="Order type" />
            </label>
            <dl class="grid gap-1.5 text-sm">
              <div class="flex justify-between">
                <dt class="text-muted-foreground">Estimated Shares</dt>
                <dd class="font-medium">1.95</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-muted-foreground">Buying Power</dt>
                <dd class="font-medium">$12,450.00</dd>
              </div>
            </dl>
            <button type="button" z-button class="w-full">Review Order</button>
            <p class="text-muted-foreground text-center text-xs">
              Trades are typically executed within minutes during market hours.
            </p>
          </z-card-content>
        </z-card>
        <div class="grid grid-cols-2 gap-4">
          <z-card>
            <z-card-content class="grid gap-1">
              <span class="text-muted-foreground text-xs">Card Balance</span>
              <span class="text-xl font-semibold tabular-nums">US$12.94</span>
              <span class="text-muted-foreground text-xs">US$11,337.06 Available</span>
            </z-card-content>
          </z-card>
          <z-card>
            <z-card-content class="grid gap-1">
              <span class="text-muted-foreground text-xs">Payment Due</span>
              <span class="text-xl font-semibold">1 Apr</span>
              <button type="button" z-button zType="outline" zSize="sm">Pay Early</button>
            </z-card-content>
          </z-card>
        </div>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Yearly Activity" />
            <div z-card-action><z-badge zType="secondary">+US$0.25 Daily Cash</z-badge></div>
          </z-card-header>
          <z-card-content>
            <div class="flex h-20 items-end gap-1.5" role="img" aria-label="Activity by month">
              @for (height of yearly; track $index) {
                <div class="bg-chart-2 flex-1 rounded-sm" [style.height.%]="height"></div>
              }
            </div>
          </z-card-content>
        </z-card>
        <z-card-transfer-funds />
      </div>

      <div class="flex flex-col gap-11">
        <z-card-account-access />
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Preferences" />
            <p z-card-description zDescription="Manage your account settings and notifications."></p>
          </z-card-header>
          <z-card-content class="flex flex-col gap-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium">Public Statistics</div>
                <div class="text-muted-foreground text-xs">Allow others to see your total stream count.</div>
              </div>
              <z-switch [zChecked]="true"><span class="sr-only">Public statistics</span></z-switch>
            </div>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-sm font-medium">Email Notifications</div>
                <div class="text-muted-foreground text-xs">Monthly royalty summary and updates.</div>
              </div>
              <z-switch [zChecked]="true"><span class="sr-only">Email notifications</span></z-switch>
            </div>
            <div class="flex justify-between gap-2">
              <button type="button" z-button zType="outline" zSize="sm">Reset</button>
              <button type="button" z-button zSize="sm">Save Preferences</button>
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Front Door" />
            <p z-card-description zDescription="Smart Lock Pro"></p>
            <div z-card-action><span class="text-muted-foreground text-xs">Locked</span></div>
          </z-card-header>
          <z-card-content>
            <div class="bg-muted relative flex h-28 items-center justify-center rounded-lg">
              <z-badge zType="destructive" class="absolute top-2 right-2">Live</z-badge>
              <ng-icon name="lucideImage" class="text-muted-foreground size-6" />
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Frequently Asked" />
          </z-card-header>
          <z-card-content class="flex flex-col gap-3 text-sm">
            <div class="flex items-center justify-between font-medium">
              How secure is my financial data?
              <ng-icon name="lucideChevronDown" class="size-4" />
            </div>
            <p class="text-muted-foreground">We use bank-level encryption and never sell your data.</p>
            <div class="flex items-center justify-between border-t pt-3 font-medium">
              How do I connect my bank?
              <ng-icon name="lucideChevronDown" class="size-4" />
            </div>
            <button type="button" z-button zType="outline" class="w-full">Contact Support</button>
          </z-card-content>
        </z-card>
      </div>

      <div class="flex flex-col gap-11">
        <z-card-new-milestone />
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Payout Preferences" />
            <p z-card-description zDescription="Receiving Method"></p>
          </z-card-header>
          <z-card-content class="flex flex-col gap-3">
            <label class="grid gap-1.5 text-sm font-medium">
              Account Holder Name
              <input z-input value="Synthetic Horizons Music LLC" aria-label="Account holder name" />
            </label>
            <div class="grid grid-cols-2 gap-2">
              <div class="ring-foreground/15 rounded-lg p-2.5 text-sm ring-1">
                <div class="font-medium">Bank Transfer</div>
                <div class="text-muted-foreground text-xs">SWIFT / IBAN</div>
              </div>
              <div class="ring-foreground/10 text-muted-foreground rounded-lg p-2.5 text-sm ring-1">
                <div class="font-medium">PayPal</div>
                <div class="text-xs">Instant Payout</div>
              </div>
            </div>
            <button type="button" z-button class="w-full">Save Payout Settings</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Social Links" />
          </z-card-header>
          <z-card-content class="flex flex-col gap-3">
            @for (link of links; track link) {
              <label class="grid gap-1.5 text-sm font-medium">
                {{ link }}
                <input z-input [attr.aria-label]="link" />
              </label>
            }
            <div class="flex justify-end gap-2">
              <button type="button" z-button zType="ghost" zSize="sm">Discard</button>
              <button type="button" z-button zSize="sm">Save Changes</button>
            </div>
          </z-card-content>
        </z-card>
        <z-card-power-usage />
      </div>

      <div class="flex flex-col gap-11">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Stock Performance" />
            <p z-card-description zDescription="6-month price history."></p>
          </z-card-header>
          <z-card-content>
            <svg
              viewBox="0 0 200 60"
              class="text-chart-2 h-20 w-full"
              role="img"
              aria-label="Price history"
              fill="none"
            >
              <path d="M0 40 C20 30 40 45 60 35 S100 20 130 28 S170 38 200 22" stroke="currentColor" stroke-width="2" />
            </svg>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col items-center gap-3 py-6 text-center">
            <ng-icon name="lucideSparkles" class="text-muted-foreground size-5" />
            <p class="text-sm font-medium">Explore Catalog</p>
            <p class="text-muted-foreground text-sm">
              Check your ISRC codes, metadata, and visual assets before going live.
            </p>
            <button type="button" z-button zSize="sm">View Catalog</button>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Upcoming Payments" />
            <p z-card-description zDescription="Select a date to view scheduled payments."></p>
          </z-card-header>
          <z-card-content class="flex flex-col gap-3">
            <div class="grid grid-cols-7 gap-1 text-center text-xs" role="grid" aria-label="October 2026">
              @for (day of days; track day) {
                <span
                  class="flex aspect-square items-center justify-center rounded-md tabular-nums"
                  [class.bg-primary]="day === 11"
                  [class.text-primary-foreground]="day === 11"
                >
                  {{ day }}
                </span>
              }
            </div>
            @for (payment of payments; track payment.name) {
              <div class="bg-muted/50 flex items-center justify-between rounded-lg px-3 py-2 text-sm">
                <div>
                  <div class="font-medium">{{ payment.name }}</div>
                  <div class="text-muted-foreground text-xs">{{ payment.date }}</div>
                </div>
                <span class="font-medium tabular-nums">{{ payment.amount }}</span>
              </div>
            }
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Living Room" />
            <p z-card-description zDescription="Roller Shades"></p>
          </z-card-header>
          <z-card-content class="flex flex-col gap-3">
            <div class="bg-muted h-12 rounded-lg"></div>
            <z-progress [value]="60" aria-label="Shade position" />
            <div class="grid grid-cols-3 gap-2">
              <button type="button" z-button zType="outline" zSize="sm">Open</button>
              <button type="button" z-button zType="outline" zSize="sm">Half</button>
              <button type="button" z-button zType="outline" zSize="sm">Closed</button>
            </div>
          </z-card-content>
        </z-card>
        <z-card>
          <z-card-content class="flex flex-col gap-3">
            <z-skeleton class="h-24 w-full" />
            <z-skeleton class="h-3 w-3/4" />
            <z-skeleton class="h-3 w-1/2" />
          </z-card-content>
        </z-card>
      </div>
    </div>
  `,
})
export class CanvasOneComponent {
  protected readonly lights = [
    { label: 'Brightness', value: 80 },
    { label: 'Color Temp', value: 60 },
    { label: 'Volume', value: 40 },
    { label: 'Fade', value: 10 },
  ];

  protected readonly transactions: readonly Transaction[] = [
    { name: 'Blue Bottle Coffee', category: 'Food & Drink', when: 'Today, 10:24 AM', amount: '-$6.50' },
    { name: 'Whole Foods Market', category: 'Groceries', when: 'Yesterday', amount: '-$142.30' },
    { name: 'Stripe Payout', category: 'Income', when: 'Oct 12', amount: '+$4,200.00', positive: true },
    { name: 'Uber Technologies', category: 'Transport', when: 'Oct 11', amount: '-$24.10' },
    { name: 'Netflix Subscription', category: 'Entertainment', when: 'Oct 10', amount: '-$19.99' },
  ];

  protected readonly yearly = [30, 45, 38, 55, 42, 60, 48, 70, 52, 66, 58, 74];
  protected readonly links = ['Spotify Artist URL', 'Instagram Handle', 'SoundCloud URL', 'Website'];
  protected readonly days = Array.from({ length: 31 }, (_, index) => index + 1);
  protected readonly payments = [
    { name: 'Netflix Subscription', date: 'Apr 15, 2024', amount: '$19.99' },
    { name: 'Rent Payment', date: 'Apr 1, 2024', amount: '$2,400.00' },
    { name: 'Auto Insurance', date: 'Apr 22, 2024', amount: '$186.00' },
  ];
}
