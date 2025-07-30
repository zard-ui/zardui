import { Component, HostListener } from '@angular/core';

import { ZardCommandDividerComponent } from '../command-divider.component';
import { ZardCommandEmptyComponent } from '../command-empty.component';
import { ZardCommandInputComponent } from '../command-input.component';
import { ZardCommandListComponent } from '../command-list.component';
import { ZardCommandOptionGroupComponent } from '../command-option-group.component';
import { ZardCommandOptionComponent } from '../command-option.component';
import { ZardCommandComponent, ZardCommandOption } from '../command.component';

@Component({
  standalone: true,
  imports: [
    ZardCommandComponent,
    ZardCommandInputComponent,
    ZardCommandListComponent,
    ZardCommandEmptyComponent,
    ZardCommandOptionComponent,
    ZardCommandOptionGroupComponent,
    ZardCommandDividerComponent,
  ],
  template: `
    <div class="space-y-4">
      <z-command class="rounded-lg border shadow-md md:min-w-[500px]" (zOnSelect)="handleCommand($event)">
        <z-command-input placeholder="Search actions, files, and more..."></z-command-input>
        <z-command-list>
          <z-command-empty>No commands found.</z-command-empty>

          <z-command-option-group zLabel="Quick Actions">
            <z-command-option zLabel="Create new project" zValue="new-project" zIcon='<div class="icon-folder-plus"></div>' zShortcut="⌘N"> </z-command-option>
            <z-command-option zLabel="Open file" zValue="open-file" zIcon='<div class="icon-file-open"></div>' zShortcut="⌘O"> </z-command-option>
            <z-command-option zLabel="Save all" zValue="save-all" zIcon='<div class="icon-save"></div>' zShortcut="⌘S"> </z-command-option>
          </z-command-option-group>

          <z-command-divider></z-command-divider>

          <z-command-option-group zLabel="Navigation">
            <z-command-option zLabel="Go to Dashboard" zValue="dashboard" zIcon='<div class="icon-layout-dashboard"></div>' zShortcut="⌘1"> </z-command-option>
            <z-command-option zLabel="Go to Projects" zValue="projects" zIcon='<div class="icon-folder"></div>' zShortcut="⌘2"> </z-command-option>
          </z-command-option-group>

          <z-command-divider></z-command-divider>

          <z-command-option-group zLabel="Tools">
            <z-command-option zLabel="Open terminal" zValue="terminal" zIcon='<div class="icon-terminal"></div>' zShortcut="⌘T"> </z-command-option>
            <z-command-option zLabel="Toggle theme" zValue="theme" zIcon='<div class="icon-moon"></div>' zShortcut="⌘D"> </z-command-option>
          </z-command-option-group>
        </z-command-list>
      </z-command>
    </div>
  `,
})
export class ZardDemoCommandRealWorldComponent {
  // Handle command selection
  handleCommand(option: ZardCommandOption) {
    const action = `Executed "${option.label}" (value: ${option.value})`;
    console.log(action);

    // You can add real logic here
    switch (option.value) {
      case 'new-project':
        this.showAlert('Creating new project...');
        break;
      case 'open-file':
        this.showAlert('Opening file dialog...');
        break;
      case 'save-all':
        this.showAlert('Saving all files...');
        break;
      case 'dashboard':
        this.showAlert('Navigating to Dashboard...');
        break;
      case 'projects':
        this.showAlert('Navigating to Projects...');
        break;
      case 'terminal':
        this.showAlert('Opening terminal...');
        break;
      case 'theme':
        this.showAlert('Toggling theme...');
        break;
      default:
        this.showAlert(`Action: ${option.label}`);
    }
  }

  // Handle keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case 'n':
          event.preventDefault();
          this.executeCommand('new-project', 'Create new project');
          break;
        case 'o':
          event.preventDefault();
          this.executeCommand('open-file', 'Open file');
          break;
        case 's':
          event.preventDefault();
          this.executeCommand('save-all', 'Save all');
          break;
        case '1':
          event.preventDefault();
          this.executeCommand('dashboard', 'Go to Dashboard');
          break;
        case '2':
          event.preventDefault();
          this.executeCommand('projects', 'Go to Projects');
          break;
        case 't':
          event.preventDefault();
          this.executeCommand('terminal', 'Open terminal');
          break;
        case 'd':
          event.preventDefault();
          this.executeCommand('theme', 'Toggle theme');
          break;
      }
    }
  }

  private executeCommand(value: string, label: string) {
    this.handleCommand({ value, label } as ZardCommandOption);
  }

  private showAlert(message: string, isWarning = false) {
    if (isWarning) {
      console.warn(message);
    } else {
      console.log(message);
    }

    // In a real app, you might show a toast notification here
    setTimeout(() => {
      // You could clear the action after some time
    }, 3000);
  }
}
