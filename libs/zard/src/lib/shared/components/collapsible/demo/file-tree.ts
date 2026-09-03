import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideFile, lucideFolder } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-file-tree',
  imports: [ZardCollapsibleImports, ZardButtonComponent, NgIcon],
  template: `
    <div class="w-full max-w-sm rounded-md border p-2 text-sm">
      <z-collapsible zOpen class="flex flex-col gap-0.5">
        <button
          z-button
          z-collapsible-trigger
          zType="ghost"
          zSize="sm"
          class="group w-full justify-start gap-1.5 px-2 font-normal"
        >
          <ng-icon name="lucideChevronRight" class="size-3.5 transition-transform group-data-[state=open]:rotate-90" />
          <ng-icon name="lucideFolder" class="text-muted-foreground size-4" />
          components
        </button>

        <z-collapsible-content>
          <div class="flex flex-col gap-0.5 pl-5">
            <z-collapsible class="flex flex-col gap-0.5">
              <button
                z-button
                z-collapsible-trigger
                zType="ghost"
                zSize="sm"
                class="group w-full justify-start gap-1.5 px-2 font-normal"
              >
                <ng-icon
                  name="lucideChevronRight"
                  class="size-3.5 transition-transform group-data-[state=open]:rotate-90"
                />
                <ng-icon name="lucideFolder" class="text-muted-foreground size-4" />
                ui
              </button>

              <z-collapsible-content>
                <div class="flex flex-col gap-0.5 pl-5">
                  @for (file of uiFiles; track file) {
                    <div class="text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1">
                      <span class="size-3.5"></span>
                      <ng-icon name="lucideFile" class="size-4" />
                      {{ file }}
                    </div>
                  }
                </div>
              </z-collapsible-content>
            </z-collapsible>

            <div class="text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1">
              <span class="size-3.5"></span>
              <ng-icon name="lucideFile" class="size-4" />
              login-form.tsx
            </div>
          </div>
        </z-collapsible-content>
      </z-collapsible>

      <z-collapsible class="flex flex-col gap-0.5">
        <button
          z-button
          z-collapsible-trigger
          zType="ghost"
          zSize="sm"
          class="group w-full justify-start gap-1.5 px-2 font-normal"
        >
          <ng-icon name="lucideChevronRight" class="size-3.5 transition-transform group-data-[state=open]:rotate-90" />
          <ng-icon name="lucideFolder" class="text-muted-foreground size-4" />
          lib
        </button>

        <z-collapsible-content>
          <div class="flex flex-col gap-0.5 pl-5">
            @for (file of libFiles; track file) {
              <div class="text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1">
                <span class="size-3.5"></span>
                <ng-icon name="lucideFile" class="size-4" />
                {{ file }}
              </div>
            }
          </div>
        </z-collapsible-content>
      </z-collapsible>

      @for (file of rootFiles; track file) {
        <div class="text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1">
          <span class="size-3.5"></span>
          <ng-icon name="lucideFile" class="size-4" />
          {{ file }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight, lucideFolder, lucideFile })],
})
export class ZardDemoCollapsibleFileTreeComponent {
  protected readonly uiFiles: readonly string[] = ['button.tsx', 'card.tsx', 'dialog.tsx'];
  protected readonly libFiles: readonly string[] = ['utils.ts', 'api.ts'];
  protected readonly rootFiles: readonly string[] = ['app.tsx', 'package.json'];
}
