import { Component, inject, OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '../../../../../../../libs/zard/badge/badge.component';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { EnvCardComponent } from '../../components/env-card/env-card.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-enviroments',
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Installation"
        description="How to install dependencies and structure your app."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <section class="flex flex-col gap-8 sm:gap-10" scrollSpyItem="environments" id="environments">
        <div class="flex flex-col gap-6">
          <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-20">
            Pick Your Environment
          </h2>
          <p class="leading-relaxed">
            Start by selecting your environment of choice. Then, follow the instructions to install the dependencies and
            structure your app. zard/ui is designed to work seamlessly with Angular projects.
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
                [class]="!env.available ? 'pointer-events-none opacity-50' : ''"
              ></z-env-card>
              @if (!env.available) {
                <div class="bg-background/80 absolute inset-0 flex items-center justify-center rounded-xl">
                  <z-badge zType="secondary">Coming Soon</z-badge>
                </div>
              }
            </div>
          }
        </div>
      </section>
    </z-content>
  `,
  standalone: true,
  imports: [
    EnvCardComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardBadgeComponent,
  ],
})
export class EnviromentsPage implements OnInit {
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

  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      `Installation`,
      `How to install dependencies and structure your app.`,
      `/docs/installation`,
      'og-install.jpg',
    );
  }
}
