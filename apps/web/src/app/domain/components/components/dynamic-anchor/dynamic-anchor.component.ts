import { TitleCasePipe, ViewportScroller } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { ComponentData } from '@zard/shared/constants/components.constant';

@Component({
  selector: 'z-dynamic-anchor',
  imports: [TitleCasePipe],
  templateUrl: './dynamic-anchor.component.html',
})
export class DynamicAnchorComponent {
  private viewportScroller = inject(ViewportScroller);

  activeAnchor = model<string | undefined>();
  componentData = input<ComponentData | undefined>();

  scrollToAnchor(anchor: string) {
    this.activeAnchor.set(anchor);
    const anchorElement = document.getElementById(anchor);

    this.viewportScroller.scrollToPosition([0, (anchorElement?.offsetTop || 0) - 60]);
  }
}
