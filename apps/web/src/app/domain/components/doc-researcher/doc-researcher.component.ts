import { Component, inject } from '@angular/core';
import { ZardButtonComponent } from '@zard/components/components';
import { ZardDialogService } from '@zard/components/dialog/dialog.service';
import { CommandDocComponent } from '../doc-command/doc-command.component';

@Component({
  selector: 'z-doc-researcher',
  standalone: true,
  imports: [ZardButtonComponent],
  template: ` <button z-button zType="outline" (click)="openDialog()">🔍 Search</button> `,
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
