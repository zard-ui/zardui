import { Component, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGalleryHorizontal } from '@ng-icons/lucide';

import { LayoutService } from '@doc/shared/services/layout.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { environment } from '../../../../environments/environment';
import { SOCIAL_MEDIAS } from '../../../shared/constants/medias.constant';
import { HEADER_PATHS } from '../../../shared/constants/routes.constant';
import { GithubService } from '../../../shared/services/github.service';
import { DocResearcherComponent } from '../doc-researcher/doc-researcher.component';
import { MobileMenuComponent } from '../mobile-nav/mobile-nav.component';

const DarkModeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
  <path d="M12 3l0 18"/>
  <path d="M12 9l4.65 -4.65"/>
  <path d="M12 14.3l7.37 -7.37"/>
  <path d="M12 19.6l8.85 -8.85"/>
</svg>
`;

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
    NgIcon,
  ],
  host: {
    '(window:keydown)': 'handleKeyboardShortcut($event)',
  },
  viewProviders: [
    provideIcons({
      lucideGalleryHorizontal,
      darkMode: DarkModeSvg,
    }),
  ],
})
export class HeaderComponent {
  readonly docResearcher = viewChild.required(DocResearcherComponent);

  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
  readonly appVersion = environment.appVersion;
  private readonly githubService = inject(GithubService);
  private readonly darkModeService = inject(ZardDarkMode);
  private readonly layoutService = inject(LayoutService);
  readonly repoStars = this.githubService.starsCount;

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
