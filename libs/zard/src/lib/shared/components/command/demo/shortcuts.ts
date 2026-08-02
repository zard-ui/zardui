import { type AfterViewInit, Component, inject, viewChild } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCreditCard, lucideSettings, lucideUser } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCommandComponent } from '@/shared/components/command/command.component';
import { ZardCommandImports } from '@/shared/components/command/command.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'z-demo-command-shortcuts-dialog',
  imports: [ZardCommandImports],
  template: `
    <z-command #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }
        <z-command-option-group zLabel="Settings">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  viewProviders: [provideIcons({ lucideUser, lucideCreditCard, lucideSettings })],
})
class ZardDemoCommandShortcutsDialogComponent implements AfterViewInit {
  private readonly cmd = viewChild.required(ZardCommandComponent);
  ngAfterViewInit() {
    setTimeout(() => this.cmd().focus(), 0);
  }
}

@Component({
  selector: 'z-demo-command-shortcuts',
  imports: [ZardButtonComponent],
  template: `
    <button z-button zType="outline" (click)="open()">Open Menu</button>
  `,
})
export class ZardDemoCommandShortcutsComponent {
  private readonly dialogService = inject(ZardDialogService);

  open() {
    this.dialogService.create({
      zContent: ZardDemoCommandShortcutsDialogComponent,
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
