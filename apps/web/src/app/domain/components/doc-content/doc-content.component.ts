import { DynamicAnchorComponent, NavigationConfig } from '@zard/domain/components/dynamic-anchor/dynamic-anchor.component';
import { Component, inject, OnInit, input } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'z-content',
  imports: [DynamicAnchorComponent],
  templateUrl: './doc-content.component.html',
})
export class DocContentComponent implements OnInit {
  private readonly titleService = inject(Title);
  private readonly viewportScroller = inject(ViewportScroller);

  readonly title = input<string>();
  readonly navigationConfig = input<NavigationConfig>();
  activeAnchor = input<string>();
  onAnchorClick = input<((anchorId: string) => void | Promise<void>) | null>(null);

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);
    if (this.title()) {
      this.titleService.setTitle(this.title()!);
    }
  }
}
