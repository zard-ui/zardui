import { ZardBreadcrumbModule } from '@zard/components/sheet/sheet.module';
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import type { FileTreeNode, BlockFile } from '../block-container/block-container.component';

@Component({
  selector: 'z-file-tree',
  standalone: true,
  imports: [CommonModule, FileTreeComponent, ZardBreadcrumbModule],
  template: `
    @for (node of nodes(); track node.path) {
      @if (node.type === 'folder' && node.path) {
        <div class="folder-item">
          <button (click)="toggleFolder(node.path)" z-button zType="ghost" class="w-full justify-start ring-sidebar-ring">
            <i class="icon-chevron-right text-sm" [class.rotate-90]="isOpen(node.path)"></i>
            <i class="icon-folder text-sm"></i>
            <span class="font-normal truncate">{{ node.name }}</span>
          </button>
          @if (isOpen(node.path) && node.children && node.children.length > 0) {
            <div class="ml-5 mt-0.5 space-y-0.5 pl-2">
              <z-file-tree
                [nodes]="node.children"
                [openFolders]="openFolders()"
                [selectedFilePath]="selectedFilePath()"
                (folderToggled)="onFolderToggled($event)"
                (fileSelected)="onFileSelected($event)"
              />
            </div>
          }
        </div>
      } @else if (node.type === 'file' && node.file) {
        <button
          (click)="selectFile(node.file!)"
          [class]="selectedFilePath() === node.file.path ? 'bg-muted-foreground/15 text-sidebar-accent-foreground' : ''"
          class=" flex items-center gap-2 py-1 px-2 rounded transition-colors w-full text-left text-sm"
        >
          <i class="icon-file text-sm flex-shrink-0"></i>
          <span class="truncate">{{ node.name }}</span>
        </button>
      }
    }
  `,
})
export class FileTreeComponent {
  readonly nodes = input.required<FileTreeNode[]>();
  readonly openFolders = input.required<Set<string>>();
  readonly selectedFilePath = input<string | null>(null);

  readonly folderToggled = output<string>();
  readonly fileSelected = output<BlockFile>();

  protected toggleFolder(path: string): void {
    this.folderToggled.emit(path);
  }

  protected selectFile(file: BlockFile): void {
    this.fileSelected.emit(file);
  }

  protected isOpen(path: string): boolean {
    return this.openFolders().has(path);
  }

  protected onFolderToggled(path: string): void {
    this.folderToggled.emit(path);
  }

  protected onFileSelected(file: BlockFile): void {
    this.fileSelected.emit(file);
  }
}
