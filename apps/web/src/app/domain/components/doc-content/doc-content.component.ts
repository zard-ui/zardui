import { Component, input } from '@angular/core';

import { DynamicAnchorComponent, NavigationConfig } from '../dynamic-anchor/dynamic-anchor.component';

@Component({
  selector: 'z-content',
  imports: [DynamicAnchorComponent],
  templateUrl: './doc-content.component.html',
})
export class DocContentComponent {
  readonly navigationConfig = input<NavigationConfig>();
  activeAnchor = input<string>();
  onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);
}
