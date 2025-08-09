import { NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { DocContentComponent } from '@zard/domain/components/doc-content/doc-content.component';
import { DocHeadingComponent } from '@zard/domain/components/doc-heading/doc-heading.component';
import { Component } from '@angular/core';

@Component({
  selector: 'z-json',
  templateUrl: './json.page.html',
  standalone: true,
  imports: [DocContentComponent, DocHeadingComponent],
})
export class JsonPage {
  readonly title = 'components.json - zard/ui';

  readonly navigationConfig: NavigationConfig = {
    items: [
      { id: 'overview', label: 'Overview', type: 'core' },
      { id: 'founders', label: 'Founders', type: 'custom' },
      { id: 'contributors', label: 'Contributors', type: 'custom' },
      { id: 'credits', label: 'Credits', type: 'custom' },
    ],
  };
}
