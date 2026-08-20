import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDatabase,
  lucideEllipsis,
  lucideFileText,
  lucideFolder,
  lucideShare2,
  lucideClipboardList,
  lucideTrash2,
} from '@ng-icons/lucide';

import type { ZardDropdownAlign, ZardDropdownSide } from '@zard/components/dropdown/dropdown-positions';
import { ZardDropdownImports } from '@zard/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@zard/components/sidebar/sidebar.imports';
import { ZardSidebarService } from '@zard/components/sidebar/sidebar.service';

export interface Dashboard01Document {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

@Component({
  selector: 'lib-dashboard-01-nav-documents',
  standalone: true,
  imports: [...ZardSidebarImports, ...ZardDropdownImports, NgIcon],
  viewProviders: [
    provideIcons({
      lucideClipboardList,
      lucideDatabase,
      lucideEllipsis,
      lucideFileText,
      lucideFolder,
      lucideShare2,
      lucideTrash2,
    }),
  ],
  templateUrl: './dashboard-01-nav-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class Dashboard01NavDocumentsComponent {
  private readonly sidebar = inject(ZardSidebarService);
  /** shadcn opens these menus to the side of the sidebar on desktop and below the trigger on mobile. */
  protected readonly menuSide = computed<ZardDropdownSide>(() => (this.sidebar.isMobile() ? 'bottom' : 'right'));
  protected readonly menuAlign = computed<ZardDropdownAlign>(() => (this.sidebar.isMobile() ? 'end' : 'start'));

  readonly items = input<readonly Dashboard01Document[]>([]);
}
