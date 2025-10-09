import { Component, inject } from '@angular/core';

import { MarkdownRendererComponent } from '../../components/render/markdown-renderer.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { ZardButtonComponent } from '../../../../../libs/zard/src/lib/components/button/button.component';
import { ZardAlertComponent } from '../../../../../libs/zard/src/lib/components/alert/alert.component';
import { ZardCardComponent } from '../../../../../libs/zard/src/lib/components/card/card.component';
import { DarkModeService } from '../../shared/services/darkmode.service';
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
