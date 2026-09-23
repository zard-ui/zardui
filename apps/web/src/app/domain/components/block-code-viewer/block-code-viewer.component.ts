import { ChangeDetectionStrategy, Component, computed, effect, input, signal, untracked } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideClipboard } from '@ng-icons/lucide';

import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardTooltipDirective } from '@zard/components/tooltip/tooltip';

import { BlockFileTreeComponent, type BlockFileNode } from './block-file-tree.component';
import { SimpleCodeHighlightComponent } from '../../../shared/components/simple-code-highlight/simple-code-highlight.component';
import type { BlockFile } from '../block-container/block-container.component';

/** A tree node that also remembers which file it stands for. */
interface BlockFileTreeNode extends BlockFileNode {
  file?: BlockFile;
  children?: BlockFileTreeNode[];
}

@Component({
  selector: 'z-block-code-viewer',
  imports: [...ZardSidebarImports, BlockFileTreeComponent, ZardTooltipDirective, SimpleCodeHighlightComponent, NgIcon],
  templateUrl: './block-code-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCheck, lucideClipboard })],
})
export class BlockCodeViewerComponent {
  readonly files = input.required<BlockFile[]>();

  protected readonly selectedFile = signal<BlockFile | null>(null);
  protected readonly copied = signal(false);
  private copiedTimeout?: ReturnType<typeof setTimeout>;

  protected readonly fileTree = computed(() => this.buildFileTree(this.files()));

  constructor() {
    effect(() => {
      const currentFiles = this.files();
      if (currentFiles.length > 0 && !untracked(() => this.selectedFile())) {
        this.selectedFile.set(currentFiles[0]);
      }
    });
  }

  private buildFileTree(files: BlockFile[]): BlockFileTreeNode[] {
    const root: BlockFileTreeNode = { name: 'root', path: '', children: [] };

    for (const file of files) {
      const parts = file.path.split('/');
      let currentNode = root;

      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        currentNode.children ??= [];
        let childNode = currentNode.children.find(child => child.path === currentPath);

        if (!childNode) {
          childNode = {
            name: part,
            path: currentPath,
            file: isFile ? file : undefined,
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

  private sortChildren(node: BlockFileTreeNode): void {
    if (!node.children?.length) {
      return;
    }

    node.children.sort((a, b) => {
      const aIsFile = !a.children;
      const bIsFile = !b.children;
      if (aIsFile !== bIsFile) {
        return aIsFile ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const child of node.children) {
      this.sortChildren(child);
    }
  }

  protected selectFile(node: BlockFileNode): void {
    const file = (node as BlockFileTreeNode).file;
    if (file) {
      this.selectedFile.set(file);
    }
  }

  protected getFileIcon(fileName: string): string {
    if (
      fileName.includes('.component.ts') ||
      fileName.includes('.service.ts') ||
      fileName.includes('.module.ts') ||
      fileName.includes('.directive.ts') ||
      fileName.includes('.pipe.ts')
    ) {
      return '/icons/angular-file.svg';
    }

    switch (fileName.split('.').pop()?.toLowerCase()) {
      case 'json':
        return '/icons/json.svg';
      case 'html':
        return '/icons/html.svg';
      default:
        return '/icons/typescript.svg';
    }
  }

  protected copyToClipboard(): void {
    const file = this.selectedFile();
    if (!file) {
      return;
    }

    navigator.clipboard
      .writeText(file.content)
      .then(() => {
        this.copied.set(true);
        clearTimeout(this.copiedTimeout);
        this.copiedTimeout = setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => undefined);
  }
}
