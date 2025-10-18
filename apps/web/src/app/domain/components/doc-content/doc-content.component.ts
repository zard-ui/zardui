import { DynamicAnchorComponent, NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { Component, inject, OnInit, input } from '@angular/core';
import { ViewportScroller } from '@angular/common';

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
