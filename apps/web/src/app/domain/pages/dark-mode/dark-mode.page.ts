import { Component, inject, type OnInit } from '@angular/core';

import { ZardAlertComponent } from '@zard/components/alert/alert.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardComponent } from '@zard/components/card/card.component';

import { DocContentComponent } from '@docs/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@docs/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@docs/domain/components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '@docs/domain/components/render/markdown-renderer.component';
import { ScrollSpyItemDirective } from '@docs/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@docs/domain/directives/scroll-spy.directive';
import { DarkModeService } from '@docs/shared/services/darkmode.service';
import { SeoService } from '@docs/shared/services/seo.service';

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
