import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';

// Ghost copies of the wall that fade in on both sides once the viewport is
// wider than the five-column grid (2200px), so the wall never ends in empty
// space on ultra-wide screens. Every block is a plain skeleton div so the
// rails cost nothing to render.
@Component({
  selector: 'z-cards-skeleton-rails',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, ZardCardImports],
  host: {
    'aria-hidden': 'true',
    class:
      'pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden',
  },
  template: `
    <div
      class="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]"
    >
      <div class="flex flex-col gap-(--gap)">
        <ng-container *ngTemplateOutlet="contributionHistory" />
        <ng-container *ngTemplateOutlet="claimableBalance" />
        <ng-container *ngTemplateOutlet="dividendIncome" />
        <ng-container *ngTemplateOutlet="payoutThreshold" />
      </div>
      <div class="flex flex-col gap-(--gap)">
        <ng-container *ngTemplateOutlet="uiElements" />
        <ng-container *ngTemplateOutlet="savingsTargets" />
        <ng-container *ngTemplateOutlet="newMilestone" />
        <ng-container *ngTemplateOutlet="payoutThreshold" />
        <ng-container *ngTemplateOutlet="accountAccess" />
      </div>
    </div>

    <div
      class="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]"
    >
      <div class="flex flex-col gap-(--gap)">
        <ng-container *ngTemplateOutlet="newMilestone" />
        <ng-container *ngTemplateOutlet="payoutThreshold" />
        <ng-container *ngTemplateOutlet="accountAccess" />
        <ng-container *ngTemplateOutlet="qrConnect" />
        <ng-container *ngTemplateOutlet="transferFunds" />
        <ng-container *ngTemplateOutlet="payments" />
        <ng-container *ngTemplateOutlet="distributeTrack" />
      </div>
      <div class="flex flex-col gap-(--gap)">
        <ng-container *ngTemplateOutlet="qrConnect" />
        <ng-container *ngTemplateOutlet="transferFunds" />
        <ng-container *ngTemplateOutlet="payments" />
        <ng-container *ngTemplateOutlet="distributeTrack" />
        <ng-container *ngTemplateOutlet="analytics" />
        <ng-container *ngTemplateOutlet="notificationSettings" />
        <ng-container *ngTemplateOutlet="powerUsage" />
      </div>
    </div>

    <ng-template #uiElements>
      <z-card class="w-full">
        <z-card-content class="flex flex-col gap-6">
          <div data-slot="skeleton" class="bg-muted h-8 w-full animate-pulse rounded-2xl"></div>
          <div class="flex flex-wrap gap-2">
            <div data-slot="skeleton" class="bg-muted h-9 w-20 animate-pulse rounded-lg"></div>
            <div data-slot="skeleton" class="bg-muted h-9 w-24 animate-pulse rounded-lg"></div>
            <div data-slot="skeleton" class="bg-muted h-9 w-20 animate-pulse rounded-lg"></div>
          </div>
          <div class="flex flex-col gap-3">
            <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
            <div data-slot="skeleton" class="bg-muted h-20 w-full animate-pulse rounded-lg"></div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex gap-2">
              <div data-slot="skeleton" class="bg-muted h-5 w-12 animate-pulse rounded-full"></div>
              <div data-slot="skeleton" class="bg-muted h-5 w-16 animate-pulse rounded-full"></div>
            </div>
            <div class="ml-auto flex gap-3">
              <div data-slot="skeleton" class="bg-muted size-4 animate-pulse rounded-full"></div>
              <div data-slot="skeleton" class="bg-muted size-4 animate-pulse rounded-full"></div>
            </div>
            <div class="flex gap-3">
              <div data-slot="skeleton" class="bg-muted size-4 animate-pulse rounded-sm"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted ml-auto h-5 w-9 animate-pulse rounded-full"></div>
          </div>
          <div class="flex items-center gap-4">
            <div data-slot="skeleton" class="bg-muted h-9 w-24 animate-pulse rounded-lg"></div>
            <div class="flex">
              <div data-slot="skeleton" class="bg-muted h-9 w-28 animate-pulse rounded-l-lg rounded-r-none"></div>
              <div data-slot="skeleton" class="bg-muted ml-px h-9 w-9 animate-pulse rounded-l-none rounded-r-lg"></div>
            </div>
          </div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #savingsTargets>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-36 animate-pulse rounded-md"></div>
          <div class="flex flex-col gap-1.5">
            <div data-slot="skeleton" class="bg-muted h-4 w-full max-w-64 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted h-4 w-48 animate-pulse rounded-md"></div>
          </div>
        </z-card-header>
        <z-card-content>
          <div class="flex flex-col gap-3">
            @for (row of two; track row) {
              <div class="bg-muted flex flex-col gap-3 rounded-xl p-4">
                <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-24 animate-pulse rounded-md"></div>
                <div data-slot="skeleton" class="bg-muted-foreground/15 h-8 w-36 animate-pulse rounded-md"></div>
                <div data-slot="skeleton" class="bg-muted-foreground/15 h-2 w-full animate-pulse rounded-full"></div>
                <div class="flex items-center justify-between">
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-24 animate-pulse rounded-md"></div>
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-20 animate-pulse rounded-md"></div>
                </div>
              </div>
            }
          </div>
        </z-card-content>
        <z-card-content class="flex justify-center">
          <div data-slot="skeleton" class="bg-muted h-3 w-56 animate-pulse rounded-md"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #contributionHistory>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-44 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-52 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content>
          <div class="flex h-[200px] w-full items-end gap-3">
            @for (height of contributionBars; track $index) {
              <div class="flex h-full flex-1 flex-col justify-end gap-2">
                <div
                  data-slot="skeleton"
                  class="bg-muted w-full animate-pulse rounded-t-md rounded-b-none"
                  [style.height.%]="height"
                ></div>
                <div data-slot="skeleton" class="bg-muted mx-auto h-3 w-6 animate-pulse rounded-md"></div>
              </div>
            }
          </div>
        </z-card-content>
        <z-card-content>
          <div class="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
            <div class="bg-muted flex flex-col gap-2 rounded-xl p-4">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-20 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-5 w-28 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-24 animate-pulse rounded-md"></div>
            </div>
            <div class="bg-muted hidden flex-col gap-2 rounded-xl p-4 xl:flex">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-24 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-5 w-32 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-28 animate-pulse rounded-md"></div>
            </div>
          </div>
        </z-card-content>
        <z-card-content class="flex items-center">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #claimableBalance>
      <z-card>
        <z-card-header class="gap-3!">
          <div data-slot="skeleton" class="bg-muted h-4 w-36 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-12 w-56 animate-pulse rounded-lg"></div>
          <div data-slot="skeleton" class="bg-muted h-6 w-32 animate-pulse rounded-full"></div>
        </z-card-header>
        <z-card-content class="flex flex-1 flex-col justify-end">
          <div class="bg-muted flex flex-col gap-3 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-28 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-20 animate-pulse rounded-md"></div>
            </div>
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-32 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-16 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted-foreground/15 h-px w-full animate-pulse rounded-none"></div>
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-36 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-24 animate-pulse rounded-md"></div>
            </div>
          </div>
        </z-card-content>
        <z-card-content class="flex flex-col gap-2">
          <div data-slot="skeleton" class="bg-muted h-3 w-full animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-3 w-11/12 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-3 w-3/4 animate-pulse rounded-md"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #dividendIncome>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-48 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
          <div z-card-action>
            <div data-slot="skeleton" class="bg-muted size-8 animate-pulse rounded-md"></div>
          </div>
        </z-card-header>
        <z-card-content>
          <div class="flex flex-col gap-2">
            @for (row of four; track row) {
              <div class="bg-muted flex items-center gap-3 rounded-xl p-3">
                <div class="flex flex-1 flex-col gap-2">
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-28 animate-pulse rounded-md"></div>
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-20 animate-pulse rounded-md"></div>
                </div>
                <div class="hidden h-8 w-24 items-end gap-1 md:flex">
                  @for (height of miniBars; track $index) {
                    <div
                      data-slot="skeleton"
                      class="bg-muted-foreground/15 flex-1 animate-pulse rounded-t-sm rounded-b-none"
                      [style.height.%]="height"
                    ></div>
                  }
                </div>
                <div
                  data-slot="skeleton"
                  class="bg-muted-foreground/15 hidden h-4 w-16 animate-pulse rounded-md md:block"
                ></div>
              </div>
            }
          </div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #newMilestone>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-44 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-72 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div data-slot="skeleton" class="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-2">
              <div data-slot="skeleton" class="bg-muted h-3 w-24 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
            </div>
            <div class="flex flex-col gap-2">
              <div data-slot="skeleton" class="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
            </div>
          </div>
        </z-card-content>
        <z-card-content class="flex flex-col gap-2">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #payoutThreshold>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-44 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-72 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div data-slot="skeleton" class="bg-muted h-3 w-32 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-baseline justify-between">
              <div data-slot="skeleton" class="bg-muted h-3 w-40 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-7 w-24 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted h-2 w-full animate-pulse rounded-full"></div>
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted h-3 w-16 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div data-slot="skeleton" class="bg-muted h-3 w-16 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted h-[100px] w-full animate-pulse rounded-lg"></div>
          </div>
        </z-card-content>
        <z-card-content class="flex items-center">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #accountAccess>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-36 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <div data-slot="skeleton" class="bg-muted h-3 w-24 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted h-3 w-32 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-3 w-12 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          </div>
        </z-card-content>
        <z-card-content class="flex flex-col gap-4">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
          <div data-slot="skeleton" class="bg-muted h-14 w-full animate-pulse rounded-xl"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #qrConnect>
      <z-card>
        <z-card-content class="flex justify-center pt-6">
          <div data-slot="skeleton" class="bg-muted size-44 animate-pulse rounded-xl"></div>
        </z-card-content>
        <z-card-header class="items-center gap-2! text-center">
          <div data-slot="skeleton" class="bg-muted h-5 w-56 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-48 animate-pulse rounded-md"></div>
        </z-card-header>
      </z-card>
    </ng-template>

    <ng-template #transferFunds>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-36 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
          <div z-card-action>
            <div data-slot="skeleton" class="bg-muted size-8 animate-pulse rounded-md"></div>
          </div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          @for (width of transferFields; track $index) {
            <div class="flex flex-col gap-2">
              <div data-slot="skeleton" [class]="'bg-muted h-3 animate-pulse rounded-md ' + width"></div>
              <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
            </div>
          }
          <div class="bg-muted flex flex-col gap-3 rounded-xl p-4">
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-28 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-24 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted-foreground/15 h-px w-full animate-pulse rounded-none"></div>
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-28 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-12 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted-foreground/15 h-px w-full animate-pulse rounded-none"></div>
            <div class="flex items-center justify-between">
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-24 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-20 animate-pulse rounded-md"></div>
            </div>
          </div>
        </z-card-content>
        <z-card-content class="flex items-center">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #payments>
      <z-card>
        <z-card-header class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <div data-slot="skeleton" class="bg-muted h-4 w-12 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted size-1.5 animate-pulse rounded-full"></div>
            <div data-slot="skeleton" class="bg-muted size-7 animate-pulse rounded-md"></div>
            <div data-slot="skeleton" class="bg-muted size-1.5 animate-pulse rounded-full"></div>
            <div data-slot="skeleton" class="bg-muted h-4 w-20 animate-pulse rounded-md"></div>
          </div>
        </z-card-header>
        <z-card-content>
          <div class="flex flex-col gap-2">
            @for (row of three; track row) {
              <div class="bg-muted flex items-center gap-3 rounded-xl p-3">
                <div data-slot="skeleton" class="bg-muted-foreground/15 size-9 animate-pulse rounded-lg"></div>
                <div class="flex flex-1 flex-col gap-2">
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-4 w-40 animate-pulse rounded-md"></div>
                  <div data-slot="skeleton" class="bg-muted-foreground/15 h-3 w-56 animate-pulse rounded-md"></div>
                </div>
                <div data-slot="skeleton" class="bg-muted-foreground/15 size-4 animate-pulse rounded-md"></div>
              </div>
            }
          </div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #distributeTrack>
      <z-card>
        <z-card-content>
          <div class="flex flex-col items-center gap-4 p-4">
            <div data-slot="skeleton" class="bg-muted size-12 animate-pulse rounded-xl"></div>
            <div class="flex flex-col items-center gap-2">
              <div data-slot="skeleton" class="bg-muted h-5 w-40 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-3 w-64 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-3 w-48 animate-pulse rounded-md"></div>
            </div>
            <div data-slot="skeleton" class="bg-muted h-9 w-32 animate-pulse rounded-lg"></div>
          </div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #analytics>
      <z-card zSize="sm" class="mx-auto w-full max-w-sm pb-0!">
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-24 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-40 animate-pulse rounded-md"></div>
          <div z-card-action>
            <div data-slot="skeleton" class="bg-muted h-7 w-28 animate-pulse rounded-lg"></div>
          </div>
        </z-card-header>
        <div data-slot="skeleton" class="bg-muted mx-6 mb-6 aspect-[1/0.35] w-auto animate-pulse rounded-lg"></div>
      </z-card>
    </ng-template>

    <ng-template #notificationSettings>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-32 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          @for (row of four; track row) {
            <div class="flex items-start gap-3">
              <div data-slot="skeleton" class="bg-muted size-4 animate-pulse rounded-sm"></div>
              <div class="flex flex-1 flex-col gap-2">
                <div data-slot="skeleton" class="bg-muted h-4 w-40 animate-pulse rounded-md"></div>
                <div data-slot="skeleton" class="bg-muted h-3 w-56 animate-pulse rounded-md"></div>
              </div>
            </div>
          }
        </z-card-content>
        <z-card-content class="flex items-center">
          <div data-slot="skeleton" class="bg-muted h-9 w-full animate-pulse rounded-lg"></div>
        </z-card-content>
      </z-card>
    </ng-template>

    <ng-template #powerUsage>
      <z-card>
        <z-card-header class="gap-2!">
          <div data-slot="skeleton" class="bg-muted h-5 w-32 animate-pulse rounded-md"></div>
          <div data-slot="skeleton" class="bg-muted h-4 w-24 animate-pulse rounded-md"></div>
        </z-card-header>
        <z-card-content class="flex flex-col gap-4">
          <div class="flex h-[140px] w-full items-end gap-2">
            @for (height of powerBars; track $index) {
              <div class="flex h-full flex-1 flex-col justify-end gap-1.5">
                <div
                  data-slot="skeleton"
                  class="bg-muted w-full animate-pulse rounded-t rounded-b-none"
                  [style.height.%]="height"
                ></div>
                <div data-slot="skeleton" class="bg-muted mx-auto h-3 w-5 animate-pulse rounded-md"></div>
              </div>
            }
          </div>
          <div data-slot="skeleton" class="bg-muted h-px w-full animate-pulse rounded-none"></div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <div data-slot="skeleton" class="bg-muted h-3 w-28 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-5 w-20 animate-pulse rounded-md"></div>
            </div>
            <div class="flex flex-col gap-1.5">
              <div data-slot="skeleton" class="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
              <div data-slot="skeleton" class="bg-muted h-5 w-24 animate-pulse rounded-md"></div>
            </div>
          </div>
        </z-card-content>
        <z-card-content class="flex flex-col items-start gap-2">
          <div data-slot="skeleton" class="bg-muted h-3 w-24 animate-pulse rounded-md"></div>
          <div class="flex w-full items-center gap-2">
            <div data-slot="skeleton" class="bg-muted h-2 flex-1 animate-pulse rounded-full"></div>
            <div data-slot="skeleton" class="bg-muted h-3 w-10 animate-pulse rounded-md"></div>
          </div>
        </z-card-content>
      </z-card>
    </ng-template>
  `,
})
export class CardsSkeletonRailsComponent {
  readonly two = [0, 1];
  readonly three = [0, 1, 2];
  readonly four = [0, 1, 2, 3];
  readonly contributionBars = [60, 80, 65, 95, 50, 100];
  readonly miniBars = [40, 60, 80, 50];
  readonly powerBars = [30, 70, 80, 60, 90, 75, 100, 85];
  readonly transferFields = ['w-32', 'w-24', 'w-20'];
}
