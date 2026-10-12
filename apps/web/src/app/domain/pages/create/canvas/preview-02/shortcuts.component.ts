import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardKbdComponent } from '@zard/components/kbd/kbd.component';

const SHORTCUTS = [
  { label: 'Search', keys: ['⌘', 'K'] },
  { label: 'Quick Actions', keys: ['⌘', 'J'] },
  { label: 'New File', keys: ['⌘', 'N'] },
  { label: 'Save', keys: ['⌘', 'S'] },
  { label: 'Toggle Sidebar', keys: ['⌘', 'B'] },
] as const;

@Component({
  selector: 'z-preview-02-shortcuts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardKbdComponent],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <div class="flex flex-col gap-3">
          <div class="text-sm font-medium">Shortcuts</div>
          <div z-item-group class="text-muted-foreground gap-2" data-size="xs">
            @for (shortcut of shortcuts; track shortcut.label; let first = $first) {
              @if (!first) {
                <div z-item-separator></div>
              }
              <div z-item zVariant="default" zSize="xs" class="border-0 px-0 py-0">
                <div z-item-header>
                  <div z-item-title class="font-normal">{{ shortcut.label }}</div>
                  <div z-item-actions>
                    <div class="flex gap-1">
                      @for (key of shortcut.keys; track key) {
                        <z-kbd>{{ key }}</z-kbd>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02ShortcutsComponent {
  protected readonly shortcuts = SHORTCUTS;
}
