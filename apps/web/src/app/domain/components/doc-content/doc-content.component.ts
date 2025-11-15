import { ViewportScroller } from '@angular/common';
import { Component, inject, input, type OnInit } from '@angular/core';

import { DynamicAnchorComponent, type NavigationConfig } from '../dynamic-anchor/dynamic-anchor.component';

@Component({
  selector: 'z-content',
  imports: [DynamicAnchorComponent],
  templateUrl: './doc-content.component.html',
})
export class DocContentComponent implements OnInit {
  private readonly viewportScroller = inject(ViewportScroller);

  readonly navigationConfig = input<NavigationConfig>();
  activeAnchor = input<string>();
  onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
