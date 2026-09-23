import { Component, inject, signal, viewChild } from '@angular/core';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';
import { ZardContextMenuService } from '@/shared/components/context-menu/context-menu.service';
import { type ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface FileRow {
  id: number;
  name: string;
  size: string;
  pinned: boolean;
}

@Component({
  selector: 'z-context-menu-table-rows-demo',
  imports: [ZardContextMenuImports, ZardTableImports],
  template: `
    <div class="w-full max-w-md">
      <table z-table>
        <thead z-table-header>
          <tr z-table-row>
            <th z-table-head>Name</th>
            <th z-table-head class="text-right">Size</th>
          </tr>
        </thead>
        <tbody z-table-body>
          @for (row of rows(); track row.id) {
            <tr z-table-row class="cursor-context-menu" (contextmenu)="openMenu($event, row)">
              <td z-table-cell>
                {{ row.name }}
                @if (row.pinned) {
                  <span class="text-muted-foreground ml-2 text-xs">pinned</span>
                }
              </td>
              <td z-table-cell class="text-right">{{ row.size }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="text-muted-foreground mt-3 text-sm">Right click a row.</p>
    </div>

    <z-dropdown-menu-content #rowMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-label>{{ selected()?.name }}</z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item (click)="rename()">Rename</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="duplicate()">Duplicate</z-dropdown-menu-item>
      <z-dropdown-menu-checkbox-item [zChecked]="selected()?.pinned ?? false" (zCheckedChange)="togglePin()">
        Pin row
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zType="destructive" (click)="remove()">Delete</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  host: { class: 'contents' },
})
export class ZardContextMenuTableRowsDemoComponent {
  private readonly contextMenu = inject(ZardContextMenuService);
  private readonly rowMenu = viewChild.required<ZardDropdownMenuContentComponent>('rowMenu');

  readonly rows = signal<FileRow[]>([
    { id: 1, name: 'invoice-2024.pdf', size: '120 KB', pinned: false },
    { id: 2, name: 'roadmap.md', size: '8 KB', pinned: true },
    { id: 3, name: 'logo.svg', size: '2 KB', pinned: false },
  ]);

  readonly selected = signal<FileRow | undefined>(undefined);

  openMenu(event: MouseEvent, row: FileRow) {
    event.preventDefault();
    this.selected.set(row);
    this.contextMenu.create(event, this.rowMenu());
  }

  rename() {
    console.log('rename', this.selected()?.name);
  }

  duplicate() {
    console.log('duplicate', this.selected()?.name);
  }

  togglePin() {
    const target = this.selected();
    if (!target) {
      return;
    }

    this.rows.update(rows => rows.map(row => (row.id === target.id ? { ...row, pinned: !row.pinned } : row)));
    this.selected.update(row => (row ? { ...row, pinned: !row.pinned } : row));
  }

  remove() {
    const target = this.selected();
    if (!target) {
      return;
    }

    this.rows.update(rows => rows.filter(row => row.id !== target.id));
  }
}
