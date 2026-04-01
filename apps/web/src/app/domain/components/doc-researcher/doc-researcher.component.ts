import { Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardDialogService } from '@zard/components/dialog/dialog.service';

import { CommandDocComponent } from '../doc-command/doc-command.component';

@Component({
  selector: 'z-doc-researcher',
  standalone: true,
  imports: [ZardButtonComponent],
  template: `
    <button
      z-button
      zType="outline"
      class="w-full justify-start shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
      (click)="openCommandDialog()"
    >
      <span class="hidden lg:inline-flex">Search documentation...</span>
      <span class="inline-flex lg:hidden">Search...</span>
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
