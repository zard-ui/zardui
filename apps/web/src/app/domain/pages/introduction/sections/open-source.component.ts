import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { Component } from '@angular/core';
import { IconName, ZardIconComponent } from '@zard/components/icon/icon.component';

interface OpenSourceFeature {
  title: string;
  description: string;
  icon: IconName;
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
        <div class="flex items-start md:items-center flex-col-reverse md:flex-row gap-3">
          <h2 class="text-3xl font-bold tracking-tight">Open Source Philosophy</h2>
          <z-badge class="text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400">100% Free</z-badge>
        </div>
        <p class="text-base leading-7 text-muted-foreground">Built by the community, for the community. No corporate overlords, no paywalls, no compromises.</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        @for (feature of features; track $index) {
          <z-card [zTitle]="title">
            <ng-template #title>
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <z-icon [zType]="feature.icon" class="text-lg font-normal" />
              </div>
              <h3 class="mt-4 text-base font-semibold">{{ feature.title }}</h3>
            </ng-template>
            <p class="mt-2 text-sm text-muted-foreground">{{ feature.description }}</p>
          </z-card>
        }
      </div>

      <!-- What We Stand Against -->
      <div class="rounded-lg bg-destructive/5 p-6">
        <h3 class="mb-4 text-lg font-semibold flex items-center gap-2">
          <z-icon zType="Ban" class="text-destructive" />
          What We Stand Against
        </h3>
        <div class="grid gap-3 md:grid-cols-3">
          @for (item of standAgainstItems; track $index) {
            <div class="flex items-start gap-3">
              <z-icon zType="X" class="text-destructive" />
              <div>
                <p class="font-medium text-sm">{{ item.title }}</p>
                <p class="text-xs text-muted-foreground">{{ item.description }}</p>
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
      description: "Governed by developers, not corporations. Every decision is made transparently with the community's best interests at heart.",
      icon: 'CircleCheck',
    },
    {
      title: 'Forever Free',
      description: 'Every component, every feature, always free. No premium tiers, no hidden costs, no "pro" versions.',
      icon: 'CircleDollarSign',
    },
    {
      title: 'Built in Public',
      description: 'All development happens in the open. Watch us build, contribute your ideas, and shape the future together.',
      icon: 'Zap',
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
