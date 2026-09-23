import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronsUpDown, lucideGalleryVerticalEnd } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-sidebar-02-version-switcher',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [provideIcons({ lucideCheck, lucideChevronsUpDown, lucideGalleryVerticalEnd })],
  templateUrl: './sidebar-02-version-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar02VersionSwitcherComponent {
  readonly versions = input<readonly string[]>([]);
  readonly defaultVersion = input<string>('');

  protected readonly selectedVersion = signal<string | null>(null);

  protected readonly activeVersion = () => this.selectedVersion() ?? this.defaultVersion();
}
