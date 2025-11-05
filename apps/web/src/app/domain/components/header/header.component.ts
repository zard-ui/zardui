import { AsyncPipe } from '@angular/common';
import { Component, inject, HostListener, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LucideAngularModule, GalleryHorizontal } from 'lucide-angular';
import type { Observable } from 'rxjs';

import { LayoutService } from '@doc/shared/services/layout.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';

import { environment } from '../../../../environments/environment';
import { SOCIAL_MEDIAS } from '../../../shared/constants/medias.constant';
import { HEADER_PATHS } from '../../../shared/constants/routes.constant';
import { DarkModeService } from '../../../shared/services/darkmode.service';
import { GithubService } from '../../../shared/services/github.service';
import { DocResearcherComponent } from '../doc-researcher/doc-researcher.component';
import { MobileMenuComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'z-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule, ZardButtonComponent, ZardBadgeComponent, MobileMenuComponent, ZardDividerComponent, AsyncPipe, DocResearcherComponent, LucideAngularModule],
})
export class HeaderComponent {
  readonly docResearcher = viewChild.required(DocResearcherComponent);

  readonly headerPaths = HEADER_PATHS;
  readonly githubData = SOCIAL_MEDIAS.find(media => media.name === 'GitHub');
  readonly appVersion = environment.appVersion;
  readonly GalleryHorizontalIcon = GalleryHorizontal;
  private readonly githubService = inject(GithubService);
  private readonly darkmodeService = inject(DarkModeService);
  private readonly layoutService = inject(LayoutService);
  readonly $repoStars: Observable<number> = this.githubService.getStarsCount();

  toggleTheme(): void {
    this.darkmodeService.toggleTheme();
  }

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }

  toggleLayout(): void {
    this.layoutService.toggleLayout();
  }

  isLayoutFixed(): boolean {
    return this.layoutService.isLayoutFixed();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.docResearcher().openCommandDialog();
    }
  }
}
