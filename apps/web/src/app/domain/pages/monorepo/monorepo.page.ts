import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { MonorepoApplicationSection } from './sections/application.component';
import { MonorepoLibrarySection } from './sections/library.component';
import { MonorepoOverviewSection } from './sections/overview.component';
import { MonorepoProjectsSection } from './sections/projects.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-monorepo',
  standalone: true,
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    MonorepoOverviewSection,
    MonorepoApplicationSection,
    MonorepoLibrarySection,
    MonorepoProjectsSection,
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

      <monorepo-overview-section scrollSpyItem="what-changes" id="what-changes"></monorepo-overview-section>
      <monorepo-application-section scrollSpyItem="application" id="application"></monorepo-application-section>
      <monorepo-library-section scrollSpyItem="library" id="library"></monorepo-library-section>
      <monorepo-projects-section scrollSpyItem="projects" id="projects"></monorepo-projects-section>
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
