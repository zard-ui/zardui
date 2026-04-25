import { type AfterViewInit, Component, inject, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-basic-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }
        <z-command-option-group zLabel="Suggestions">
          <z-command-option zLabel="Calendar" zValue="calendar" />
          <z-command-option zLabel="Search Emoji" zValue="emoji" />
          <z-command-option zLabel="Calculator" zValue="calculator" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
})
class ZardDemoCommandBasicDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-basic',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandBasicComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandBasicDialogComponent,
      zClosable: false,
      zHideFooter: true,
      zOkText: null,
      zCancelText: null,
      zMaskClosable: true,
      zWidth: '24rem',
      zCustomClasses: '!p-0 !gap-0 !border-0 !bg-transparent !shadow-none',
    });
  }
}
