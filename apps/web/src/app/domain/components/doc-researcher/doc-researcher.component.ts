import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardDialogService } from '@ngzard/ui/dialog';

import { CommandDocComponent } from '../doc-command/doc-command.component';

@Component({
  selector: 'z-doc-researcher',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button
      z-button
      zType="ghost"
      class="bg-muted/50 text-muted-foreground dark:bg-muted/50 hover:bg-secondary/80 relative h-8 w-full justify-start pl-4 shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
      (click)="openCommandDialog()"
    >
      <span class="hidden lg:inline-flex">Search documentation...</span>
      <span class="inline-flex lg:hidden">Search...</span>
      <div class="absolute top-1.5 right-2 hidden gap-1 sm:flex">
        <kbd
          class="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none"
        >
          ⌘
        </kbd>
        <kbd
          class="bg-background text-muted-foreground pointer-events-none flex aspect-square h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none"
        >
          K
        </kbd>
      </div>
    </button>
  `,
})
export class DocResearcherComponent {
  private dialogService = inject(ZardDialogService);

  openCommandDialog() {
    this.dialogService.create({
      zContent: CommandDocComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '500px',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
