import { TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';

export interface Topic {
  name: string;
}

@Component({
  selector: 'z-dynamic-anchor',
  imports: [TitleCasePipe],
  templateUrl: './dynamic-anchor.component.html',
})
export class DynamicAnchorComponent {
  private viewportScroller = inject(ViewportScroller);

  activeAnchor = model<string | undefined>();
  topicData = input<Topic[] | undefined>();

  scrollToAnchor(anchor: string) {
    const anchorElement = document.getElementById(anchor);

    this.viewportScroller.scrollToPosition([0, anchorElement?.offsetTop || 0]);
  }
}
