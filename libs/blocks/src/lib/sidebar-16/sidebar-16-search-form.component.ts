import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';

@Component({
  selector: 'lib-sidebar-16-search-form',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardFieldImports, ZardInputComponent, NgIcon],
  viewProviders: [provideIcons({ lucideSearch })],
  templateUrl: './sidebar-16-search-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar16SearchFormComponent {
  readonly class = input<string>('');
}
