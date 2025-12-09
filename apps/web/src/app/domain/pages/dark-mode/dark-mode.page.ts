import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import {
  AppearanceOptions,
  EAppearanceModes,
  ZardAppearance,
} from '@zard/components/core/provider/services/appearance';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

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

  protected readonly appearanceService = inject(ZardAppearance);
  protected readonly currentTheme = this.appearanceService.theme;
  protected readonly EAppearanceModes = EAppearanceModes;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'current-implementation', label: 'Current Implementation', type: 'core' },
      { id: 'service-details', label: 'Appearance Service', type: 'core' },
      { id: 'usage-in-app', label: 'Usage in Application', type: 'core' },
      { id: 'demo', label: 'Interactive Demo', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Appearance',
      'Changing the appearance to your site.',
      '/docs/dark-mode',
      'og-darkmode.jpg',
    );
  }

  activateTheme(theme: AppearanceOptions): void {
    this.appearanceService.activateAppearance(theme);
  }
}
