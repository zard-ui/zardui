import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioWaveform, lucideChevronDown, lucideCommand, lucidePlus } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

export interface Sidebar15Team {
  readonly name: string;
  readonly logo: string;
  readonly plan: string;
}

@Component({
  selector: 'lib-sidebar-15-team-switcher',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideAudioWaveform, lucideChevronDown, lucideCommand, lucidePlus })],
  templateUrl: './sidebar-15-team-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar15TeamSwitcherComponent {
  readonly teams = input<readonly Sidebar15Team[]>([]);

  protected readonly selectedTeam = signal<Sidebar15Team | null>(null);

  protected activeTeam(): Sidebar15Team | undefined {
    return this.selectedTeam() ?? this.teams()[0];
  }
}
