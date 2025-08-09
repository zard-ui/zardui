import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { ZardBadgeComponent, ZardAlertComponent } from '@zard/components/components';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { EnvCardComponent } from '../../components/env-card/env-card.component';

@Component({
  selector: 'z-enviroments',
  template: `
    <z-content [title]="title" [navigationConfig]="navigationConfig" [activeAnchor]="activeAnchor" scrollSpy (scrollSpyChange)="activeAnchor = $event">
      <z-doc-heading title="Installation" description="How to install dependencies and structure your app." scrollSpyItem="overview" id="overview"></z-doc-heading>

      <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="environments" id="environments">
        <div class="flex flex-col gap-6">
          <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-20">Pick Your Environment</h2>
          <p class="leading-relaxed">
            Start by selecting your environment of choice. Then, follow the instructions to install the dependencies and structure your app. zard/ui is designed to work seamlessly
            with Angular projects.
          </p>
        </div>

        <div class="grid gap-6 sm:grid-cols-2">
          @for (env of environments; track $index) {
            <div class="relative">
              <z-env-card
                [name]="env.name"
                [path]="env.path"
                [icon]="env.icon"
                [disabled]="!env.available"
                [class]="!env.available ? 'opacity-50 pointer-events-none' : ''"
              ></z-env-card>
              @if (!env.available) {
                <div class="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                  <z-badge zType="secondary">Coming Soon</z-badge>
                </div>
              }
            </div>
          }
        </div>
        <z-alert
          zTitle="Framework Support"
          class="bg-blue-500 dark:text-blue-100 dark:bg-blue-950 border dark:border-blue-800"
          zDescription="Angular is available now with full documentation and examples. Analog and Nx support are coming soon with dedicated guides and configurations."
          zType="info"
          zAppearance="fill"
        />
      </section>
    </z-content>
  `,
  standalone: true,
  imports: [CommonModule, EnvCardComponent, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective, ZardBadgeComponent, ZardAlertComponent],
})
export class EnviromentsPage {
  protected readonly environments = [
    { name: 'angular', icon: 'angular.svg', path: '/docs/installation/angular', available: true },
    { name: 'nx', icon: 'nx.svg', path: '/docs/installation/nx', available: false },
    { name: 'analog.js', icon: 'analog.svg', path: '/docs/installation/analog', available: false },
  ];
  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'environments', label: 'Environments', type: 'custom' },
    ],
  };
  readonly title = 'Installation - zard/ui';
  activeAnchor?: string;
}
