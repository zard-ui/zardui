import { Component } from '@angular/core';
import { ZardCommandComponent, ZardCommandOptionComponent, ZardCommandOptionGroupComponent, ZardCommandDividerComponent } from '../index';

@Component({
  standalone: true,
  imports: [ZardCommandComponent, ZardCommandOptionComponent, ZardCommandOptionGroupComponent, ZardCommandDividerComponent],
  template: `
    <z-command>
      <z-command-option-group zLabel="Suggestions">
        <z-command-option zLabel="Calendar" zValue="calendar" zIcon="icon-calendar" zCommand="Open calendar" zShortcut="⌘K"> </z-command-option>
        <z-command-option zLabel="Search emoji" zValue="emoji" zIcon="icon-smile"> </z-command-option>
        <z-command-option zLabel="Calculator" zValue="calculator" zIcon="icon-calculator" [zDisabled]="true"> </z-command-option>
      </z-command-option-group>
      <z-command-divider></z-command-divider>
      <z-command-option-group zLabel="Settings">
        <z-command-option zLabel="Profile" zValue="profile" zIcon="icon-user"> </z-command-option>
        <z-command-option zLabel="Settings" zValue="settings" zIcon="icon-settings"> </z-command-option>
      </z-command-option-group>
    </z-command>
  `,
})
export class ZardDemoCommandDefaultComponent {}
