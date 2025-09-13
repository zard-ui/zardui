import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import type { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { DarkModeService } from '@zard/shared/services/darkmode.service';
import { Component, inject } from '@angular/core';

import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-darkmode',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    MarkdownRendererComponent,
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardCardComponent,
    ZardAlertComponent,
  ],
  templateUrl: './dark-mode.page.html',
})
export class DarkmodePage {
  readonly title = 'Dark Mode - zard/ui';
  activeAnchor?: string;

  private readonly darkModeService = inject(DarkModeService);

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'current-implementation', label: 'Current Implementation', type: 'core' },
      { id: 'service-details', label: 'DarkMode Service', type: 'core' },
      { id: 'usage-in-app', label: 'Usage in Application', type: 'core' },
      { id: 'demo', label: 'Interactive Demo', type: 'custom' },
    ],
  };

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkModeService.getCurrentTheme();
  }

  toggleTheme(): void {
    this.darkModeService.toggleTheme();
  }
}
