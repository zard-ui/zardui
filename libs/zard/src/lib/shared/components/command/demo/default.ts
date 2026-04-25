import { Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import {
  lucideCalculator,
  lucideCalendar,
  lucideCreditCard,
  lucideSettings,
  lucideSmile,
  lucideUser,
} from '@ng-icons/lucide';

import { ZardCommandImports } from '@/shared/components/command/command.imports';

@Component({
  selector: 'z-demo-command-default',
  imports: [ZardCommandImports],
  template: `
    <z-command class="min-w-sm" #cmd="zCommand">
      <z-command-input placeholder="Type a command or search..." />
      <z-command-list>
        @if (cmd.isEmpty()) {
          <div class="py-6 text-center text-sm">No results found.</div>
        }

        <z-command-option-group zLabel="Suggestions">
          <z-command-option zLabel="Calendar" zValue="calendar" zIcon="lucideCalendar" />
          <z-command-option zLabel="Search Emoji" zValue="emoji" zIcon="lucideSmile" />
          <z-command-option zLabel="Calculator" zValue="calculator" zIcon="lucideCalculator" [zDisabled]="true" />
        </z-command-option-group>

        <z-command-divider />

        <z-command-option-group zLabel="Settings">
          <z-command-option zLabel="Profile" zValue="profile" zIcon="lucideUser" zShortcut="⌘P" />
          <z-command-option zLabel="Billing" zValue="billing" zIcon="lucideCreditCard" zShortcut="⌘B" />
          <z-command-option zLabel="Settings" zValue="settings" zIcon="lucideSettings" zShortcut="⌘S" />
        </z-command-option-group>
      </z-command-list>
    </z-command>
  `,
  viewProviders: [
    provideIcons({
      lucideCalendar,
      lucideSmile,
      lucideCalculator,
      lucideUser,
      lucideCreditCard,
      lucideSettings,
    }),
  ],
})
export class ZardDemoCommandDefaultComponent {}
