import { Component, signal } from '@angular/core';

import { ZardCommandJsonComponent } from '../command-json.component';
import { ZardCommandConfig } from '../command.component';

@Component({
  standalone: true,
  imports: [ZardCommandJsonComponent],
  template: `
    <div class="space-y-4">
      <z-command-json [config]="commandConfig" class="md:min-w-[500px]"></z-command-json>
    </div>
  `,
})
export class ZardDemoCommandJsonComponent {
  readonly lastAction = signal<string>('');

  readonly commandConfig: ZardCommandConfig = {
    placeholder: 'Search commands...',
    emptyText: 'No results found.',
    dividers: true,
    onSelect: option => {
      console.log(`Global handler: ${option.label}`);
    },
    groups: [
      {
        label: 'File Actions',
        options: [
          {
            label: 'New File',
            value: 'new',
            icon: '<div class="icon-file-plus"></div>',
            shortcut: '⌘N',
            key: 'n', // Keyboard shortcut key
            action: () => {
              this.lastAction.set('Creating new file...');
              this.showNotification('📄 New file created!');
            },
          },
          {
            label: 'Open File',
            value: 'open',
            icon: '<div class="icon-folder-open"></div>',
            shortcut: '⌘O',
            key: 'o',
            action: () => {
              this.lastAction.set('Opening file dialog...');
              this.showNotification('📂 File dialog opened!');
            },
          },
          {
            label: 'Save File',
            value: 'save',
            icon: '<div class="icon-save"></div>',
            shortcut: '⌘S',
            key: 's',
            action: () => {
              this.lastAction.set('Saving file...');
              this.showNotification('💾 File saved!');
            },
          },
        ],
      },
      {
        label: 'Tools',
        options: [
          {
            label: 'Open Terminal',
            value: 'terminal',
            icon: '<div class="icon-terminal"></div>',
            shortcut: '⌘T',
            key: 't',
            action: () => {
              this.lastAction.set('Opening terminal...');
              this.showNotification('💻 Terminal opened!');
            },
          },
          {
            label: 'Settings',
            value: 'settings',
            icon: '<div class="icon-settings"></div>',
            action: () => {
              this.lastAction.set('Opening settings...');
              this.showNotification('⚙️ Settings opened!');
            },
          },
        ],
      },
    ],
  };

  readonly configJson = JSON.stringify(this.commandConfig, null, 2);

  private showNotification(message: string) {
    console.log(`🔔 ${message}`);
  }
}
