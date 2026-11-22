---
title: November 2026 - Data Table, Map and AI Elements
description: Our biggest month for new components yet. We added Data Table, Color Picker, Menubar, Native Select and Questionnaire, plus Code Block, Message Scroller and Trace for chat and agent interfaces, an interactive Map, and the AI Elements patterns built on top of them.
---

# November 2026 - Data Table, Map and AI Elements

Our biggest month for new components yet. We added Data Table, Color Picker, Menubar, Native Select and Questionnaire, plus Code Block, Message Scroller and Trace for chat and agent interfaces, an interactive Map, and the AI Elements patterns built on top of them.

## AI Elements

A new docs section with 21 ready-made patterns for chat and agent interfaces, such as reasoning, tool calls, plans, sources and the prompt input. Each one is composed from Zard components and lists the ones it needs.

## Map

An interactive MapLibre map with markers, popups, routes, clusters and heatmaps, whose basemap follows your light or dark theme. It needs a short setup for the MapLibre assets, covered on its page.

```
npx zard-cli@latest add map
```

## New Components

### [Data Table](/docs/components/data-table)

A table built on TanStack Table that sorts, filters, paginates and selects rows, with ready-made column header, pagination and view-options parts.

```
npx zard-cli@latest add data-table
```

```
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { createColumnHelper, flexRenderComponent, injectTable } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';
import { SelectAllRowsComponent, SelectRowComponent } from './row-selection';
import { PaymentEmailHeaderComponent } from './sorting';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: () => flexRenderComponent(SelectAllRowsComponent),
    cell: () => flexRenderComponent(SelectRowComponent),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('status', { header: 'Status', meta: { cellClass: 'capitalize' } }),
  columnHelper.accessor('email', {
    header: () => flexRenderComponent(PaymentEmailHeaderComponent),
    meta: { cellClass: 'lowercase' },
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => flexRenderComponent(PaymentActionsComponent),
    enableHiding: false,
  }),
]);

@Component({
  selector: 'z-demo-data-table-preview',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        Columns
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-muted-foreground flex-1 text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s)
        selected.
      </div>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTablePreviewComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

### [Color Picker](/docs/components/color-picker)

Pick a color in several formats, with optional alpha and presets, and bind it to Angular forms.

```
npx zard-cli@latest add color-picker
```

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardColorPickerComponent } from '../color-picker.component';

@Component({
  selector: 'z-demo-color-picker-preview',
  imports: [ZardColorPickerComponent],
  template: `
    <z-color-picker class="mx-auto" zShowValue [(value)]="color" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerPreviewComponent {
  readonly color = signal<string | null>('#2563eb');
}
```

### [Menubar](/docs/components/menubar)

A desktop-style menu bar with checkbox items, radio items and submenus.

```
npx zard-cli@latest add menubar
```

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';

@Component({
  selector: 'z-demo-menubar-preview',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar class="w-72">
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">File</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">Edit</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">View</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">Profiles</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent">
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>
          New Tab
          <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          New Window
          <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item zDisabled>New Incognito Window</z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">Share</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent">
        <z-dropdown-menu-item>Email link</z-dropdown-menu-item>
        <z-dropdown-menu-item>Messages</z-dropdown-menu-item>
        <z-dropdown-menu-item>Notes</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        Print...
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent">
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>
          Undo
          <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          Redo
          <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="findMenu">Find</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #findMenu="zDropdownMenuSubContent">
        <z-dropdown-menu-item>Search the web</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>Find...</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Next</z-dropdown-menu-item>
        <z-dropdown-menu-item>Find Previous</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-item>Cut</z-dropdown-menu-item>
        <z-dropdown-menu-item>Copy</z-dropdown-menu-item>
        <z-dropdown-menu-item>Paste</z-dropdown-menu-item>
      </z-dropdown-menu-group>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-group>
        <z-dropdown-menu-checkbox-item [(zChecked)]="bookmarksBar">Bookmarks Bar</z-dropdown-menu-checkbox-item>
        <z-dropdown-menu-checkbox-item [(zChecked)]="fullUrls">Full URLs</z-dropdown-menu-checkbox-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-group>
        <z-dropdown-menu-item zInset>
          Reload
          <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item zInset zDisabled>
          Force Reload
          <z-dropdown-menu-shortcut>⇧⌘R</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Toggle Fullscreen</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Hide Sidebar</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">Andy</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">Benoit</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">Luis</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Edit...</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item zInset>Add Profile...</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarPreviewComponent {
  protected readonly bookmarksBar = signal(false);
  protected readonly fullUrls = signal(true);
  protected readonly profile = signal('benoit');
}
```

### [Native Select](/docs/components/native-select)

Style the browser's own select element, with sizes, option groups and invalid states.

```
npx zard-cli@latest add native-select
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardNativeSelectDirective } from '@/shared/components/native-select/native-select.directive';

@Component({
  selector: 'z-demo-native-select-preview',
  imports: [ZardNativeSelectDirective, ...ZardFieldImports],
  template: `
    <div z-field class="w-64">
      <label z-field-label for="native-select-status">Status</label>
      <select z-native-select id="native-select-status">
        <option value="" disabled selected>Select status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In progress</option>
        <option value="done">Done</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNativeSelectPreviewComponent {}
```

### [Questionnaire](/docs/components/questionnaire)

A multi-step form that asks one question at a time, with choices, free-text answers, progress, validation and keyboard shortcuts.

```
npx zard-cli@latest add questionnaire
```

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

import { ZardQuestionnaireImports } from '../questionnaire.imports';
import type { ZardQuestionnaireAnswer, ZardQuestionnaireAnswers, ZardQuestionnaireItem } from '../questionnaire.types';

const DIRECTION_LABELS: Record<string, string> = {
  'tool-calls': 'tool call timeline',
  approvals: 'approval checkpoints',
  handoffs: 'sub-agent handoffs',
};

const UPDATE_LABELS: Record<string, string> = {
  progress: 'progress',
  decisions: 'decisions',
  risks: 'risks',
  'next-step': 'next step',
};

const TIMING_LABELS: Record<string, string> = {
  now: 'now',
  'next-cycle': 'next development cycle',
  backlog: 'backlog',
};

@Component({
  selector: 'z-demo-questionnaire-default',
  imports: [ZardQuestionnaireImports],
  template: `
    <z-questionnaire [zItems]="items" zShortcuts="letters" (zSubmit)="save($event)">
      <z-questionnaire-progress />

      <z-questionnaire-item zName="goal" zRequired>
        <z-questionnaire-title>What should the agent build next?</z-questionnaire-title>
        <z-questionnaire-description>Choose a direction or describe another task.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="tool-calls">
            <span class="font-medium">Tool call timeline</span>
            <z-questionnaire-choice-description>
              Show what the agent ran and what came back.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="approvals">
            <span class="font-medium">Approval checkpoints</span>
            <z-questionnaire-choice-description>
              Ask before sensitive or destructive actions.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-choice zValue="handoffs">
            <span class="font-medium">Sub-agent handoffs</span>
            <z-questionnaire-choice-description>
              Make delegated work and results easier to follow.
            </z-questionnaire-choice-description>
          </z-questionnaire-choice>
          <z-questionnaire-input placeholder="Describe another feature..." aria-label="Describe another feature" />
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="updates" zMultiple>
        <z-questionnaire-title>What should every progress update include?</z-questionnaire-title>
        <z-questionnaire-description>Select all that apply, or skip this question.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="progress">Progress made</z-questionnaire-choice>
          <z-questionnaire-choice zValue="decisions">Decisions taken</z-questionnaire-choice>
          <z-questionnaire-choice zValue="risks">Risks or blockers</z-questionnaire-choice>
          <z-questionnaire-choice zValue="next-step">Next step</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-item zName="start" zRequired>
        <z-questionnaire-title>When should work begin?</z-questionnaire-title>
        <z-questionnaire-description>Choose one option.</z-questionnaire-description>
        <z-questionnaire-choices>
          <z-questionnaire-choice zValue="now">Start now</z-questionnaire-choice>
          <z-questionnaire-choice zValue="next-cycle">Next development cycle</z-questionnaire-choice>
          <z-questionnaire-choice zValue="backlog">Add it to the backlog</z-questionnaire-choice>
        </z-questionnaire-choices>
        <z-questionnaire-error />
      </z-questionnaire-item>

      <z-questionnaire-actions>
        <button type="button" z-questionnaire-previous>Back</button>
        <button type="button" z-questionnaire-skip>Skip</button>
        <button type="button" z-questionnaire-next>Next</button>
        <button type="submit" z-questionnaire-submit>Finish</button>
      </z-questionnaire-actions>
    </z-questionnaire>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoQuestionnaireDefaultComponent {
  private readonly sonner = inject(ZardSonnerService);

  readonly items: ZardQuestionnaireItem[] = [
    { name: 'goal', required: true },
    { name: 'updates', multiple: true },
    { name: 'start', required: true },
  ];

  save(answers: ZardQuestionnaireAnswers): void {
    this.sonner.show('Agent plan saved', {
      description: [
        `Direction: ${this.formatDirection(answers['goal'])}`,
        `Progress signals: ${this.formatUpdates(answers['updates'])}`,
        `Timing: ${this.formatTiming(answers['start'])}`,
      ].join(' · '),
    });
  }

  private formatDirection(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (DIRECTION_LABELS[value] ?? value) : 'None';
  }

  private formatUpdates(answer: ZardQuestionnaireAnswer | undefined): string {
    const values = Array.isArray(answer) ? answer : answer ? [answer] : [];
    return values.length ? values.map(value => UPDATE_LABELS[value] ?? value).join(', ') : 'None';
  }

  private formatTiming(answer: ZardQuestionnaireAnswer | undefined): string {
    const value = this.singleValue(answer);
    return value ? (TIMING_LABELS[value] ?? value) : 'None';
  }

  private singleValue(answer: ZardQuestionnaireAnswer | undefined): string | undefined {
    return Array.isArray(answer) ? answer[0] : answer;
  }
}
```

### [Code Block](/docs/components/code-block)

Show code with Shiki highlighting, line numbers, diffs, tabs and a copy action, even while it streams in.

```
npx zard-cli@latest add code-block
```

```
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileCode, lucideWrapText } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';

const CODE = `import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);

  send(messages: ChatMessage[]) {
    return this.http.post('/api/chat', { messages }, {
      observe: 'events',
      reportProgress: true,
      responseType: 'text',
    });
  }
}`;

/** The lines that call the API, highlighted in the block. */
const HIGHLIGHTED = [8, 9, 10, 11, 12];

@Component({
  selector: 'z-demo-code-block-preview',
  imports: [NgIcon, ZardButtonComponent, ...ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-lg">
      <z-code-block-header>
        <z-code-block-title>
          <ng-icon name="lucideFileCode" />
          src/app/chat/chat.service.ts
        </z-code-block-title>
        <z-code-block-actions>
          <button
            type="button"
            z-button
            zType="ghost"
            zSize="icon-xs"
            aria-label="Wrap lines"
            class="aria-pressed:text-foreground"
            [attr.aria-pressed]="wrap()"
            (click)="wrap.set(!wrap())"
          >
            <ng-icon name="lucideWrapText" />
          </button>
          <button type="button" z-button zType="ghost" zSize="icon-xs" aria-label="Download" (click)="download()">
            <ng-icon name="lucideDownload" />
          </button>
          <z-code-block-copy-button [zValue]="code" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers [zWrap]="wrap()">
        @for (line of lines(); track $index) {
          <z-code-block-line [zTokens]="line" [zType]="highlighted.includes($index) ? 'highlighted' : 'default'" />
        }
      </z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideDownload, lucideFileCode, lucideWrapText })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockPreviewComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly code = CODE;
  protected readonly highlighted = HIGHLIGHTED;
  protected readonly wrap = signal(false);
  protected readonly lines = injectHighlightedCode(CODE, 'typescript');

  protected download(): void {
    if (!this.isBrowser) {
      return;
    }

    const url = URL.createObjectURL(new Blob([CODE], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat.service.ts';
    link.click();
    URL.revokeObjectURL(url);
  }
}
```

### [Message Scroller](/docs/components/message-scroller)

A chat scroll area that follows streaming replies and loads older messages without jumping.

```
npx zard-cli@latest add message-scroller
```

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideGlobe,
  lucideImage,
  lucideMessageCircleDashed,
  lucidePaperclip,
  lucidePlus,
  lucideRotateCw,
  lucideTelescope,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@/shared/demo-utils/chat-scripts';
import { injectScriptedChat, messageAnimationClass, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

@Component({
  selector: 'z-demo-message-scroller-preview',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ...ZardCardImports,
    ...ZardDropdownImports,
    ...ZardInputGroupImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="New Chat" />
          <z-card-description zDescription="How can I help you today?" />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset conversation"
              zTooltip="Reset"
              [disabled]="chat.busy()"
              (click)="chat.reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (chat.messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="Morning, zard!"
              zDescription="What are we working on today? Press send to start a new conversation"
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zBusy]="chat.busy()">
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex-col gap-2">
          <form class="w-full" (submit)="$event.preventDefault(); chat.send()">
            <z-input-group>
              <div class="h-14 w-full px-3 py-2.5 text-sm">
                <span class="line-clamp-2" [class.opacity-60]="chat.busy()">
                  @if (chat.next(); as next) {
                    {{ next.text }}
                  } @else {
                    <span class="text-muted-foreground">No messages queued. Reset the conversation.</span>
                  }
                </span>
              </div>
              <z-input-group-addon zAlign="block-end" class="pt-1">
                <button
                  type="button"
                  z-input-group-button
                  zVariant="outline"
                  zSize="icon-sm"
                  aria-label="Add files"
                  z-dropdown
                  [zDropdownMenu]="attachMenu"
                >
                  <ng-icon name="lucidePlus" />
                </button>
                <button
                  type="submit"
                  z-input-group-button
                  zVariant="default"
                  zSize="icon-sm"
                  class="ms-auto"
                  [disabled]="!chat.next() || chat.busy()"
                >
                  <ng-icon name="lucideArrowUp" />
                  <span class="sr-only">Send</span>
                </button>
              </z-input-group-addon>
            </z-input-group>
          </form>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">Demo is read only. Press send to send messages.</p>
    </div>

    <z-dropdown-menu-content #attachMenu="zDropdownMenuContent" zSide="top" class="w-44">
      <z-dropdown-menu-item>
        <ng-icon name="lucidePaperclip" />
        Add Photos & Files
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        <ng-icon name="lucideImage" />
        Create Image
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        <ng-icon name="lucideTelescope" />
        Deep Research
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        <ng-icon name="lucideGlobe" />
        Web Search
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUp,
      lucideGlobe,
      lucideImage,
      lucideMessageCircleDashed,
      lucidePaperclip,
      lucidePlus,
      lucideRotateCw,
      lucideTelescope,
    }),
  ],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerPreviewComponent {
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { delayMs: 20 });
  protected readonly entrance = messageAnimationClass('slide-up');
}
```

### [Trace](/docs/components/trace)

A timeline of an agent's steps, from reasoning to tool calls and sources, with a status and collapsible details for each one.

```
npx zard-cli@latest add trace
```

```
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideGlobe,
  lucideLoaderCircle,
} from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface ToolCall {
  readonly command: string;
  readonly state: 'running' | 'done' | 'error';
  readonly output: string;
  readonly defaultOpen?: boolean;
}

const QUESTION = 'Why does pnpm install fail in CI?';
const REASONING =
  'CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree. I should check what the last commit changed, then reproduce the install.';
const TOOLS: (Omit<ToolCall, 'state'> & { failed?: boolean; duration: number })[] = [
  { command: 'pnpm --version', output: '10.18.0', duration: 700 },
  {
    command: 'git diff --stat HEAD~1 -- package.json pnpm-lock.yaml',
    output: ' package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)',
    duration: 900,
    defaultOpen: true,
  },
  {
    command: 'pnpm install --frozen-lockfile',
    output:
      'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json',
    duration: 1200,
    failed: true,
  },
];
const SOURCES = [
  { title: 'pnpm install | pnpm.io', url: 'https://pnpm.io/cli/install#--frozen-lockfile' },
  { title: 'Continuous Integration | pnpm.io', url: 'https://pnpm.io/continuous-integration' },
];
const ANSWER =
  'The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install fails. Run pnpm install locally and commit the lockfile.';

@Component({
  selector: 'z-demo-trace-preview',
  imports: [
    NgIcon,
    NgTemplateOutlet,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardMessageImports,
    ...ZardTraceImports,
  ],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ question }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      @if (thinking() || reasoning()) {
        <z-message>
          <z-message-content class="gap-4">
            <z-trace>
              <ng-template #thinkingLine>
                <z-trace-line [zStatus]="thinking() ? 'running' : undefined">
                  <z-trace-icon>
                    <ng-icon
                      [name]="thinking() ? 'lucideLoaderCircle' : 'lucideCircleCheck'"
                      [class.animate-spin]="thinking()"
                    />
                  </z-trace-icon>
                  <z-trace-title>{{ thinking() ? 'Thinking' : 'Thought for 5s' }}</z-trace-title>
                </z-trace-line>
              </ng-template>

              @if (reasoning()) {
                <z-trace-collapsible [zOpen]="reasoningOpen() ?? thinking()" (zOpenChange)="reasoningOpen.set($event)">
                  <z-trace-collapsible-trigger>
                    <ng-container *ngTemplateOutlet="thinkingLine" />
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content class="whitespace-pre-wrap">
                    {{ reasoning() }}
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              } @else {
                <ng-container *ngTemplateOutlet="thinkingLine" />
              }

              @for (tool of tools(); track tool.command) {
                @if (tool.state === 'running') {
                  <z-trace-line zStatus="running">
                    <z-trace-icon><ng-icon name="lucideLoaderCircle" class="animate-spin" /></z-trace-icon>
                    <z-trace-title>Running {{ tool.command }}</z-trace-title>
                  </z-trace-line>
                } @else {
                  <z-trace-collapsible [zOpen]="tool.defaultOpen ?? false">
                    <z-trace-collapsible-trigger>
                      <z-trace-line [zStatus]="tool.state === 'error' ? 'error' : undefined">
                        <z-trace-icon>
                          <ng-icon [name]="tool.state === 'error' ? 'lucideCircleAlert' : 'lucideCircleCheck'" />
                        </z-trace-icon>
                        <z-trace-title>
                          {{ tool.state === 'error' ? 'Failed to run' : 'Ran' }} {{ tool.command }}
                        </z-trace-title>
                      </z-trace-line>
                    </z-trace-collapsible-trigger>
                    <z-trace-collapsible-content>
                      <pre
                        class="max-h-64 overflow-auto rounded-lg border px-3 py-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                        [class]="
                          tool.state === 'error'
                            ? 'border-destructive/30 bg-destructive/5 text-destructive'
                            : 'bg-muted/50 text-foreground'
                        "
                        >{{ tool.output }}</pre>
                    </z-trace-collapsible-content>
                  </z-trace-collapsible>
                }
              }

              @if (sources().length) {
                <z-trace-collapsible>
                  <z-trace-collapsible-trigger>
                    <z-trace-line [zStatus]="sourcesRunning() ? 'running' : undefined">
                      <z-trace-icon>
                        <ng-icon
                          [name]="sourcesRunning() ? 'lucideLoaderCircle' : 'lucideGlobe'"
                          [class.animate-spin]="sourcesRunning()"
                        />
                      </z-trace-icon>
                      <z-trace-title>
                        {{ sourcesRunning() ? 'Using' : 'Used' }} {{ sources().length }} sources
                      </z-trace-title>
                    </z-trace-line>
                  </z-trace-collapsible-trigger>
                  <z-trace-collapsible-content>
                    <z-trace>
                      @for (source of sources(); track source.url) {
                        <a [href]="source.url" target="_blank" rel="noreferrer">
                          <z-trace-line>
                            <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                            <z-trace-title>
                              {{ source.title }}
                              <span class="sr-only">(opens in a new tab)</span>
                            </z-trace-title>
                            <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                          </z-trace-line>
                        </a>
                      }
                    </z-trace>
                  </z-trace-collapsible-content>
                </z-trace-collapsible>
              }
            </z-trace>

            @if (answer()) {
              <p>{{ answer() }}</p>
            }
          </z-message-content>
        </z-message>
      }

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="replay()">
          Replay
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideArrowUpRight, lucideCircleAlert, lucideCircleCheck, lucideGlobe, lucideLoaderCircle }),
  ],
  host: { class: 'contents' },
})
export class ZardDemoTracePreviewComponent {
  protected readonly question = QUESTION;

  // The page opens on the finished turn; Replay streams it again.
  protected readonly reasoning = signal(REASONING);
  protected readonly thinking = signal(false);
  /** Undefined until the reader toggles the row, so the reasoning stays open while it streams. */
  protected readonly reasoningOpen = signal<boolean | undefined>(undefined);
  protected readonly tools = signal<ToolCall[]>(
    TOOLS.map(tool => ({ ...tool, state: tool.failed ? 'error' : 'done' })),
  );

  protected readonly sources = signal(SOURCES);
  protected readonly sourcesRunning = signal(false);
  protected readonly answer = signal(ANSWER);
  protected readonly busy = signal(false);

  /** Bumped on every replay and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.reasoning.set('');
    this.reasoningOpen.set(undefined);
    this.tools.set([]);
    this.sources.set([]);
    this.answer.set('');

    this.thinking.set(true);
    if (!(await this.stream(REASONING, text => this.reasoning.set(text), 40, run))) return;
    this.thinking.set(false);

    for (const { failed, duration, ...tool } of TOOLS) {
      this.tools.update(tools => [...tools, { ...tool, state: 'running' }]);
      if (!(await this.wait(duration, run))) return;
      this.tools.update(tools =>
        tools.map(item => (item.command === tool.command ? { ...item, state: failed ? 'error' : 'done' } : item)),
      );
    }

    this.sources.set(SOURCES);
    this.sourcesRunning.set(true);
    if (!(await this.wait(1000, run))) return;
    this.sourcesRunning.set(false);

    if (!(await this.stream(ANSWER, text => this.answer.set(text), 20, run))) return;
    this.busy.set(false);
  }

  /** Reveals `text` a word at a time, like a streamed response. Resolves `false` if the run was replaced. */
  private async stream(text: string, set: (value: string) => void, delay: number, run: number): Promise<boolean> {
    let shown = '';
    for (const word of text.split(/(?<= )/)) {
      if (!(await this.wait(delay, run))) return false;
      shown += word;
      set(shown);
    }
    return true;
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
```
