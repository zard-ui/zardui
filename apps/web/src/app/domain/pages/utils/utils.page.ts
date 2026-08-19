import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideBlend, lucideSparkles } from '@ng-icons/lucide';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

import { UtilityCardComponent } from './components/utility-card.component';
import { UtilsSectionComponent } from './components/utils-section.component';

interface Utility {
  name: string;
  summary: string;
  icon: string;
  path: string;
}

const UTILITIES: Utility[] = [
  {
    name: 'Scroll Fade',
    summary: 'Fade the edges of a scroll container, in sync with the scroll position.',
    icon: 'lucideBlend',
    path: '/docs/utils/scroll-fade',
  },
  {
    name: 'Shimmer',
    summary: 'A sweeping highlight across text, for the seconds where something is being generated.',
    icon: 'lucideSparkles',
    path: '/docs/utils/shimmer',
  },
];

@Component({
  selector: 'z-utils',
  imports: [
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    UtilityCardComponent,
    UtilsSectionComponent,
  ],
  template: `
    <z-content
      [navigationConfig]="navigationConfig"
      [activeAnchor]="activeAnchor"
      scrollSpy
      (scrollSpyChange)="activeAnchor = $event"
    >
      <z-doc-heading
        title="Utilities"
        description="CSS utilities that ship with zard/ui for effects Tailwind has no primitive for — no JavaScript, no component to install."
        scrollSpyItem="overview"
        id="overview"
      ></z-doc-heading>

      <z-utils-section
        scrollSpyItem="available"
        id="available"
        heading="Available utilities"
        lead="Two so far. Each one is a class you add to an element you already have."
      >
        <div class="grid gap-6 sm:grid-cols-2">
          @for (utility of utilities; track utility.path) {
            <z-utility-card
              [name]="utility.name"
              [summary]="utility.summary"
              [icon]="utility.icon"
              [path]="utility.path"
            />
          }
        </div>
      </z-utils-section>

      <z-utils-section scrollSpyItem="how-they-work" id="how-they-work" heading="How they work">
        <p class="text-muted-foreground leading-relaxed">
          Each one is a Tailwind v4
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">&#64;utility</code>
          definition in the library's global stylesheet, so it arrives with the
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">core</code>
          registry item and needs nothing else installed.
        </p>
        <p class="text-muted-foreground leading-relaxed">
          They compose with variants the way any other class does —
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">md:</code>
          ,
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">dark:</code>
          and
          <code class="bg-muted rounded px-1.5 py-0.5 text-sm">hover:</code>
          all work — and they cost nothing at runtime: there is no directive to import, no service to inject and no
          listener to unsubscribe from.
        </p>
      </z-utils-section>
    </z-content>
  `,
  viewProviders: [provideIcons({ lucideBlend, lucideSparkles })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtilsPage implements OnInit {
  private readonly seoService = inject(SeoService);

  protected readonly utilities = UTILITIES;
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'available', label: 'Available utilities', type: 'custom' },
      { id: 'how-they-work', label: 'How they work', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Utilities',
      'CSS utilities that ship with zard/ui for effects Tailwind has no primitive for — scroll-fade and shimmer, with no JavaScript and no component to install.',
      '/docs/utils',
      'og-utils.jpg',
    );
  }
}
