import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCode, lucideCodeXml, lucideInfo, lucideUsers } from '@ng-icons/lucide';

import { SeoService } from '@doc/shared/services/seo.service';

import { ZardBadgeComponent } from '@zard/components/badge/badge.component';
import { ZardCardComponent } from '@zard/components/card/card.component';

import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

interface VersionEntry {
  version: string;
  status: 'active' | 'ended';
  label: string;
  description: string;
}

@Component({
  selector: 'z-version-support',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    ZardBadgeComponent,
    ZardCardComponent,
    NgIcon,
  ],
  templateUrl: './version-support.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideInfo,
      lucideCodeXml,
      lucideCode,
      lucideUsers,
    }),
  ],
})
export class VersionSupportPage implements OnInit {
  activeAnchor?: string;

  private readonly seoService = inject(SeoService);

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'support-policy', label: 'Support Policy', type: 'custom' },
      { id: 'current-status', label: 'Current Status', type: 'custom' },
      { id: 'upgrade-process', label: 'Upgrade Process', type: 'custom' },
      { id: 'questions', label: 'Questions & Support', type: 'custom' },
    ],
  };

  readonly versions: VersionEntry[] = [
    {
      version: 'Angular 22',
      status: 'active',
      label: 'Active',
      description:
        'Latest version. Supported since release; the CLI resolves the dependency versions a v22 project needs.',
    },
    {
      version: 'Angular 21',
      status: 'active',
      label: 'Active',
      description: 'Fully supported. New features and components are built and tested against this version.',
    },
    {
      version: 'Angular 20',
      status: 'active',
      label: 'Active',
      description: 'Supported. Bug fixes and security patches are applied to maintain compatibility.',
    },
    {
      version: 'Angular 19',
      status: 'active',
      label: 'Active',
      description:
        'Minimum supported Angular version. We recommend upgrading to Angular 20 or later for the best experience.',
    },
  ];

  readonly upgradeSteps = [
    {
      step: '1',
      title: 'New Angular version released',
      description: 'The Angular team publishes a new major version with updated APIs and features.',
    },
    {
      step: '2',
      title: 'Zard UI compatibility update',
      description: 'We update Zard UI to fully support the new Angular version, including any breaking changes.',
    },
    {
      step: '3',
      title: 'Oldest version support dropped',
      description: 'Support for the oldest Angular version is discontinued. Migration guides are provided.',
    },
  ];

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Version Support',
      'Angular version support policy for Zard UI. Learn which Angular versions are actively supported.',
      '/docs/version-support',
      'og-version-support.jpg',
    );
  }
}
