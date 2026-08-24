import { Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { SeoService } from '@doc/shared/services/seo.service';

import { SkillsHowItWorksSectionComponent } from './sections/how-it-works.component';
import { SkillsIncludedSectionComponent } from './sections/included.component';
import { SkillsInstallationSectionComponent } from './sections/installation.component';
import { SkillsOverviewSectionComponent } from './sections/overview.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-skills',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    SkillsOverviewSectionComponent,
    SkillsInstallationSectionComponent,
    SkillsIncludedSectionComponent,
    SkillsHowItWorksSectionComponent,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Skills"
        description="Teach your AI assistant how zard/ui is actually built — the conventions, the CLI and the registry — so it writes code that compiles the first time."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-skills-overview-section scrollSpyItem="what-it-changes" id="what-it-changes"></z-skills-overview-section>
      <z-skills-installation-section scrollSpyItem="installation" id="installation"></z-skills-installation-section>
      <z-skills-included-section scrollSpyItem="whats-included" id="whats-included"></z-skills-included-section>
      <z-skills-how-it-works-section scrollSpyItem="how-it-works" id="how-it-works"></z-skills-how-it-works-section>
    </z-content>
  `,
})
export class SkillsPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'what-it-changes', label: 'What it changes', type: 'custom' },
      { id: 'installation', label: 'Installation', type: 'custom' },
      { id: 'whats-included', label: "What's included", type: 'custom' },
      { id: 'how-it-works', label: 'How it works', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Skills',
      'Install the zard/ui skill so your AI assistant knows the component conventions, the CLI commands and the registry format instead of guessing at them.',
      '/docs/skills',
      'og-skills.jpg',
    );
  }
}
