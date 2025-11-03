import { Component, input, signal, computed } from '@angular/core';

import { ZardIconComponent } from '@zard/components/icon/icon.component';
import { ZardBreadcrumbModule } from '@zard/components/sheet/sheet.module';

import { SimpleCodeHighlightComponent } from '../../../shared/components/simple-code-highlight/simple-code-highlight.component';
import type { BlockFile, FileTreeNode } from '../block-container/block-container.component';
import { FileTreeComponent } from '../file-tree/file-tree.component';

@Component({
  selector: 'z-block-code-viewer',
  standalone: true,
  imports: [SimpleCodeHighlightComponent, FileTreeComponent, ZardBreadcrumbModule, ZardIconComponent],
  templateUrl: './block-code-viewer.component.html',
})
export class BlockCodeViewerComponent {
  readonly files = input.required<BlockFile[]>();

  readonly ClipboardIcon = Clipboard;
  protected readonly selectedFile = signal<BlockFile | null>(null);
  protected readonly openFolders = signal<Set<string>>(new Set());

  protected readonly fileTree = computed(() => {
    const files = this.files();
    return this.buildFileTree(files);
  });

  constructor() {
    setTimeout(() => {
      const currentFiles = this.files();
      if (currentFiles && currentFiles.length > 0) {
        this.selectedFile.set(currentFiles[0]);

        const tree = this.buildFileTree(currentFiles);
        const allFolderPaths = this.getAllFolderPaths(tree);
        this.openFolders.set(new Set(allFolderPaths));
      }
    });
  }

  private getAllFolderPaths(nodes: FileTreeNode[]): string[] {
    const paths: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'folder' && node.path) {
        paths.push(node.path);
        if (node.children && node.children.length > 0) {
          paths.push(...this.getAllFolderPaths(node.children));
        }
      }
    });
    return paths;
  }

  private buildFileTree(files: BlockFile[]): FileTreeNode[] {
    const root: FileTreeNode = {
      name: 'root',
      type: 'folder',
      path: '',
      children: [],
    };

    files.forEach(file => {
      const parts = file.path.split('/');
      let currentNode = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const currentPath = parts.slice(0, index + 1).join('/');

        if (!currentNode.children) {
          currentNode.children = [];
        }

        let childNode = currentNode.children.find(child => child.name === part);

        if (!childNode) {
          childNode = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            children: isFile ? undefined : [],
            file: isFile ? file : undefined,
          };
          currentNode.children.push(childNode);
        }

        if (!isFile) {
          currentNode = childNode;
        }
      });
    });

    const sortChildren = (node: FileTreeNode) => {
      if (node.children && node.children.length > 0) {
        node.children.sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(child => sortChildren(child));
      }
    };

    sortChildren(root);

    return root.children || [];
  }

  protected getFileIcon(fileName: string): string {
    if (fileName.includes('.component.ts')) {
      return '/icons/angular-file.svg';
    }

    if (fileName.includes('.service.ts') || fileName.includes('.module.ts') || fileName.includes('.directive.ts') || fileName.includes('.pipe.ts')) {
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

  protected toggleFolder(folderPath: string): void {
    const folders = new Set(this.openFolders());
    if (folders.has(folderPath)) {
      folders.delete(folderPath);
    } else {
      folders.add(folderPath);
    }
    this.openFolders.set(folders);
  }

  protected handleFileSelected(file: BlockFile): void {
    this.selectedFile.set(file);
  }
}
