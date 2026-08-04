import { ChangeDetectionStrategy, Component, computed, inject, signal, type OnInit } from '@angular/core';

import { ContributorsLoadingComponent } from '@doc/domain/components/contributors/contributors-loading.component';
import { ContributorsComponent } from '@doc/domain/components/contributors/contributors.component';
import { CreditCardComponent, type CreditItem } from '@doc/domain/components/credit-card/credit-card.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { FoundersLoadingComponent } from '@doc/domain/components/founders/founders-loading.component';
import { FoundersComponent } from '@doc/domain/components/founders/founders.component';
import { MaintainersLoadingComponent } from '@doc/domain/components/maintainers/maintainers-loading.component';
import { MaintainersComponent } from '@doc/domain/components/maintainers/maintainers.component';
import { SponsorsLoadingComponent } from '@doc/domain/components/sponsors/sponsors-loading.component';
import { SponsorsComponent } from '@doc/domain/components/sponsors/sponsors.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SPONSORS_URL } from '@doc/shared/constants/sponsors.constant';
import { GithubService } from '@doc/shared/services/github.service';
import { SeoService } from '@doc/shared/services/seo.service';
import { SponsorsService } from '@doc/shared/services/sponsors.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';

@Component({
  selector: 'z-about',
  templateUrl: './about.page.html',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    SponsorsComponent,
    SponsorsLoadingComponent,
    FoundersComponent,
    FoundersLoadingComponent,
    MaintainersComponent,
    MaintainersLoadingComponent,
    ContributorsComponent,
    ContributorsLoadingComponent,
    CreditCardComponent,
    ZardButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly seoService = inject(SeoService);
  // Injected only here: sponsors are fetched (and bundled) for this page alone.
  private readonly sponsorsService = inject(SponsorsService);

  readonly activeAnchor = signal<string | undefined>(undefined);
  readonly sponsorsUrl = SPONSORS_URL;

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'About',
      'Learn more about ZardUI, the sponsors who fund it, our team, and the amazing contributors who make this project possible.',
      '/docs/about',
      'og-credits.jpg',
    );
  }

  private readonly founderMappings: Record<string, { name: string; role: string; badge: string }> = {
    Luizgomess: {
      name: 'Luiz Gomes',
      role: 'Founder & Core Developer',
      badge: 'Founder',
    },
    srizzon: {
      name: 'Samuel Rizzon',
      role: 'Co-Founder & Component Core Developer',
      badge: 'Co-Founder',
    },
  };

  private readonly maintainerMappings: Record<string, { name: string; role: string }> = {
    ribeiromatheuss: {
      name: 'Matheus Ribeiro',
      role: 'Maintainer',
    },
    mikij: {
      name: 'Mickey Lazarevic',
      role: 'Maintainer',
    },
    neopavan: {
      name: 'Pavan Mollagavelli',
      role: 'Maintainer',
    },
  };

  readonly contributors = this.githubService.contributors;

  // Sponsors are an independent list: people already listed as maintainers or
  // contributors intentionally show up here too.
  readonly sponsors = this.sponsorsService.sponsors;
  readonly sponsorsLoading = this.sponsorsService.sponsorsLoading;

  readonly founders = computed(() =>
    this.contributors()
      .filter(c => c.login in this.founderMappings)
      .map(c => ({ ...c, ...this.founderMappings[c.login] }))
      .sort((a, b) => b.contributions - a.contributions),
  );

  readonly maintainers = computed(() =>
    this.contributors()
      .filter(c => c.login in this.maintainerMappings)
      .map(c => ({ ...c, ...this.maintainerMappings[c.login] }))
      .sort((a, b) => b.contributions - a.contributions),
  );

  readonly filteredContributors = computed(() =>
    this.contributors().filter(c => !(c.login in this.founderMappings) && !(c.login in this.maintainerMappings)),
  );

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'sponsors', label: 'Sponsors', type: 'custom' },
      { id: 'founders', label: 'Founders', type: 'custom' },
      { id: 'maintainers', label: 'Mantainers', type: 'custom' },
      { id: 'contributors', label: 'Contributors', type: 'custom' },
      { id: 'credits', label: 'Credits', type: 'custom' },
    ],
  };

  readonly creditItems: CreditItem[] = [
    {
      title: 'Shadcn/ui',
      description: "The design philosophy and component patterns that inspired ZardUI's architecture and aesthetic.",
    },
    {
      title: 'TailwindCSS',
      description:
        "The utility-first CSS framework that powers ZardUI's styling system and enables rapid customization.",
    },
    {
      title: 'Ng-zorro',
      description:
        'An enterprise-class Angular UI library that inspired ZardUI with its exceptional developer experience and comprehensive component patterns.',
    },
    {
      title: 'Angular',
      description:
        "The powerful framework that provides the foundation for ZardUI's reactive and performant components.",
    },
    {
      title: 'Nx',
      description: "The monorepo toolkit that enables ZardUI's scalable development workflow and build optimization.",
    },
    {
      title: 'CVA',
      description:
        'Class Variance Authority provides type-safe styling variants that make ZardUI components highly customizable.',
    },
    {
      title: 'Ng-icons',
      description:
        'The icon library that brings thousands of icons to ZardUI components through a single, tree-shakable Angular API.',
      url: 'https://ng-icons.github.io/ng-icons/#/',
      author: 'ashley-hunter',
      authorUrl: 'https://github.com/ashley-hunter',
    },
    {
      title: 'Embla-carousel-angular',
      description:
        'The lightweight and accessible carousel engine that powers the ZardUI carousel component under the hood.',
      url: 'https://github.com/donaldxdonald/embla-carousel-angular',
      author: 'donaldxdonald',
      authorUrl: 'https://github.com/donaldxdonald',
    },
    {
      title: 'Open Source Community',
      description:
        'The amazing developers worldwide who contribute ideas, feedback, and improvements to make ZardUI better.',
    },
  ];
}
