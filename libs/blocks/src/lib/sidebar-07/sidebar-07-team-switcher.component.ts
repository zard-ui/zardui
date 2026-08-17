import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAudioWaveform,
  lucideChevronsUpDown,
  lucideCommand,
  lucideGalleryVerticalEnd,
  lucidePlus,
} from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar07Team {
  readonly name: string;
  readonly logo: string;
  readonly plan: string;
}

@Component({
  selector: 'lib-sidebar-07-team-switcher',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [
    provideIcons({ lucideAudioWaveform, lucideChevronsUpDown, lucideCommand, lucideGalleryVerticalEnd, lucidePlus }),
  ],
  templateUrl: './sidebar-07-team-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar07TeamSwitcherComponent {
  readonly teams = input<readonly Sidebar07Team[]>([]);

  protected readonly selectedTeam = signal<Sidebar07Team | null>(null);

  protected activeTeam(): Sidebar07Team | undefined {
    return this.selectedTeam() ?? this.teams()[0];
  }
}
