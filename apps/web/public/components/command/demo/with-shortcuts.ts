import { Component } from '@angular/core';

import { ZardCommandDividerComponent } from '../command-divider.component';
import { ZardCommandOptionGroupComponent } from '../command-option-group.component';
import { ZardCommandOptionComponent } from '../command-option.component';
import { ZardCommandComponent } from '../command.component';

@Component({
  standalone: true,
  imports: [ZardCommandComponent, ZardCommandOptionComponent, ZardCommandOptionGroupComponent, ZardCommandDividerComponent],
  template: `
    <z-command zPlaceholder="Type a command or search...">
      <z-command-option-group zLabel="Actions">
        <z-command-option zLabel="Copy" zValue="copy" zIcon="📋" zCommand="copy" zShortcut="⌘C"> </z-command-option>
        <z-command-option zLabel="Cut" zValue="cut" zIcon="✂️" zCommand="cut" zShortcut="⌘X"> </z-command-option>
        <z-command-option zLabel="Paste" zValue="paste" zIcon="📄" zCommand="paste" zShortcut="⌘V"> </z-command-option>
      </z-command-option-group>

      <z-command-divider></z-command-divider>

      <z-command-option-group zLabel="Navigation">
        <z-command-option zLabel="Go to File" zValue="goto-file" zIcon="📁" zShortcut="⌘⇧O"> </z-command-option>
        <z-command-option zLabel="Find in Files" zValue="find-files" zIcon="🔍" zShortcut="⌘⇧F"> </z-command-option>
        <z-command-option zLabel="Command Palette" zValue="command-palette" zIcon="⌨️" zShortcut="⌘⇧P"> </z-command-option>
      </z-command-option-group>
    </z-command>
  `,
})
export class ZardDemoCommandWithShortcutsComponent {}
