import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DynamicAnchorComponent, Topic } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyDirective } from '@zard/domain/directives/scroll-spy.directive';
import { ScrollSpyItemDirective } from '@zard/domain/directives/scroll-spy-item.directive';
import { ZardAvatarComponent } from '@zard/components/avatar/avatar.component';
import { ZardTooltipModule } from '@zard/components/tooltip/tooltip';

import { Contributor, GithubService } from '../../../shared/services/github.service';

interface FounderData {
  login: string;
  name: string;
  role: string;
  description: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

@Component({
  selector: 'z-about',
  templateUrl: './about.page.html',
  standalone: true,
  imports: [CommonModule, DynamicAnchorComponent, ScrollSpyDirective, ScrollSpyItemDirective, ZardAvatarComponent, ZardTooltipModule],
})
export class AboutPage implements OnInit {
  private readonly githubService = inject(GithubService);
  private readonly viewportScroller = inject(ViewportScroller);

  activeAnchor?: string;
  contributors$: Observable<Contributor[]> = this.githubService.getContributors();
  founders$: Observable<FounderData[]>;

  private readonly founderMappings = {
    Luizgomess: {
      name: 'Luiz Gomes',
      role: 'Co-Founder & Lead Developer',
      description: 'Expert in Angular development and component architecture.',
    },
    srizzon: {
      name: 'Samuel Rizzon',
      role: 'Co-Founder & Core Developer',
      description: 'Passionate about creating beautiful and functional user interfaces.',
    },
  };

  readonly pageTopics = signal<Topic[]>([{ name: 'introduction' }, { name: 'founders' }, { name: 'contributors' }, { name: 'credits' }]);

  constructor() {
    this.founders$ = this.contributors$.pipe(
      map(
        contributors =>
          contributors
            .filter(contributor => contributor.login in this.founderMappings)
            .map(contributor => ({
              ...contributor,
              ...this.founderMappings[contributor.login as keyof typeof this.founderMappings],
            }))
            .sort((a, b) => b.contributions - a.contributions), // Sort by contributions descending
      ),
    );
  }

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  isFounder(login: string): boolean {
    return login in this.founderMappings;
  }
}
