import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { FoundersComponent, FounderData } from '@zard/domain/components/founders/founders.component';
import { FoundersLoadingComponent } from '@zard/domain/components/founders/founders-loading.component';
import { ContributorsComponent } from '@zard/domain/components/contributors/contributors.component';
import { ContributorsLoadingComponent } from '@zard/domain/components/contributors/contributors-loading.component';
import { CreditCardComponent } from '@zard/domain/components/credit-card/credit-card.component';

import { Contributor, GithubService } from '../../../shared/services/github.service';

@Component({
  selector: 'z-about',
  templateUrl: './about.page.html',
  standalone: true,
  imports: [
    CommonModule,
    DynamicAnchorComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    FoundersComponent,
    FoundersLoadingComponent,
    ContributorsComponent,
    ContributorsLoadingComponent,
    CreditCardComponent,
  ],
})
export class AboutPage implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly titleService = inject(Title);
  private readonly title = 'About - zard/ui';

  activeAnchor?: string;
  contributors$: Observable<Contributor[]> = this.githubService.getContributors();
  founders$: Observable<FounderData[]>;

  private readonly founderMappings = {
    Luizgomess: {
      name: 'Luiz Gomes',
      role: 'Creator & Founder',
    },
    srizzon: {
      name: 'Samuel Rizzon',
      role: 'Co-Founder & Component Core Developer',
    },
  };

  readonly pageTopics = signal<Topic[]>([{ name: 'introduction' }, { name: 'founders' }, { name: 'contributors' }, { name: 'credits' }]);

  readonly creditItems = [
    {
      title: 'shadcn/ui',
      description: "The design philosophy and component patterns that inspired ZardUI's architecture and aesthetic.",
    },
    {
      title: 'TailwindCSS',
      description: "The utility-first CSS framework that powers ZardUI's styling system and enables rapid customization.",
    },
    {
      title: 'Angular',
      description: "The powerful framework that provides the foundation for ZardUI's reactive and performant components.",
    },
    {
      title: 'Nx',
      description: "The monorepo toolkit that enables ZardUI's scalable development workflow and build optimization.",
    },
    {
      title: 'CVA',
      description: 'Class Variance Authority provides type-safe styling variants that make ZardUI components highly customizable.',
    },
    {
      title: 'Open Source Community',
      description: 'The amazing developers worldwide who contribute ideas, feedback, and improvements to make ZardUI better.',
    },
  ];

  filteredContributors$ = this.contributors$.pipe(map(contributors => contributors.filter(contributor => !this.isFounder(contributor.login))));

  constructor() {
    this.founders$ = this.contributors$.pipe(
      map(contributors =>
        contributors
          .filter(contributor => contributor.login in this.founderMappings)
          .map(contributor => ({
            ...contributor,
            ...this.founderMappings[contributor.login as keyof typeof this.founderMappings],
          }))
          .sort((a, b) => b.contributions - a.contributions),
      ),
    );
  }

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.titleService.setTitle(this.title);
  }

  isFounder(login: string): boolean {
    return login in this.founderMappings;
  }
}
