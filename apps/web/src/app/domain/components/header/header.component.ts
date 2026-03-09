import { Component, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GalleryHorizontal } from 'lucide-angular';

import { DocResearcherComponent } from '@doc/domain/components/doc-researcher/doc-researcher.component';
import { MobileMenuComponent } from '@doc/domain/components/mobile-nav/mobile-nav.component';
import { SOCIAL_MEDIAS } from '@doc/shared/constants/medias.constant';
import { HEADER_PATHS } from '@doc/shared/constants/routes.constant';
import { GithubService } from '@doc/shared/services/github.service';
import { LayoutService } from '@doc/shared/services/layout.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocResearcherComponent,
    ZardBadgeComponent,
    MobileMenuComponent,
    RouterModule,
    ZardButtonComponent,
    ZardDividerComponent,
    ZardIconComponent,
  ],
})
export class HeaderComponent {
  readonly docResearcher = viewChild.required(DocResearcherComponent);

  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(m => m.name === 'GitHub') ?? null;
  readonly appVersion = environment.appVersion;
  readonly GalleryHorizontalIcon = GalleryHorizontal;
  private readonly githubService = inject(GithubService);
  private readonly darkModeService = inject(ZardDarkMode);
  private readonly layoutService = inject(LayoutService);
  readonly repoStars = this.githubService.starsCount;
  readonly isLayoutFixed = this.layoutService.isLayoutFixed;

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  toggleLayout(): void {
    this.layoutService.toggleLayout();
  }

  handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.docResearcher().openCommandDialog();
    }
  }
}
