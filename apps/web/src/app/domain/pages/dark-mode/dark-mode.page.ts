import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { BLOCK_0 as HEADER_BLOCK_0, BLOCK_1 as HEADER_BLOCK_1 } from '@generated/pages/dark-mode/header-usage';
import { TABS_0 } from '@generated/pages/dark-mode/service-installation';
import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CodeTabsComponent } from '@highlight/components/code-tabs/code-tabs.component';
import type { CodeBlockData, CodeTabData } from '@highlight/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun, lucideSunMoon } from '@ng-icons/lucide';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardButtonGroupComponent } from '@zard/components/button-group/button-group.component';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-darkmode',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    CodeBlockComponent,
    CodeTabsComponent,
    ZardButtonComponent,
    ZardCardComponent,
    NgIcon,
    ZardButtonGroupComponent,
  ],
  templateUrl: './dark-mode.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideSunMoon, lucideSun, lucideMoon })],
})
export class DarkmodePage implements OnInit {
  activeAnchor?: string;

  readonly serviceInstallationTabs: CodeTabData = TABS_0;
  readonly headerComponentBlock: CodeBlockData = HEADER_BLOCK_0;
  readonly headerTemplateBlock: CodeBlockData = HEADER_BLOCK_1;

  private readonly seoService = inject(SeoService);

  protected readonly darkModeService = inject(ZardDarkMode);
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
