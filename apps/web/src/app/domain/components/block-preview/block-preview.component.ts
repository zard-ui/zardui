import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { ZardResizablePanelComponent } from '../../../../../../../libs/zard/resizable/resizable-panel.component';
import { ZardResizableComponent } from '../../../../../../../libs/zard/resizable/resizable.component';
import { DarkModeService } from '../../../shared/services/darkmode.service';
import type { Block } from '../block-container/block-container.component';

@Component({
  selector: 'z-block-preview',
  standalone: true,
  imports: [NgComponentOutlet, ZardResizableComponent, ZardResizablePanelComponent],
  templateUrl: './block-preview.component.html',
})
export class BlockPreviewComponent {
  readonly component = input.required<any>();
  readonly viewportSize = input<'desktop' | 'tablet' | 'mobile'>('desktop');
  readonly block = input<Block>();

  private readonly darkModeService = inject(DarkModeService);

  protected readonly currentImage = computed(() => {
    const blockData = this.block();
    if (!blockData?.image) return undefined;

    const theme = this.darkModeService.theme();
    return theme === 'dark' ? blockData.image.dark : blockData.image.light;
  });

  protected getViewportWidth(): string {
    switch (this.viewportSize()) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  }

  protected shouldShowImage(): boolean {
    return false;
  }

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('Erro ao carregar imagem:', {
      src: img.src,
      block: this.block()?.id,
      theme: this.darkModeService.getCurrentTheme(),
      currentImage: this.currentImage(),
    });
  }
}
