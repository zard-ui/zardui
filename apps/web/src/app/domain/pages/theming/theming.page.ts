import { Component, inject, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DocContentComponent } from '@doc/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@doc/domain/components/doc-heading/doc-heading.component';
import { NavigationConfig } from '@doc/domain/components/dynamic-anchor/dynamic-anchor.component';
import { MarkdownRendererComponent } from '@doc/domain/components/render/markdown-renderer.component';
import { ScrollSpyItemDirective } from '@doc/domain/directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '@doc/domain/directives/scroll-spy.directive';
import { SeoService } from '@doc/shared/services/seo.service';

@Component({
  selector: 'z-theming',
  standalone: true,
  imports: [
    RouterModule,
    DocContentComponent,
    DocHeadingComponent,
    ScrollSpyDirective,
    ScrollSpyItemDirective,
    MarkdownRendererComponent,
  ],
  templateUrl: './theming.page.html',
})
export class ThemingPage implements OnInit {
  private readonly seoService = inject(SeoService);
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'css-variables', label: 'CSS Variables', type: 'custom' },
      { id: 'utility-classes', label: 'Utility Classes', type: 'custom' },
      { id: 'convention', label: 'Convention', type: 'custom' },
      { id: 'variables-list', label: 'Variables List', type: 'custom' },
      { id: 'adding-new-colors', label: 'Adding New Colors', type: 'custom' },
      { id: 'base-colors', label: 'Base Colors', type: 'custom' },
      { id: 'other-formats', label: 'Other Formats', type: 'custom' },
    ],
  };

  ngOnInit(): void {
    this.seoService.setDocsSeo(
      'Theming',
      'Customize your Zard UI theme with CSS variables and Tailwind CSS. Learn how to add custom colors, use utility classes, and create your own design system.',
      '/docs/theming',
      'og-theming.jpg',
    );
  }
}
