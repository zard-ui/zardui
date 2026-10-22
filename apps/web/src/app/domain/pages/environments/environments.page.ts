import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SETUP_SHARED_CLI_CREATE } from '@generated/documentation/setup/shared/cli-create';
import { SETUP_SHARED_CLI_INIT } from '@generated/documentation/setup/shared/cli-init';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeTabData } from '@highlight/types';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';

import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { EnvCardComponent } from '../../components/env-card/env-card.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-environments',
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

      <section class="flex flex-col gap-6" scrollSpyItem="create" id="create">
        <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-20">
          Use zard/ui create
        </h2>
        <p class="leading-relaxed">
          The quickest way to start. Design the look on the
          <a class="text-foreground underline underline-offset-4" routerLink="/create">create page</a>
          , then run the command it gives you. It scaffolds an Angular, Nx or Analog.js application and configures it
          from your design in one go. You can also run it with no arguments and answer the questions.
        </p>
        <z-code-tabs [data]="createCommand" />
      </section>

      <section class="flex flex-col gap-6" scrollSpyItem="existing-project" id="existing-project">
        <h2 class="font-heading mt-12 scroll-m-28 text-2xl font-medium tracking-tight first:mt-0 lg:mt-20">
          Existing project
        </h2>
        <p class="leading-relaxed">
          Already have an application or a library? Run
          <code class="bg-muted rounded px-1.5 py-0.5 text-xs sm:text-sm">init</code>
          at its root. The guides below walk through it step by step, and through the manual setup if you prefer to do
          it by hand.
        </p>
        <z-code-tabs [data]="initCommand" />
      </section>

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    EnvCardComponent,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardBadgeComponent,
    CodeTabsComponent,
    RouterLink,
  ],
})
export class EnvironmentsPage implements OnInit {
  // The same order as the CLI's menu: each ecosystem together, with the
  // application before the library, and Angular opening the list as the default.
  protected readonly environments = [
    { name: 'angular', icon: 'angular.svg', path: '/docs/installation/angular', available: true },
    { name: 'angular library', icon: 'angular.svg', path: '/docs/installation/angular-library', available: true },
    { name: 'nx', icon: 'nx.svg', path: '/docs/installation/nx', available: true },
    { name: 'nx library', icon: 'nx.svg', path: '/docs/installation/nx-library', available: true },
    { name: 'analog.js', icon: 'analog.svg', path: '/docs/installation/analog', available: true },
  ];

  protected readonly createCommand: CodeTabData = SETUP_SHARED_CLI_CREATE;
  protected readonly initCommand: CodeTabData = SETUP_SHARED_CLI_INIT;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'create', label: 'Use zard/ui create', type: 'custom' },
      { id: 'existing-project', label: 'Existing project', type: 'custom' },
      { id: 'environments', label: 'Pick Your Environment', type: 'custom' },
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
