import { Component } from '@angular/core';

import type { ZardCommandOption } from '../command.component';
import { ZardCommandModule } from '../command.module';

@Component({
  selector: 'z-demo-command-default',
  imports: [ZardCommandModule],
  standalone: true,
  template: `
    <z-command class="md:min-w-[500px]" (zOnSelect)="handleCommand($event)">
      <z-command-input placeholder="Search actions, files, and more..." />
      <z-command-list>
        <z-command-empty>No commands found.</z-command-empty>

        <z-command-option-group zLabel="Quick Actions">
          <z-command-option zLabel="Create new project" zValue="new-project" zIcon="folder" zShortcut="⌘N" />
          <z-command-option zLabel="Open file" zValue="open-file" zIcon="folder-open" zShortcut="⌘O" />
          <z-command-option zLabel="Save all" zValue="save-all" zIcon="save" zShortcut="⌘S" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Navigation">
          <z-command-option zLabel="Go to Dashboard" zValue="dashboard" zIcon="layout-dashboard" zShortcut="⌘1" />
          <z-command-option zLabel="Go to Projects" zValue="projects" zIcon="folder" zShortcut="⌘2" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Tools">
          <z-command-option zLabel="Open terminal" zValue="terminal" zIcon="terminal" zShortcut="⌘T" />
          <z-command-option zLabel="Toggle theme" zValue="theme" zIcon="moon" zShortcut="⌘D" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  host: {
    '(window:keydown)': 'handleKeydown($event)',
  },
})
export class ZardDemoCommandDefaultComponent {
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
  handleKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey) {
      if ('nos12td'.includes(event.key.toLowerCase())) {
        event.preventDefault();
      }

      switch (event.key.toLowerCase()) {
        case 'n':
          this.executeCommand('new-project', 'Create new project');
          break;
        case 'o':
          this.executeCommand('open-file', 'Open file');
          break;
        case 's':
          this.executeCommand('save-all', 'Save all');
          break;
        case '1':
          this.executeCommand('dashboard', 'Go to Dashboard');
          break;
        case '2':
          this.executeCommand('projects', 'Go to Projects');
          break;
        case 't':
          this.executeCommand('terminal', 'Open terminal');
          break;
        case 'd':
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
