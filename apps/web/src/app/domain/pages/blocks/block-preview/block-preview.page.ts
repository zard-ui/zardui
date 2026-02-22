import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { BlocksService } from '../../../services/blocks.service';

@Component({
  selector: 'z-block-preview-page',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    @if (block(); as b) {
      <ng-container *ngComponentOutlet="b.component"></ng-container>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
