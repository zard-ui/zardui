import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardTreeComponent } from '@zard/components/tree/tree.component';
import type { TreeNode } from '@zard/components/tree/tree.types';

import { SimpleCodeHighlightComponent } from '../../../shared/components/simple-code-highlight/simple-code-highlight.component';
import type { BlockFile } from '../block-container/block-container.component';

@Component({
  selector: 'z-block-code-viewer',
  imports: [SimpleCodeHighlightComponent, ZardTreeComponent, ZardIconComponent, ZardButtonComponent],
  templateUrl: './block-code-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockCodeViewerComponent {
  readonly files = input.required<BlockFile[]>();

  protected readonly selectedFile = signal<BlockFile | null>(null);

  protected readonly fileTree = computed(() => this.buildFileTree(this.files()));

  constructor() {
    setTimeout(() => {
      const currentFiles = this.files();
      if (currentFiles.length > 0) {
        this.selectedFile.set(currentFiles[0]);
      }
    });
  }

  private buildFileTree(files: BlockFile[]): TreeNode<BlockFile>[] {
    const root: TreeNode<BlockFile> = {
      key: '',
      label: 'root',
      children: [],
    };

    for (const file of files) {
      const parts = file.path.split('/');
      let currentNode = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join('/');

        if (!currentNode.children) {
          currentNode.children = [];
        }

        let childNode = currentNode.children.find(child => child.key === currentPath);

        if (!childNode) {
          childNode = {
            key: currentPath,
            label: part,
            icon: isFile ? 'file' : 'folder',
            leaf: isFile,
            data: isFile ? file : undefined,
            children: isFile ? undefined : [],
          };
          currentNode.children.push(childNode);
        }

        if (!isFile) {
          currentNode = childNode;
        }
      }
    }

    this.sortChildren(root);
    return root.children ?? [];
  }

  private sortChildren(node: TreeNode<BlockFile>): void {
    if (node.children?.length) {
      node.children.sort((a, b) => {
        if (a.leaf !== b.leaf) {
          return a.leaf ? 1 : -1;
        }
        return a.label.localeCompare(b.label);
      });
      for (const child of node.children) {
        this.sortChildren(child);
      }
    }
  }

  protected handleNodeClick(node: TreeNode<BlockFile>): void {
    if (node.leaf && node.data) {
      this.selectedFile.set(node.data);
    }
  }

  protected getFileIcon(fileName: string): string {
    if (fileName.includes('.component.ts')) {
      return '/icons/angular-file.svg';
    }

    if (
      fileName.includes('.service.ts') ||
      fileName.includes('.module.ts') ||
      fileName.includes('.directive.ts') ||
      fileName.includes('.pipe.ts')
    ) {
      return '/icons/angular-file.svg';
    }

    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
        return '/icons/typescript.svg';
      case 'js':
        return '/icons/typescript.svg';
      case 'json':
        return '/icons/json.svg';
      case 'html':
        return '/icons/html.svg';
      default:
        return '/icons/typescript.svg';
    }
  }

  protected copyToClipboard(): void {
    if (this.selectedFile()) {
      navigator.clipboard.writeText(this.selectedFile()!.content);
    }
  }
}
