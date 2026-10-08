import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardKbdImports } from '@/shared/components/kbd/kbd.imports';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ZardDemoCommandBasicDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-basic',
  imports: [ZardButtonComponent, ZardKbdImports],
  template: `
    <button type="button" z-button zType="outline" class="gap-4" (click)="open()">
      Open Menu
      <z-kbd-group>
        <z-kbd>⌘</z-kbd>
        <z-kbd>K</z-kbd>
      </z-kbd-group>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // A command palette a reader cannot learn to open is half-documented:
    // ⌘K / Ctrl+K opens the same dialog as clicking the button.
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class ZardDemoCommandBasicComponent {
  private readonly dialogService = inject(ZardDialogService);

  onKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.open();
    }
  }

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
