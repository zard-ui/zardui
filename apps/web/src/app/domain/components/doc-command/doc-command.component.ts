import type { ZardCommandComponent, ZardCommandOption } from '@zard/components/command/command.component';
import { AfterViewInit, Component, inject, viewChild, OnDestroy } from '@angular/core';
import { ZardCommandModule } from '@zard/components/command/command.module';
import { ZardDialogRef } from '@zard/components/dialog/dialog-ref';
import { Router } from '@angular/router';

import { SIDEBAR_PATHS } from '../../../shared/constants/routes.constant';

@Component({
  standalone: true,
  imports: [ZardCommandModule],
  template: `
    <z-command #commandRef class="md:min-w-[500px]" (zOnSelect)="handleCommand($event)">
      <z-command-input placeholder="Search documentation..."></z-command-input>
      <z-command-list>
        <z-command-empty>No results found.</z-command-empty>

        <z-command-option-group zLabel="Getting Started">
          @for (item of gettingStartedItems; track item.path) {
            <z-command-option [zLabel]="item.name" [zValue]="'navigate:' + item.path" zIcon="file-text"> </z-command-option>
          }
        </z-command-option-group>

        <z-command-divider></z-command-divider>

        <z-command-option-group zLabel="Components">
          @for (item of componentItems; track item.path) {
            <z-command-option [zLabel]="item.name" [zValue]="'navigate:' + item.path" zIcon="layers"> </z-command-option>
          }
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
})
export class CommandDocComponent implements AfterViewInit, OnDestroy {
  readonly commandComponent = viewChild.required<ZardCommandComponent>('commandRef');
  private router = inject(Router);
  private dialogRef = inject(ZardDialogRef);
  private escapeListener?: (event: KeyboardEvent) => void;

  readonly gettingStartedItems = SIDEBAR_PATHS[0].data.filter(item => item.available);
  readonly componentItems = SIDEBAR_PATHS[1].data.filter(item => item.available);

  ngAfterViewInit() {
    // Focus the command input when the component is initialized
    setTimeout(() => {
      this.commandComponent().focus();
    }, 0);

    // Add document-level escape listener
    this.escapeListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.dialogRef.close();
      }
    };
    document.addEventListener('keydown', this.escapeListener);
  }

  ngOnDestroy() {
    // Clean up the escape listener
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
    }
  }

  handleCommand(option: ZardCommandOption) {
    const value = option.value as string;
    if (value.startsWith('navigate:')) {
      const path = value.replace('navigate:', '');
      this.router.navigate([path]);
      this.dialogRef.close();
    }
  }
}
