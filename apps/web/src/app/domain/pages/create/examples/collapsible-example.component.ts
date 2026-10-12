import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder, lucideMaximize, lucideMinimize } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card';
import { ZardCollapsibleImports } from '@zard/components/collapsible';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardTabsImports } from '@zard/components/tabs';

import { ExampleImports } from './example.component';

interface FileTreeItem {
  readonly name: string;
  readonly items?: readonly FileTreeItem[];
}

const FILE_TREE: readonly FileTreeItem[] = [
  {
    name: 'components',
    items: [
      {
        name: 'ui',
        items: [
          { name: 'button.tsx' },
          { name: 'card.tsx' },
          { name: 'dialog.tsx' },
          { name: 'input.tsx' },
          { name: 'select.tsx' },
          { name: 'table.tsx' },
        ],
      },
      { name: 'login-form.tsx' },
      { name: 'register-form.tsx' },
    ],
  },
  { name: 'lib', items: [{ name: 'utils.ts' }, { name: 'cn.ts' }, { name: 'api.ts' }] },
  {
    name: 'hooks',
    items: [{ name: 'use-media-query.ts' }, { name: 'use-debounce.ts' }, { name: 'use-local-storage.ts' }],
  },
  { name: 'types', items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }] },
  { name: 'public', items: [{ name: 'favicon.ico' }, { name: 'logo.svg' }, { name: 'images' }] },
  { name: 'app.tsx' },
  { name: 'layout.tsx' },
  { name: 'globals.css' },
  { name: 'package.json' },
  { name: 'tsconfig.json' },
  { name: 'README.md' },
  { name: '.gitignore' },
];

/** shadcn/ui's `collapsible-example`, in zard. */
@Component({
  selector: 'z-collapsible-example',
  imports: [
    ExampleImports,
    NgIcon,
    NgTemplateOutlet,
    ZardButtonComponent,
    ZardCardImports,
    ZardCollapsibleImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardTabsImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFile, lucideFolder, lucideMaximize, lucideMinimize })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="File Tree" zClass="items-center">
        <z-card class="mx-auto w-full max-w-[16rem] gap-2" zSize="sm">
          <z-card-header>
            <z-tab-group class="**:[[role=tablist]]:w-full">
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
      </z-example>

      <z-example zTitle="Settings" zClass="items-center">
        <z-card class="mx-auto w-full max-w-xs" zSize="sm">
          <z-card-header>
            <z-card-title zTitle="Radius" />
            <z-card-description zDescription="Set the corner radius of the element." />
          </z-card-header>
          <z-card-content>
            <z-collapsible
              class="flex items-start gap-2"
              [zOpen]="settingsOpen()"
              (zOpenChange)="settingsOpen.set($event)"
            >
              <div z-field-group class="grid w-full grid-cols-2 gap-2">
                <div z-field>
                  <label z-field-label for="radius-x" class="sr-only">Radius X</label>
                  <input z-input id="radius" placeholder="0" value="0" />
                </div>
                <div z-field>
                  <label z-field-label for="radius-y" class="sr-only">Radius Y</label>
                  <input z-input id="radius" placeholder="0" value="0" />
                </div>
                <!-- zard wraps the content in an overflow box, so the subgrid becomes a nested two-column grid. -->
                <z-collapsible-content class="col-span-full">
                  <div class="grid grid-cols-2 gap-2">
                    <div z-field>
                      <label z-field-label for="radius-x" class="sr-only">Radius X</label>
                      <input z-input id="radius" placeholder="0" value="0" />
                    </div>
                    <div z-field>
                      <label z-field-label for="radius-y" class="sr-only">Radius Y</label>
                      <input z-input id="radius" placeholder="0" value="0" />
                    </div>
                  </div>
                </z-collapsible-content>
              </div>
              <button type="button" z-button z-collapsible-trigger zType="outline" zSize="icon">
                <ng-icon [name]="settingsOpen() ? 'lucideMinimize' : 'lucideMaximize'" />
              </button>
            </z-collapsible>
          </z-card-content>
        </z-card>
      </z-example>
    </z-example-wrapper>

    <ng-template #node let-item>
      @if (item.items) {
        <z-collapsible>
          <button
            type="button"
            z-button
            z-collapsible-trigger
            zType="ghost"
            zSize="sm"
            class="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
          >
            <ng-icon name="lucideChevronRight" class="transition-transform group-data-[state=open]:rotate-90" />
            <ng-icon name="lucideFolder" />
            {{ item.name }}
          </button>
          <z-collapsible-content class="style-lyra:ml-4 ml-5 data-[state=open]:mt-1">
            <div class="flex flex-col gap-1">
              @for (child of item.items; track child.name) {
                <ng-container *ngTemplateOutlet="node; context: { $implicit: child }" />
              }
            </div>
          </z-collapsible-content>
        </z-collapsible>
      } @else {
        <button type="button" z-button zType="link" zSize="sm" class="text-foreground w-full justify-start gap-2">
          <ng-icon name="lucideFile" />
          <span>{{ item.name }}</span>
        </button>
      }
    </ng-template>
  `,
})
export class CollapsibleExampleComponent {
  protected readonly fileTree = FILE_TREE;
  protected readonly settingsOpen = signal(false);
}
