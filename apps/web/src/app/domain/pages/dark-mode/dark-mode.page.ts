import { Component, inject, type OnInit } from '@angular/core';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { SeoService } from '@zard/shared/services/seo.service';

import { DarkModeService } from '../../../shared/services/darkmode.service';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '../../components/render/markdown-renderer.component';
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
export class DarkmodePage implements OnInit {
  activeAnchor?: string;

  private readonly darkModeService = inject(DarkModeService);
  private readonly seoService = inject(SeoService);

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

  ngOnInit(): void {
    this.seoService.setDocsSeo('Dark Mode', 'Adding dark mode to your site.', '/docs/dark-mode', 'og-darkmode.jpg');
  }
}
