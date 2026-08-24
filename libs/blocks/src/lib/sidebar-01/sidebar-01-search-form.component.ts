import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-sidebar-01-search-form',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardFieldImports, ZardInputComponent, NgIcon],
  viewProviders: [provideIcons({ lucideSearch })],
  templateUrl: './sidebar-01-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar01SearchFormComponent {}
