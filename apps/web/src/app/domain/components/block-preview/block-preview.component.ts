import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { ZardResizablePanelComponent } from '@zard/components/resizable/resizable-panel.component';
import { ZardResizableComponent } from '@zard/components/resizable/resizable.component';
import { EDarkModes, ZardDarkMode } from '@zard/services/dark-mode';

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

  private readonly darkModeService = inject(ZardDarkMode);

  protected readonly currentImage = computed(() => {
    const blockData = this.block();
    if (!blockData?.image) return undefined;

    const theme = this.darkModeService.themeMode();
    return theme === EDarkModes.DARK ? blockData.image.dark : blockData.image.light;
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
