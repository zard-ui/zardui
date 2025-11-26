import { Component, input, signal } from '@angular/core';

import { ZardDividerComponent } from '@ngzard/ui/divider';
import { ZardIcon } from '@ngzard/ui/icon';
import { ZardSegmentedComponent } from '@ngzard/ui/segmented';
import { ZardToggleGroupComponent } from '@ngzard/ui/toggle-group';

import { BlockCodeViewerComponent } from '../block-code-viewer/block-code-viewer.component';
import { BlockPreviewComponent } from '../block-preview/block-preview.component';

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

export interface ViewportOption {
  value: string;
  ariaLabel: string;
  icon: ZardIcon;
}

@Component({
  selector: 'z-block-container',
  standalone: true,
  imports: [
    ZardSegmentedComponent,
    ZardDividerComponent,
    ZardToggleGroupComponent,
    BlockPreviewComponent,
    BlockCodeViewerComponent,
  ],
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

  protected readonly viewportOptions: ViewportOption[] = [
    { value: 'desktop', ariaLabel: 'Desktop view', icon: 'monitor' },
    { value: 'tablet', ariaLabel: 'Tablet view', icon: 'tablet' },
    { value: 'mobile', ariaLabel: 'Mobile view', icon: 'smartphone' },
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
