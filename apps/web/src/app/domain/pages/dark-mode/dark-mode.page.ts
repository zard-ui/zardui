import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { ScrollSpyItemDirective } from '../../directives/scroll-spy-item.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';
import { MarkdownRendererComponent } from '@zard/domain/components/render/markdown-renderer.component';

@Component({
  selector: 'z-darkmode',
  standalone: true,
  imports: [RouterModule, DocContentComponent, DocHeadingComponent, ScrollSpyDirective, ScrollSpyItemDirective, MarkdownRendererComponent],
  templateUrl: './dark-mode.page.html',
})
export class DarkmodePage {
  readonly title = 'Dark Mode - zard/ui';
  activeAnchor?: string;

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'custom-variants', label: 'Custom Variants', type: 'custom' },
      { id: 'darkmode-service', label: 'Darkmode Service', type: 'custom' },
      { id: 'implementation', label: 'Implementation', type: 'custom' },
      { id: 'usage-examples', label: 'Usage Examples', type: 'custom' },
      { id: 'angular-integration', label: 'Angular Integration', type: 'custom' },
    ],
  };
}
