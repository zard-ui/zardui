import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { environment } from '@zard/env/environment';
import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';
import { HEADER_PATHS } from '@zard/shared/constants/routes.constant';
import { MobileMenuComponent } from '../mobile-nav/mobile-nav.component';
import { DarkModeService } from '@zard/shared/services/darkmode.service';
import { GithubService } from '@zard/shared/services/github.service';
import { ZardDividerComponent } from '@zard/components/components';
import type { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DocResearcherComponent } from '../doc-researcher/doc-researcher.component';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, MobileMenuComponent, ZardDividerComponent, AsyncPipe, DocResearcherComponent],
})
export class HeaderComponent implements OnInit {
  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
  readonly appVersion = environment.appVersion;
  private readonly githubService = inject(GithubService);
  private readonly darkmodeService = inject(DarkModeService);
  readonly $repoStars: Observable<number> = this.githubService.getStarsCount();
  ngOnInit(): void {
    this.darkmodeService.initTheme();

    this.githubService.getContributors().subscribe(contributors => {
      console.log('Contributors:', contributors);
    });
  }

  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
}
