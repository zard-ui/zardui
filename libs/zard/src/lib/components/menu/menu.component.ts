import { ClassValue } from 'class-variance-authority/dist/types';

import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChildren, input, output, QueryList, signal, ViewEncapsulation } from '@angular/core';

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
  @ContentChildren(ZardMenuItemDirective, { descendants: true }) menuItems!: QueryList<ZardMenuItemDirective>;
  @ContentChildren(ZardSubmenuComponent, { descendants: true }) submenus!: QueryList<ZardSubmenuComponent>;

  readonly zMode = input<ZardMenuVariants['zMode']>('vertical');
  readonly zTheme = input<ZardMenuVariants['zTheme']>('light');
  readonly zInlineCollapsed = input<boolean>(false);
  readonly zSelectable = input<boolean>(true);
  readonly zOpenKeys = input<string[]>([]);
  readonly zSelectedKeys = input<string[]>([]);

  readonly class = input<ClassValue>('');

  readonly zOpenChange = output<string[]>();
  readonly zSelectionChange = output<string[]>();
  readonly zItemClick = output<{ key: string; item: HTMLElement }>();

  readonly openKeys = signal<Set<string>>(new Set());
  readonly selectedKeys = signal<Set<string>>(new Set());

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
    this.initializeKeys();
    this.setupItemHandlers();
    this.setupSubmenuHandlers();
    this.updateSubmenuModes();
  }

  private initializeKeys() {
    this.openKeys.set(new Set(this.zOpenKeys()));
    this.selectedKeys.set(new Set(this.zSelectedKeys()));
  }

  private setupItemHandlers() {
    this.menuItems.changes.subscribe(() => this.bindItemEvents());
    this.bindItemEvents();
  }

  private setupSubmenuHandlers() {
    this.submenus.changes.subscribe(() => this.bindSubmenuEvents());
    this.bindSubmenuEvents();
  }

  private bindItemEvents() {
    this.menuItems.forEach(item => {
      item.itemClick.subscribe((data: { key: string; item: HTMLElement }) => {
        if (this.zSelectable() && !item.zDisabled()) {
          this.handleItemSelection(data.key);
          this.zItemClick.emit(data);
        }
      });
    });
  }

  private bindSubmenuEvents() {
    this.submenus.forEach(submenu => {
      submenu.zOpenChange.subscribe((open: boolean) => {
        this.handleSubmenuToggle(submenu.zKey(), open);
      });
    });
  }

  private handleItemSelection(key: string) {
    const keys = new Set(this.selectedKeys());

    if (this.zMode() === 'inline' || this.zMode() === 'vertical') {
      keys.clear();
      keys.add(key);
    } else {
      if (keys.has(key)) {
        keys.delete(key);
      } else {
        keys.add(key);
      }
    }

    this.selectedKeys.set(keys);
    this.zSelectionChange.emit(Array.from(keys));
    this.updateItemStates();
  }

  private handleSubmenuToggle(key: string, open: boolean) {
    const keys = new Set(this.openKeys());

    if (open) {
      if (this.zMode() === 'inline') {
        keys.add(key);
      } else {
        keys.clear();
        keys.add(key);
      }
    } else {
      keys.delete(key);
    }

    this.openKeys.set(keys);
    this.zOpenChange.emit(Array.from(keys));
    this.updateSubmenuStates();
  }

  private updateItemStates() {
    const selected = this.selectedKeys();
    this.menuItems.forEach(item => {
      item.setSelected(selected.has(item.zKey()));
    });
  }

  private updateSubmenuStates() {
    const open = this.openKeys();
    this.submenus.forEach(submenu => {
      submenu.setOpen(open.has(submenu.zKey()));
    });
  }

  private updateSubmenuModes() {
    const mode = this.zInlineCollapsed() && this.zMode() === 'inline' ? 'vertical' : this.zMode();
    this.submenus.forEach(submenu => {
      submenu.setMode(mode);
      submenu.setCollapsed(this.zInlineCollapsed());
    });
  }

  isItemSelected(key: string): boolean {
    return this.selectedKeys().has(key);
  }

  isSubmenuOpen(key: string): boolean {
    return this.openKeys().has(key);
  }
}
