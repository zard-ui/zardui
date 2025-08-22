import { Component, inject, OnInit, HostListener, viewChild } from '@angular/core';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { DarkModeService } from '@zard/shared/services/darkmode.service';
import { SOCIAL_MEDIAS } from '@zard/shared/constants/medias.constant';
import { HEADER_PATHS } from '@zard/shared/constants/routes.constant';
import { GithubService } from '@zard/shared/services/github.service';
import { environment } from '@zard/env/environment';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import type { Observable } from 'rxjs';

import { DocResearcherComponent } from '../doc-researcher/doc-researcher.component';
import { MobileMenuComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, MobileMenuComponent, ZardDividerComponent, AsyncPipe, DocResearcherComponent],
})
export class HeaderComponent {
  readonly docResearcher = viewChild.required(DocResearcherComponent);

  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
  readonly appVersion = environment.appVersion;
  private readonly githubService = inject(GithubService);
  private readonly darkmodeService = inject(DarkModeService);
  readonly $repoStars: Observable<number> = this.githubService.getStarsCount();

  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.docResearcher.openCommandDialog();
    }
  }
}
