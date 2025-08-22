import { ClassValue } from 'class-variance-authority/dist/types';

import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, input, QueryList, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardMenuItemDirective } from './menu-item.directive';
import { menuVariants, ZardMenuVariants } from './menu.variants';
import { ZardSubmenuComponent } from './submenu.component';

@Component({
  selector: 'ul[z-menu]',
  exportAs: 'zMenu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul [class]="classes()" role="menu" [attr.data-mode]="zMode()" [attr.data-theme]="zTheme()">
      <ng-content></ng-content>
    </ul>
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-collapsed]': 'zInlineCollapsed()',
  },
})
export class ZardMenuComponent implements AfterContentInit {
  @ContentChildren(ZardMenuItemDirective, { descendants: true }) private menuItems!: QueryList<ZardMenuItemDirective>;
  @ContentChildren(ZardSubmenuComponent, { descendants: true }) private submenus!: QueryList<ZardSubmenuComponent>;

  readonly zMode = input<ZardMenuVariants['zMode']>('vertical');
  readonly zTheme = input<ZardMenuVariants['zTheme']>('light');
  readonly zInlineCollapsed = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();
    return mergeClasses(
      menuVariants({
        zMode: mode,
        zTheme: this.zTheme(),
        zCollapsed: this.zInlineCollapsed(),
      }),
      this.class(),
    );
  });

  protected readonly hostClasses = computed(() => {
    return mergeClasses('z-menu-wrapper', this.zInlineCollapsed() ? 'z-menu-collapsed' : '');
  });

  ngAfterContentInit() {
    this.updateComponentModes();
    this.menuItems.changes.subscribe(() => this.updateComponentModes());
    this.submenus.changes.subscribe(() => this.updateComponentModes());
  }

  private updateComponentModes() {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();

    // Set mode for top-level menu items only
    // Items inside submenus will be handled by their submenu component
    this.menuItems.forEach(item => {
      item.setMode(mode);
    });

    // Set mode for submenus - they will handle their content items internally
    this.submenus.forEach(submenu => {
      submenu.setMode(mode);
      submenu.setCollapsed(this.zInlineCollapsed());
    });
  }
}
