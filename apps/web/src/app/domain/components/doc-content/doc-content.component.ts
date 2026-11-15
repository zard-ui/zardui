import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocPagerComponent } from '../doc-pager/doc-pager.component';
import { DynamicAnchorComponent, NavigationConfig } from '../dynamic-anchor/dynamic-anchor.component';

@Component({
  selector: 'z-content',
  imports: [DocPagerComponent, DynamicAnchorComponent],
  templateUrl: './doc-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocContentComponent {
  readonly navigationConfig = input<NavigationConfig>({ items: [] });
  readonly activeAnchor = input<string | undefined>();
  readonly onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);
}
