import { AfterViewInit, Component, effect, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { type IconName, NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCircleDashed, lucideCornerDownLeft } from '@ng-icons/lucide';

import { COLOR_PALETTES } from '@doc/shared/constants/colors.constant';
import { HEADER_PATHS, SIDEBAR_PATHS } from '@doc/shared/constants/routes.constant';

import { ZardCommandImports } from '@zard/components/command';
import { ZardCommandComponent, type ZardCommandOption } from '@zard/components/command/command.component';
import { ZardDialogRef } from '@zard/components/dialog/dialog-ref';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardKbdComponent } from '@zard/components/kbd/kbd.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

type CommandKind = 'page' | 'component' | 'color';

type CommandItem = {
  name: string;
  kind: CommandKind;
  value: string;
  icon?: IconName;
  swatch?: string;
  shortcut: string;
  copyPayload: string;
};

type CommandGroup = {
  title: string;
  items: CommandItem[];
};

const NAVIGATE_PREFIX = 'navigate:';
const COPY_OKLCH_PREFIX = 'copy-oklch:';

@Component({
  imports: [ZardCommandImports, ZardEmptyComponent, ZardKbdComponent, ZardSeparatorComponent, NgIcon],
  template: `
    <div
      class="bg-popover text-popover-foreground relative w-full rounded-xl p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:ring-neutral-800"
    >
      <z-command
        #commandRef
        class="**:data-[slot=command-item]:data-selected:border-input **:data-[slot=command-item]:data-selected:bg-input/50 **:data-[slot=command-item]:data-selected:text-foreground rounded-none border-0 bg-transparent p-0 shadow-none **:data-[slot=command-input-wrapper]:m-0 **:data-[slot=command-input-wrapper]:p-0 **:data-[slot=command-item]:h-9 **:data-[slot=command-item]:rounded-md **:data-[slot=command-item]:border **:data-[slot=command-item]:border-transparent **:data-[slot=command-item]:bg-transparent **:data-[slot=command-item]:px-3 **:data-[slot=command-item]:py-0 **:data-[slot=command-item]:text-sm **:data-[slot=command-item]:font-medium"
        (zCommandSelected)="handleCommand($event)"
      >
        <z-command-input
          placeholder="Search documentation..."
          class="**:data-[slot=input-group]:border-input! **:data-[slot=input-group]:bg-input/50! **:data-[slot=input-group]:h-9"
        />
        <z-command-list class="no-scrollbar scroll-pt-2 scroll-pb-1.5">
          @if (commandRef.isEmpty()) {
            <z-empty zTitle="No results found." class="py-6" />
          }

          @for (group of groups; track group.title; let last = $last) {
            <z-command-option-group [zLabel]="group.title">
              @for (item of group.items; track item.value) {
                <z-command-option
                  [zLabel]="item.name"
                  [zValue]="item.value"
                  [zIcon]="item.icon"
                  [zShortcut]="item.shortcut"
                >
                  @if (item.swatch) {
                    <span
                      data-slot="command-option-leading"
                      class="border-border block size-4 shrink-0 rounded-sm border"
                      [style.background]="item.swatch"
                    ></span>
                  }
                </z-command-option>
              }
            </z-command-option-group>
            @if (!last) {
              <z-command-divider />
            }
          }
        </z-command-list>
      </z-command>

      <div
        class="border-border bg-muted/50 text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t px-4 text-xs font-medium"
      >
        <div class="flex items-center gap-2">
          <z-kbd class="bg-background">
            <ng-icon name="lucideCornerDownLeft" />
          </z-kbd>
          @if (selectedKind() === 'page' || selectedKind() === 'component') {
            <span>Go to Page</span>
          } @else if (selectedKind() === 'color') {
            <span>Copy OKLCH</span>
          }
        </div>
        @if (copyPayload()) {
          <z-separator zOrientation="vertical" class="h-4!" />
          <div class="flex items-center gap-1">
            <z-kbd class="bg-background">⌘</z-kbd>
            <z-kbd class="bg-background">C</z-kbd>
            <span class="ml-1 font-mono">{{ copyPayload() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  viewProviders: [provideIcons({ lucideArrowRight, lucideCircleDashed, lucideCornerDownLeft })],
})
export class CommandDocComponent implements AfterViewInit, OnDestroy {
  readonly commandComponent = viewChild<ZardCommandComponent>('commandRef');
  private router = inject(Router);
  private dialogRef = inject(ZardDialogRef);
  private keydownListener?: (event: KeyboardEvent) => void;

  private readonly pagesGroup: CommandGroup = {
    title: 'Pages',
    items: HEADER_PATHS.filter(item => item.available).map<CommandItem>(item => ({
      name: item.name,
      kind: 'page',
      value: `${NAVIGATE_PREFIX}${item.path}`,
      icon: 'lucideArrowRight' as IconName,
      shortcut: '',
      copyPayload: '',
    })),
  };

  private readonly treeGroups: CommandGroup[] = SIDEBAR_PATHS.map(section => ({
    title: section.title,
    items: section.data
      .filter(item => item.available)
      .map<CommandItem>(item => {
        const isComponent = item.path.includes('/components/');
        const name = item.path.split('/').pop() ?? '';
        return {
          name: item.name,
          kind: isComponent ? 'component' : 'page',
          value: `${NAVIGATE_PREFIX}${item.path}`,
          icon: (isComponent ? 'lucideCircleDashed' : 'lucideArrowRight') as IconName,
          shortcut: '',
          copyPayload: isComponent ? `npx zard-cli add ${name}` : '',
        };
      }),
  })).filter(group => group.items.length > 0);

  private readonly colorGroups: CommandGroup[] = COLOR_PALETTES.map(palette => ({
    title: palette.name.charAt(0).toUpperCase() + palette.name.slice(1),
    items: palette.colors.map<CommandItem>(color => ({
      name: color.className,
      kind: 'color',
      value: `${COPY_OKLCH_PREFIX}${color.oklch}`,
      swatch: color.oklch,
      shortcut: color.oklch,
      copyPayload: color.className,
    })),
  }));

  readonly groups: CommandGroup[] = [this.pagesGroup, ...this.treeGroups, ...this.colorGroups];

  private readonly itemByValue = new Map(this.groups.flatMap(group => group.items.map(item => [item.value, item])));

  readonly selectedKind = signal<CommandKind | null>(null);
  readonly copyPayload = signal('');

  constructor() {
    effect(() => {
      const cmd = this.commandComponent();
      if (!cmd) {
        return;
      }

      const highlighted = cmd.filteredOptions().find(option => option.isSelected());
      if (!highlighted) {
        this.selectedKind.set(null);
        this.copyPayload.set('');
        return;
      }

      const value = String(highlighted.zValue());
      const item = this.itemByValue.get(value);
      if (!item) {
        this.selectedKind.set(null);
        this.copyPayload.set('');
        return;
      }

      this.selectedKind.set(item.kind);
      this.copyPayload.set(item.copyPayload);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.commandComponent()?.focus();
    }, 0);

    this.keydownListener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.dialogRef.close();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c' && this.copyPayload()) {
        event.preventDefault();
        navigator.clipboard?.writeText(this.copyPayload());
      }
    };
    document.addEventListener('keydown', this.keydownListener);
  }

  ngOnDestroy() {
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
    }
  }

  handleCommand(option: ZardCommandOption) {
    const value = option.value as string;

    if (value.startsWith(NAVIGATE_PREFIX)) {
      const path = value.slice(NAVIGATE_PREFIX.length);
      this.router.navigate([path]);
      this.dialogRef.close();
      return;
    }

    if (value.startsWith(COPY_OKLCH_PREFIX)) {
      const oklch = value.slice(COPY_OKLCH_PREFIX.length);
      navigator.clipboard?.writeText(oklch);
      this.dialogRef.close();
    }
  }
}
