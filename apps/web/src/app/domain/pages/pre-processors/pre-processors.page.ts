import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-pre-processors',
  templateUrl: './pre-processors.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class PreProcessorsPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Pre-processors',
      'Understanding SCSS/Sass integration with Tailwind v4 - risks, limitations, and alternatives.',
      '/docs/pre-processors',
      'og-preprocessors.jpg',
    );
  }

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'notice', label: 'Important Notice', type: 'custom' },
      { id: 'why-not', label: 'Why Not Ideal', type: 'custom' },
      { id: 'problems', label: 'Key Problems', type: 'custom' },
      { id: 'alternatives', label: 'Alternatives', type: 'custom' },
      { id: 'best-practices', label: 'Best Practices', type: 'custom' },
      { id: 'references', label: 'References', type: 'custom' },
    ],
  };
}
