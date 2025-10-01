import { isPlatformBrowser } from '@angular/common';
import type { ZardCommandComponent, ZardCommandOption } from '@zard/components/command/command.component';
import { AfterViewInit, Component, inject, viewChild, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ZardCommandModule } from '@zard/components/command/command.module';
import { SIDEBAR_PATHS } from '@zard/shared/constants/routes.constant';
import { ZardDialogRef } from '@zard/components/dialog/dialog-ref';
import { Router } from '@angular/router';

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
            <z-command-option [zLabel]="item.name" [zValue]="'navigate:' + item.path" zIcon='<div class="icon-file-text"></div>'> </z-command-option>
          }
        </z-command-option-group>

        <z-command-divider></z-command-divider>

        <z-command-option-group zLabel="Components">
          @for (item of componentItems; track item.path) {
            <z-command-option [zLabel]="item.name" [zValue]="'navigate:' + item.path" zIcon='<div class="icon-layers"></div>'> </z-command-option>
          }
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
})
export class CommandDocComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(ZardDialogRef);

  readonly commandComponent = viewChild.required<ZardCommandComponent>('commandRef');
  private escapeListener?: (event: KeyboardEvent) => void;

  readonly gettingStartedItems = SIDEBAR_PATHS[0].data.filter(item => item.available);
  readonly componentItems = SIDEBAR_PATHS[1].data.filter(item => item.available);

  ngAfterViewInit() {
    if (!this.isBrowser) return;

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
    if (!this.isBrowser) return;

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
