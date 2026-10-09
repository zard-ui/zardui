import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface FileTreeItem {
  name: string;
  items?: FileTreeItem[];
}

@Component({
  selector: 'z-demo-collapsible-file-tree',
  imports: [ZardCollapsibleImports, ZardCardImports, ZardTabsImports, ZardButtonComponent, NgIcon, NgTemplateOutlet],
  template: `
    <z-card zSize="sm" class="mx-auto w-full max-w-[16rem] gap-2">
      <z-card-header>
        <z-tab-group class="w-full **:[[role=tablist]]:w-full">
          <z-tab label="Explorer" />
          <z-tab label="Outline" />
        </z-tab-group>
      </z-card-header>
      <z-card-content>
        <div class="flex flex-col gap-1">
          @for (item of fileTree; track item.name) {
            <ng-container *ngTemplateOutlet="node; context: { $implicit: item }" />
          }
        </div>
      </z-card-content>
    </z-card>

    <ng-template #node let-item>
      @if (item.items) {
        <z-collapsible>
          <button
            z-button
            z-collapsible-trigger
            zType="ghost"
            zSize="sm"
            class="hover:bg-accent hover:text-accent-foreground group w-full justify-start transition-none"
          >
            <ng-icon name="lucideChevronRight" class="transition-transform group-data-[state=open]:rotate-90" />
            <ng-icon name="lucideFolder" />
            {{ item.name }}
          </button>
          <z-collapsible-content class="ml-5 data-[state=open]:mt-1">
            <div class="flex flex-col gap-1">
              @for (child of item.items; track child.name) {
                <ng-container *ngTemplateOutlet="node; context: { $implicit: child }" />
              }
            </div>
          </z-collapsible-content>
        </z-collapsible>
      } @else {
        <button z-button zType="link" zSize="sm" class="text-foreground w-full justify-start gap-2">
          <ng-icon name="lucideFile" />
          <span>{{ item.name }}</span>
        </button>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFolder, lucideFile })],
})
export class ZardDemoCollapsibleFileTreeComponent {
  protected readonly fileTree: FileTreeItem[] = [
    {
      name: 'components',
      items: [
        {
          name: 'ui',
          items: [
            { name: 'button.component.ts' },
            { name: 'card.component.ts' },
            { name: 'dialog.component.ts' },
            { name: 'input.component.ts' },
            { name: 'select.component.ts' },
            { name: 'table.component.ts' },
          ],
        },
        { name: 'login-form.component.ts' },
        { name: 'register-form.component.ts' },
      ],
    },
    {
      name: 'services',
      items: [{ name: 'auth.service.ts' }, { name: 'api.service.ts' }, { name: 'storage.service.ts' }],
    },
    {
      name: 'utils',
      items: [{ name: 'merge-classes.ts' }, { name: 'debounce.ts' }, { name: 'media-query.ts' }],
    },
    {
      name: 'types',
      items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }],
    },
    {
      name: 'public',
      items: [{ name: 'favicon.ico' }, { name: 'logo.svg' }, { name: 'images' }],
    },
    { name: 'app.component.ts' },
    { name: 'app.config.ts' },
    { name: 'app.routes.ts' },
    { name: 'styles.css' },
    { name: 'project.json' },
    { name: 'nx.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
    { name: '.gitignore' },
  ];
}
