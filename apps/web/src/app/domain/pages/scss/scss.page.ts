import { CommonModule } from '@angular/common';
import { Component, inject, type OnInit } from '@angular/core';

import { SeoService } from '../../../shared/services/seo.service';
import { DocContentComponent } from '../../components/doc-content/doc-content.component';
import { DocHeadingComponent } from '../../components/doc-heading/doc-heading.component';
import { NavigationConfig } from '../../components/dynamic-anchor/dynamic-anchor.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'z-scss',
  templateUrl: './scss.page.html',
  standalone: true,
  imports: [CommonModule, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective],
})
export class ScssPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  ngOnInit(): void {
    this.seoService.setDocsSeo('SCSS & Tailwind v4', 'Understanding SCSS/Sass integration with Tailwind v4 - risks, limitations, and alternatives.', '/docs/scss', 'og-scss.jpg');
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
