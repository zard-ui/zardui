import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';
import { ZardAccordionComponent, ZardAccordionItemComponent } from '@zard/components/components';

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
    ZardAccordionComponent,
    ZardAccordionItemComponent,
  ],
  templateUrl: './theming.page.html',
})
export class ThemingPage {
  readonly title = 'Theming - zard/ui';
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
}
