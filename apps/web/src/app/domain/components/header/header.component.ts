import { AsyncPipe } from '@angular/common';
import { Component, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GalleryHorizontal } from 'lucide-angular';
import type { Observable } from 'rxjs';

import { LayoutService } from '@doc/shared/services/layout.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { environment } from '../../../../environments/environment';
import { SOCIAL_MEDIAS } from '../../../shared/constants/medias.constant';
import { HEADER_PATHS } from '../../../shared/constants/routes.constant';
import { GithubService } from '../../../shared/services/github.service';
import { DocResearcherComponent } from '../doc-researcher/doc-researcher.component';
import { MobileMenuComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DocResearcherComponent,
    ZardBadgeComponent,
    MobileMenuComponent,
    RouterModule,
    ZardButtonComponent,
    ZardDividerComponent,
    ZardIconComponent,
  ],
  host: {
    '(window:keydown)': 'handleKeyboardShortcut($event)',
  },
})
export class HeaderComponent {
  readonly docResearcher = viewChild.required(DocResearcherComponent);

  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
  readonly appVersion = environment.appVersion;
  readonly GalleryHorizontalIcon = GalleryHorizontal;
  private readonly githubService = inject(GithubService);
  private readonly darkModeService = inject(ZardDarkMode);
  private readonly layoutService = inject(LayoutService);
  readonly $repoStars: Observable<number> = this.githubService.getStarsCount();

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }

  toggleLayout(): void {
    this.layoutService.toggleLayout();
  }

  isLayoutFixed(): boolean {
    return this.layoutService.isLayoutFixed();
  }

  handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.docResearcher().openCommandDialog();
    }
  }
}
