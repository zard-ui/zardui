import { Component, inject } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/components';
import { ZardDialogService } from '@zard/components/dialog/dialog.service';

import { CommandDocComponent } from '../doc-command/doc-command.component';

@Component({
  selector: 'z-doc-researcher',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button
      z-button
      zType="ghost"
      class="relative h-8 w-full justify-start pl-4 shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 bg-muted/50 text-muted-foreground dark:bg-muted/50 hover:bg-secondary/80"
      (click)="openDialog()"
    >
      <span class="hidden lg:inline-flex">Search documentation...</span>
      <span class="inline-flex lg:hidden">Search...</span>
      <div class="absolute top-1.5 right-2 hidden gap-1 sm:flex">
        <kbd
          class="pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background text-muted-foreground px-1 font-sans text-[0.7rem] font-medium select-none"
        >
          ⌘
        </kbd>
        <kbd
          class="pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background text-muted-foreground px-1 font-sans text-[0.7rem] font-medium select-none aspect-square"
        >
          K
        </kbd>
      </div>
    </button>
  `,
})
export class DocResearcherComponent {
  private dialogService = inject(ZardDialogService);

  openDialog() {
    this.dialogService.create({
      zContent: CommandDocComponent,
      zOkText: null,
      zCancelText: null,
    });
  }
}
