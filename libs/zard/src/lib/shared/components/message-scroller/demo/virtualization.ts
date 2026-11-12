import { ScrollingModule, type CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { afterNextRender, ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

const TOTAL = 5000;

@Component({
  selector: 'z-demo-message-scroller-virtualization',
  imports: [ScrollingModule, ZardButtonComponent, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <cdk-virtual-scroll-viewport
        #viewport
        itemSize="56"
        role="region"
        aria-label="Messages"
        class="h-96 rounded-lg border"
      >
        <div *cdkVirtualFor="let id of ids" class="flex h-14 items-center px-4" [attr.data-message-id]="'m' + id">
          <z-message
            class="w-full"
            [zAlign]="id % 2 === 0 ? 'end' : 'start'"
            [zVariant]="id % 2 === 0 ? 'default' : 'muted'"
          >
            Message {{ id }} of {{ total }}
          </z-message>
        </div>
      </cdk-virtual-scroll-viewport>

      <button z-button zType="outline" type="button" (click)="scrollToLatest()">Jump to latest</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerVirtualizationComponent {
  private readonly viewport = viewChild.required<CdkVirtualScrollViewport>('viewport');

  protected readonly total = TOTAL;
  protected readonly ids = Array.from({ length: TOTAL }, (_, i) => i + 1);

  constructor() {
    // Wait a frame: the viewport measures itself once the rows are rendered.
    afterNextRender(() => requestAnimationFrame(() => this.scrollToLatest()));
  }

  protected scrollToLatest(): void {
    this.viewport().scrollToIndex(TOTAL - 1);
  }
}
