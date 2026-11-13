import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

type FileNode =
  | { type: 'file'; name: string; path: string }
  | { type: 'folder'; name: string; path: string; children: FileNode[] };

const FILES: FileNode[] = [
  {
    type: 'folder',
    name: 'app',
    path: 'src/app',
    children: [
      { type: 'file', name: 'app.config.ts', path: 'src/app/app.config.ts' },
      { type: 'file', name: 'app.routes.ts', path: 'src/app/app.routes.ts' },
    ],
  },
  {
    type: 'folder',
    name: 'shared',
    path: 'src/app/shared',
    children: [
      {
        type: 'folder',
        name: 'components',
        path: 'src/app/shared/components',
        children: [
          { type: 'file', name: 'button.component.ts', path: 'src/app/shared/components/button.component.ts' },
        ],
      },
      { type: 'file', name: 'login-form.ts', path: 'src/app/shared/login-form.ts' },
    ],
  },
];

@Component({
  selector: 'z-ai-elements-file-tree',
  imports: [NgIcon, NgTemplateOutlet, ZardButtonComponent, ...ZardCollapsibleImports],
  template: `
    <!-- Nodes render recursively: a folder nests its children in its collapsible content. -->
    <ng-template #tree let-node>
      @if (node.type === 'folder') {
        <z-collapsible zOpen>
          <button
            type="button"
            z-button
            z-collapsible-trigger
            zType="ghost"
            zSize="sm"
            class="group/file-tree w-full justify-start font-normal"
          >
            <ng-icon
              name="lucideChevronRight"
              class="transition-transform group-aria-expanded/file-tree:rotate-90 rtl:-scale-x-100 rtl:group-aria-expanded/file-tree:-rotate-90"
            />
            <ng-icon name="lucideFolder" />
            {{ node.name }}
          </button>
          <z-collapsible-content>
            <div class="ms-4 flex flex-col">
              @for (child of node.children; track child.path) {
                <ng-container *ngTemplateOutlet="tree; context: { $implicit: child }" />
              }
            </div>
          </z-collapsible-content>
        </z-collapsible>
      } @else {
        <button
          type="button"
          z-button
          zType="ghost"
          zSize="sm"
          class="w-full justify-start font-normal"
          [class.bg-accent]="selected() === node.path"
          [class.text-accent-foreground]="selected() === node.path"
          [attr.aria-current]="selected() === node.path ? 'true' : null"
          (click)="selected.set(node.path)"
        >
          <ng-icon name="lucideFile" />
          {{ node.name }}
        </button>
      }
    </ng-template>

    <div class="flex w-full max-w-xs flex-col py-6 text-sm">
      @for (node of files; track node.path) {
        <ng-container *ngTemplateOutlet="tree; context: { $implicit: node }" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder })],
  host: { class: 'contents' },
})
export class ZardAiElementsFileTreeComponent {
  protected readonly files = FILES;
  protected readonly selected = signal('src/app/shared/components/button.component.ts');
}
