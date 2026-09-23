import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { MonorepoApplicationSectionComponent } from './sections/application.component';
import { MonorepoLibrarySectionComponent } from './sections/library.component';
import { MonorepoOverviewSectionComponent } from './sections/overview.component';
import { MonorepoProjectsSectionComponent } from './sections/projects.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-monorepo',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    MonorepoOverviewSectionComponent,
    MonorepoApplicationSectionComponent,
    MonorepoLibrarySectionComponent,
    MonorepoProjectsSectionComponent,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Monorepo"
        description="Installing zard/ui into an Nx workspace: which files the aliases and Tailwind belong in, and how a library differs from an application."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-monorepo-overview-section scrollSpyItem="what-changes" id="what-changes"></z-monorepo-overview-section>
      <z-monorepo-application-section scrollSpyItem="application" id="application"></z-monorepo-application-section>
      <z-monorepo-library-section scrollSpyItem="library" id="library"></z-monorepo-library-section>
      <z-monorepo-projects-section scrollSpyItem="projects" id="projects"></z-monorepo-projects-section>
    </z-content>
  `,
})
export class MonorepoPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'what-changes', label: 'What changes', type: 'custom' },
      { id: 'application', label: 'Nx application', type: 'custom' },
      { id: 'library', label: 'Nx library', type: 'custom' },
      { id: 'projects', label: 'Choosing the project', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Monorepo',
      'Set up zard/ui in an Nx workspace: aliases in tsconfig.base.json, Tailwind inside the app, and what changes when the target is a library.',
      '/docs/monorepo',
      'og-monorepo.jpg',
    );
  }
}
