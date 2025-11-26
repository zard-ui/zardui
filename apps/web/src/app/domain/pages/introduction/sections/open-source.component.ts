import { Component } from '@angular/core';

import { ZardBadgeComponent } from '../../../../../../../../libs/zard/badge/badge.component';
import { ZardCardComponent } from '../../../../../../../../libs/zard/card/card.component';
import { ZardIconComponent } from '../../../../../../../../libs/zard/icon/icon.component';
import { ZardIcon } from '../../../../../../../../libs/zard/icon/icons';

interface OpenSourceFeature {
  title: string;
  description: string;
  icon: ZardIcon;
}

interface StandAgainstItem {
  title: string;
  description: string;
}

@Component({
  selector: 'open-source-section',
  standalone: true,
  imports: [ZardBadgeComponent, ZardCardComponent, ZardIconComponent],
  template: `
    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col-reverse items-start gap-3 md:flex-row md:items-center">
          <h2 class="text-3xl font-bold tracking-tight">Open Source Philosophy</h2>
          <z-badge class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">100% Free</z-badge>
        </div>
        <p class="text-muted-foreground text-base leading-7">
          Built by the community, for the community. No corporate overlords, no paywalls, no compromises.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (feature of features; track $index) {
          <z-card [zTitle]="title">
            <ng-template #title>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              >
                <z-icon [zType]="feature.icon" class="text-lg font-normal" />
              </div>
              <h3 class="mt-4 text-base font-semibold">{{ feature.title }}</h3>
            </ng-template>
            <p class="text-muted-foreground mt-2 text-sm">{{ feature.description }}</p>
          </z-card>
        }
      </div>

      <!-- What We Stand Against -->
      <div class="bg-destructive/5 rounded-lg p-6">
        <h3 class="mb-4 flex items-center gap-2 text-lg font-semibold">
          <z-icon zType="ban" class="text-destructive" />
          What We Stand Against
        </h3>
        <div class="grid gap-3 md:grid-cols-3">
          @for (item of standAgainstItems; track $index) {
            <div class="flex items-start gap-3">
              <z-icon zType="x" class="text-destructive" />
              <div>
                <p class="text-sm font-medium">{{ item.title }}</p>
                <p class="text-muted-foreground text-xs">{{ item.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class OpenSourceSection {
  readonly features: OpenSourceFeature[] = [
    {
      title: 'Community Owned',
      description:
        "Governed by developers, not corporations. Every decision is made transparently with the community's best interests at heart.",
      icon: 'circle-check',
    },
    {
      title: 'Forever Free',
      description: 'Every component, every feature, always free. No premium tiers, no hidden costs, no "pro" versions.',
      icon: 'circle-dollar-sign',
    },
    {
      title: 'Built in Public',
      description:
        'All development happens in the open. Watch us build, contribute your ideas, and shape the future together.',
      icon: 'zap',
    },
  ];

  readonly standAgainstItems: StandAgainstItem[] = [
    {
      title: 'Corporate Control',
      description: 'No single entity will ever own or control ZardUI',
    },
    {
      title: 'Vendor Lock-in',
      description: 'Your code is yours, take it wherever you need',
    },
    {
      title: 'Artificial Limitations',
      description: 'No paywalls or "premium" features',
    },
  ];
}
