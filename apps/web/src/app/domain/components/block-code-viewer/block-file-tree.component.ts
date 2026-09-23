import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardTooltipDirective } from '@zard/components/tooltip/tooltip';

/** One node of the file tree. Folders carry `children`, files do not. */
export interface BlockFileNode {
  name: string;
  path: string;
  children?: BlockFileNode[];
}

/**
 * The file tree, rendered with the sidebar and collapsible primitives — the same composition
 * shadcn's block viewer uses. Subfolders recurse through `ngTemplateOutlet` rather than a nested
 * component: a standalone component cannot list itself in `imports` (the class is still undefined
 * when the decorator is evaluated).
 */
@Component({
  selector: 'z-block-file-tree',
  imports: [...ZardSidebarImports, ...ZardCollapsibleImports, ZardTooltipDirective, NgTemplateOutlet, NgIcon],
  template: `
    <ng-template #row let-node let-depth="depth">
      @if (node.children) {
        <li z-sidebar-menu-item z-collapsible zOpen class="group/collapsible">
          <button
            z-collapsible-trigger
            z-sidebar-menu-button
            class="hover:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 rounded-none pr-2 whitespace-nowrap"
            [style.paddingLeft]="indent(depth)"
          >
            <ng-icon
              name="lucideChevronRight"
              class="shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90"
            />
            <ng-icon name="lucideFolder" class="shrink-0" />
            <span class="truncate">{{ node.name }}</span>
          </button>

          <z-collapsible-content>
            <ul z-sidebar-menu-sub class="m-0 w-full translate-x-0 gap-0.5 border-none p-0">
              @for (child of node.children; track child.path) {
                <ng-container
                  [ngTemplateOutlet]="row"
                  [ngTemplateOutletContext]="{ $implicit: child, depth: depth + 1 }"
                />
              }
            </ul>
          </z-collapsible-content>
        </li>
      } @else {
        <li z-sidebar-menu-item>
          <button
            z-sidebar-menu-button
            [zActive]="selectedPath() === node.path"
            [zTooltip]="node.name"
            zPosition="right"
            class="hover:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 data-active:bg-muted-foreground/15 rounded-none pr-2 whitespace-nowrap"
            [style.paddingLeft]="indent(depth)"
            (click)="fileSelect.emit(node)"
          >
            <ng-icon name="lucideChevronRight" class="invisible shrink-0" />
            <ng-icon name="lucideFile" class="shrink-0" />
            <span class="truncate">{{ node.name }}</span>
          </button>
        </li>
      }
    </ng-template>

    @for (node of nodes(); track node.path) {
      <ng-container [ngTemplateOutlet]="row" [ngTemplateOutletContext]="{ $implicit: node, depth: 1 }" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `contents` keeps the rows as direct children of the enclosing `<ul>` as far as layout goes.
  host: { class: 'contents' },
  viewProviders: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
})
export class BlockFileTreeComponent {
  readonly nodes = input.required<readonly BlockFileNode[]>();
  readonly selectedPath = input<string | null>(null);

  readonly fileSelect = output<BlockFileNode>();

  /** Indentation of a row, mirroring shadcn's `pl-(--index)` trick. */
  protected indent(depth: number): string {
    return `${depth * 1.1}rem`;
  }
}
