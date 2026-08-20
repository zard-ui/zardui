import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { BlocksService } from '../../../services/blocks.service';

@Component({
  selector: 'z-block-preview-page',
  imports: [NgComponentOutlet],
  template: `
    @if (block(); as b) {
      <ng-container *ngComponentOutlet="b.component"></ng-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'blockAnchorNavigation($event)',
    '(auxclick)': 'blockAnchorNavigation($event)',
  },
})
export class BlockPreviewPage {
  private readonly route = inject(ActivatedRoute);
  private readonly blocksService = inject(BlocksService);

  private readonly blockId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  readonly block = computed(() => {
    const id = this.blockId();
    if (!id) return undefined;
    return this.blocksService.getAllBlocks().find(b => b.id === id);
  });

  /**
   * This page is the document the `/blocks` iframe loads. Blocks ship placeholder
   * anchors (`href="#"`), so a click would navigate the iframe away from the preview
   * — swallow it here instead of touching any block.
   */
  protected blockAnchorNavigation(event: MouseEvent): void {
    if ((event.target as Element | null)?.closest('a')) {
      event.preventDefault();
    }
  }
}
