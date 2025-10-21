import { ZardToggleGroupComponent } from '@zard/components/toggle-group/toggle-group.component';
import { ZardSegmentedComponent } from '@zard/components/segmented/segmented.component';
import { ZardDividerComponent } from '@zard/components/divider/divider.component';
import { Component, input, signal } from '@angular/core';

import { BlockCodeViewerComponent } from '../block-code-viewer/block-code-viewer.component';
import { BlockPreviewComponent } from '../block-preview/block-preview.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';

export interface BlockFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export interface Block {
  id: string;
  title: string;
  description: string;
  component: any;
  files: BlockFile[];
  category?: string;
  image?: {
    light: string;
    dark: string;
  };
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  children?: FileTreeNode[];
  file?: BlockFile;
}

@Component({
  selector: 'z-block-container',
  standalone: true,
  imports: [ZardSegmentedComponent, ZardDividerComponent, ZardToggleGroupComponent, BlockPreviewComponent, BlockCodeViewerComponent],
  templateUrl: './block-container.component.html',
})
export class BlockContainerComponent {
  readonly block = input.required<Block>();

  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly viewportSize = signal<'desktop' | 'tablet' | 'mobile'>('desktop');

  protected readonly tabOptions = [
    { label: 'Preview', value: 'preview' },
    { label: 'Code', value: 'code' },
  ];

  protected readonly viewportOptions = [
    { value: 'desktop', ariaLabel: 'Desktop view', icon: 'Monitor' },
    { value: 'tablet', ariaLabel: 'Tablet view', icon: 'Tablet' },
    { value: 'mobile', ariaLabel: 'Mobile view', icon: 'Smartphone' },
  ];

  protected onTabChange(value: string): void {
    this.activeTab.set(value as 'preview' | 'code');
  }

  protected onViewportChange(value: string | string[]): void {
    if (typeof value === 'string') {
      this.viewportSize.set(value as 'desktop' | 'tablet' | 'mobile');
    }
  }
}
