import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioWaveform, lucideChevronDown, lucideCommand, lucidePlus } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar10Team {
  readonly name: string;
  readonly logo: string;
  readonly plan: string;
}

@Component({
  selector: 'lib-sidebar-10-team-switcher',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideAudioWaveform, lucideChevronDown, lucideCommand, lucidePlus })],
  templateUrl: './sidebar-10-team-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar10TeamSwitcherComponent {
  readonly teams = input<readonly Sidebar10Team[]>([]);

  protected readonly selectedTeam = signal<Sidebar10Team | null>(null);

  protected activeTeam(): Sidebar10Team | undefined {
    return this.selectedTeam() ?? this.teams()[0];
  }
}
