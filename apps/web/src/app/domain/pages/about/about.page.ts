import { ChangeDetectionStrategy, Component, computed, inject, signal, type OnInit } from '@angular/core';

import { ContributorsLoadingComponent } from '@doc/domain/components/contributors/contributors-loading.component';
import { ContributorsComponent } from '@doc/domain/components/contributors/contributors.component';
import { CreditCardComponent } from '@doc/domain/components/credit-card/credit-card.component';
import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { FoundersLoadingComponent } from '@doc/domain/components/founders/founders-loading.component';
import { FoundersComponent } from '@doc/domain/components/founders/founders.component';
import { MaintainersLoadingComponent } from '@doc/domain/components/maintainers/maintainers-loading.component';
import { MaintainersComponent } from '@doc/domain/components/maintainers/maintainers.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { GithubService } from '@doc/shared/services/github.service';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-about',
  templateUrl: './about.page.html',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    FoundersComponent,
    FoundersLoadingComponent,
    MaintainersComponent,
    MaintainersLoadingComponent,
    ContributorsComponent,
    ContributorsLoadingComponent,
    CreditCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly seoService = inject(SeoService);

  readonly activeAnchor = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'About',
      'Learn more about ZardUI, our team, and the amazing contributors who make this project possible.',
      '/docs/about',
      'og-credits.jpg',
    );
  }

  private readonly founderMappings: Record<string, { name: string; role: string }> = {
    Luizgomess: {
      name: 'Luiz Gomes',
      role: 'Founder & Core Developer',
    },
    srizzon: {
      name: 'Samuel Rizzon',
      role: 'Co-Founder & Component Core Developer',
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
  };

  readonly contributors = this.githubService.contributors;

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
      { id: 'founders', label: 'Founders', type: 'custom' },
      { id: 'maintainers', label: 'Maintainers', type: 'custom' },
      { id: 'contributors', label: 'Contributors', type: 'custom' },
      { id: 'credits', label: 'Credits', type: 'custom' },
    ],
  };

  readonly creditItems = [
    {
      title: 'shadcn/ui',
      description: "The design philosophy and component patterns that inspired ZardUI's architecture and aesthetic.",
    },
    {
      title: 'TailwindCSS',
      description:
        "The utility-first CSS framework that powers ZardUI's styling system and enables rapid customization.",
    },
    {
      title: 'NG-ZORRO',
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
      title: 'Open Source Community',
      description:
        'The amazing developers worldwide who contribute ideas, feedback, and improvements to make ZardUI better.',
    },
  ];
}
