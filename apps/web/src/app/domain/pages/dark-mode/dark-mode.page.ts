import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '../../components/render/markdown-renderer.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-darkmode',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    MarkdownRendererComponent,
    ZardButtonComponent,
    ZardCardComponent,
    ZardIconComponent,
    ZardButtonGroupComponent,
  ],
  templateUrl: './dark-mode.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkmodePage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  protected readonly darkModeService = inject(ZardDarkMode);
  protected readonly currentTheme = this.darkModeService.theme;
  protected readonly EDarkModes = EDarkModes;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'current-implementation', label: 'Current Implementation', type: 'core' },
      { id: 'service-details', label: 'Dark Mode Service', type: 'core' },
      { id: 'usage-in-app', label: 'Usage in Application', type: 'core' },
      { id: 'demo', label: 'Interactive Demo', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Dark Mode',
      'Complete dark mode system with theme switching and persistence.',
      '/docs/dark-mode',
      'og-darkmode.jpg',
    );
  }
}
