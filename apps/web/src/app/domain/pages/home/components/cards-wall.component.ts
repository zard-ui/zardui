import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';

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
import { CardsSkeletonRailsComponent } from './cards-skeleton-rails.component';

// Breakpoints are viewport based, as in the reference: the wall pads itself,
// so a container query on it would measure the content box and drift.
// The wall renders every primitive with the "rhea" look of the reference
// landing: filled borderless inputs, 18px pills, roomier items and fields,
// neutral chart greys. Everything is scoped here so the components keep their
// defaults elsewhere. Selectors combine a data-slot with a second attribute so
// they outrank the variants shipped by the primitives (0,3,0) without `!`,
// which keeps the per-card `x!` escapes working. The `dark:` variant here is
// `:is(.dark *)`, worth (0,1,0) on its own, so dark-only defaults need one
// more attribute or tag in the selector to be beaten.
const WALL_CLASSES = [
  'relative flex w-full max-w-none flex-col overflow-hidden bg-muted p-12 pb-0! lg:p-6 dark:bg-background',
  '[--gap:--spacing(8)] lg:[--gap:--spacing(6)] min-[1900px]:[--gap:--spacing(10)]!',
  '[--ng-icon__size:1rem]',
  '[--chart-1:#d4d4d4] [--chart-2:#737373] [--chart-3:#525252] [--chart-4:#404040] [--chart-5:#262626]',
  // Card
  '**:data-[slot=card]:[--card-spacing:--spacing(5)] **:data-[slot=card]:data-[size=sm]:[--card-spacing:--spacing(4)]',
  '**:data-[slot=card]:data-[size]:gap-(--card-spacing) **:data-[slot=card]:data-[size]:py-(--card-spacing)',
  '**:data-[slot=card]:rounded-3xl **:data-[slot=card]:shadow-sm **:data-[slot=card]:ring-foreground/5 [.dark_&_[data-slot=card]]:ring-foreground/10',
  '**:data-[slot=card-header]:gap-1.5 **:data-[slot=card-header]:rounded-t-3xl [&_[data-slot=card]_[data-slot=card-header]]:px-(--card-spacing)',
  '[&_[data-slot=card]_[data-slot=card-title]]:text-base',
  '[&_[data-slot=card]_[data-slot=card-content]]:px-(--card-spacing)',
  // Button and badge
  '**:data-[slot=button]:rounded-[18px] **:data-[slot=button]:data-[size=default]:px-3 **:data-[slot=button]:data-[size=sm]:px-3 **:data-[slot=button]:data-[size=sm]:text-sm',
  '[.dark_&_[data-slot=button][data-variant=outline]]:border-border [.dark_&_[data-slot=button][data-variant=outline]]:bg-transparent',
  '**:data-[slot=badge]:h-5 **:data-[slot=badge]:rounded-[18px]',
  '**:data-[slot=input-group-button]:rounded-[18px]',
  // Text controls
  '[&_input:not([type=checkbox]):not([type=radio])]:rounded-[18px] [&_input:not([type=checkbox]):not([type=radio])]:border-transparent [&_input:not([type=checkbox]):not([type=radio])]:bg-input/50',
  '[&_textarea]:rounded-[18px] [&_textarea]:border-transparent [&_textarea[data-slot=textarea]]:bg-input/50',
  '**:data-[slot=input-group]:rounded-[18px] **:data-[slot=input-group]:border-transparent [&_z-input-group[data-slot=input-group]]:bg-input/50',
  '**:data-[slot=select-trigger]:gap-1.5 **:data-[slot=select-trigger]:rounded-[18px] **:data-[slot=select-trigger]:border-transparent [&_button[data-slot=select-trigger]]:bg-input/50 **:data-[slot=select-trigger]:shadow-none',
  // Checkbox, radio and switch
  '[&_input[type=checkbox]]:rounded-[5px] [&_input[type=checkbox]]:border-transparent [&_input[type=checkbox]]:bg-input/90 [&_input[type=checkbox]]:shadow-none',
  '[&_input[type=checkbox]:checked]:border-primary [&_input[type=checkbox]:checked]:bg-primary [&_[data-slot=checkbox]_ng-icon]:[--ng-icon__size:0.875rem]',
  '[&_z-radio>button[role=radio]]:border-transparent [&_z-radio>button[role=radio]]:bg-input/90 [&_z-radio>button[role=radio][data-checked]]:bg-primary dark:[&_[data-slot=radio-group-indicator]>span]:size-2.5',
  '[&_z-switch_button]:mr-0! [&_z-switch_button]:h-5 [&_z-switch_button]:border-2 [&_z-switch_button[data-state=checked]]:border-primary [&_z-switch_button[role=switch][data-state=unchecked]]:bg-input/90',
  '[&_z-switch_button>span]:shadow-sm [&_z-switch_button>span[data-state=checked]]:translate-x-[calc(100%-4px)]',
  // Item, field, progress and empty
  '**:data-[slot=item]:gap-3.5 **:data-[slot=item]:rounded-[18px] **:data-[slot=item]:px-4 **:data-[slot=item]:py-3.5 [&_[data-slot=item-description]:not(.text-xs)]:leading-5',
  '**:data-[slot=field-group]:gap-6 **:data-[slot=field]:gap-3 **:data-[slot=field-content]:gap-1',
  '**:data-[slot=progress]:h-2',
  '**:data-[slot=empty]:rounded-[22px] **:data-[slot=empty-media]:data-[variant=icon]:size-10 **:data-[slot=empty-media]:data-[variant=icon]:rounded-xl [&_[data-slot=empty-media]_ng-icon]:size-5!',
  '**:data-[slot=empty-title]:text-lg **:data-[slot=empty-content]:gap-4',
].join(' ');

@Component({
  selector: 'z-cards-wall',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The select dropdown is rendered into the body by the CDK overlay, so no
  // style scoped to the wall can reach it. Encapsulation is off for these two
  // rules alone; `body:has()` keeps them to pages that show the wall.
  encapsulation: ViewEncapsulation.None,
  styles: `
    body:has(z-cards-wall) .cdk-overlay-pane [data-slot='select-content'] {
      border-radius: 18px;
    }

    body:has(z-cards-wall) .cdk-overlay-pane [data-slot='select-item'] {
      border-radius: 14px;
    }
  `,
  imports: [
    CardsSkeletonRailsComponent,
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
    <div [class]="wallClasses">
      @if (ultraWide()) {
        <z-cards-skeleton-rails />
      }

      <div
        class="relative z-10 mx-auto grid gap-(--gap) min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]"
      >
        <div class="flex flex-col items-start gap-(--gap)">
          <z-card-ui-elements />
          <z-card-sidebar-nav />
          <z-card-savings-targets />
        </div>

        <div class="hidden flex-col gap-(--gap) lg:flex">
          <z-card-contribution-history />
          <z-card-claimable-balance />
          <z-card-dividend-income />
        </div>

        <div class="hidden flex-col gap-(--gap) min-[1400px]:flex">
          <z-card-new-milestone />
          <z-card-payout-threshold />
          <z-card-account-access />
        </div>

        <div class="hidden flex-col gap-(--gap) md:flex">
          <z-card-qr-connect />
          <z-card-new-chat />
          <z-card-payments />
        </div>

        <div class="hidden flex-col gap-(--gap) min-[1900px]:flex">
          <z-card-empty-distribute-track />
          <z-card-analytics />
          <z-card-notification-settings />
          <z-card-power-usage />
        </div>
      </div>

      <div
        class="from-background via-muted absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b to-transparent dark:hidden"
        aria-hidden="true"
      ></div>
      <div
        class="from-background via-muted/80 dark:via-background/80 absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t to-transparent lg:h-80 xl:h-64"
        aria-hidden="true"
      ></div>
    </div>
  `,
})
export class CardsWallComponent {
  readonly wallClasses = WALL_CLASSES;

  // The rails only exist past 2200px. Hiding them with CSS would still build
  // three hundred skeleton nodes on every phone, so they are gated on the
  // viewport instead; the server renders none and the client adds them once it
  // knows its width.
  protected readonly ultraWide = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const query = window.matchMedia('(min-width: 2200px)');
      const update = () => this.ultraWide.set(query.matches);

      update();
      query.addEventListener('change', update);
      destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });
  }
}
