---
title: Changelog
description: Latest updates, new components, and improvements to ZardUI.
---

# Changelog

Latest updates, new components, and improvements to ZardUI.

## November 2026

Our biggest month for new components yet. We added Data Table, Color Picker, Menubar, Native Select and Questionnaire, plus Code Block, Message Scroller and Trace for chat and agent interfaces, an interactive Map, and the AI Elements patterns built on top of them.

### Highlights

#### AI Elements

A new docs section with 21 ready-made patterns for chat and agent interfaces, such as reasoning, tool calls, plans, sources and the prompt input. Each one is composed from Zard components and lists the ones it needs.

#### Map

An interactive MapLibre map with markers, popups, routes, clusters and heatmaps, whose basemap follows your light or dark theme. It needs a short setup for the MapLibre assets, covered on its page.

npx zard-cli@latest add map

### New Components

#### data-table

## Run the CLI

Use the CLI to add data-table to your project.

```
npx zard-cli@latest add data-table
```

A table built on TanStack Table that sorts, filters, paginates and selects rows, with ready-made column header, pagination and view-options parts.

|  | Status |  | Amount |  |
| --- | --- | --- | --- | --- |
|  | success | ken99@example.com | $316.00 |  |
|  | success | Abe45@example.com | $242.00 |  |
|  | processing | Monserrat44@example.com | $837.00 |  |
|  | success | Silas22@example.com | $874.00 |  |
|  | failed | carmella@example.com | $721.00 |  |
|  | pending | lena.ortiz@example.com | $129.00 |  |
|  | success | omar_h@example.com | $563.00 |  |
|  | failed | june.park@example.com | $98.00 |  |
|  | processing | theo.martin@example.com | $450.00 |  |
|  | success | ines.costa@example.com | $287.00 |  |

0 of 12 row(s) selected.

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

#### color-picker

## Run the CLI

Use the CLI to add color-picker to your project.

```
npx zard-cli@latest add color-picker
```

Pick a color in several formats, with optional alpha and presets, and bind it to Angular forms.

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

#### menubar

## Run the CLI

Use the CLI to add menubar to your project.

```
npx zard-cli@latest add menubar
```

A desktop-style menu bar with checkbox items, radio items and submenus.

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

#### native-select

## Run the CLI

Use the CLI to add native-select to your project.

```
npx zard-cli@latest add native-select
```

Style the browser's own select element, with sizes, option groups and invalid states.

Status

Select status

Todo

In progress

Done

Cancelled

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

#### questionnaire

## Run the CLI

Use the CLI to add questionnaire to your project.

```
npx zard-cli@latest add questionnaire
```

A multi-step form that asks one question at a time, with choices, free-text answers, progress, validation and keyboard shortcuts.

Question 1 of 3

What should the agent build next?

Choose a direction or describe another task.

Tool call timeline Show what the agent ran and what came back.  A

Approval checkpoints Ask before sensitive or destructive actions.  B

Sub-agent handoffs Make delegated work and results easier to follow.  C

What should every progress update include?

Select all that apply, or skip this question.

Progress made

Decisions taken

Risks or blockers

Next step

When should work begin?

Choose one option.

Start now

Next development cycle

Add it to the backlog

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

#### code-block

## Run the CLI

Use the CLI to add code-block to your project.

```
npx zard-cli@latest add code-block
```

Show code with Shiki highlighting, line numbers, diffs, tabs and a copy action, even while it streams in.

src/app/chat/chat.service.ts

import { HttpClient } from'@angular/common/http';import { inject, Injectable } from'@angular/core';@Injectable({ providedIn: 'root' })export class ChatService {private readonly http=inject(HttpClient);send(messages:ChatMessage[]) {return this.http.post('/api/chat', { messages }, { observe: 'events', reportProgress: true, responseType: 'text', }); }}

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

#### message-scroller

## Run the CLI

Use the CLI to add message-scroller to your project.

```
npx zard-cli@latest add message-scroller
```

A chat scroll area that follows streaming replies and loads older messages without jumping.

New Chat

How can I help you today?

Morning, zard!

What are we working on today? Press send to start a new conversation

I'm building a chat for our Angular app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.

Demo is read only. Press send to send messages.

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

#### trace

## Run the CLI

Use the CLI to add trace to your project.

```
npx zard-cli@latest add trace
```

A timeline of an agent's steps, from reasoning to tool calls and sources, with a status and collapsible details for each one.

Why does pnpm install fail in CI?

```
 package.json | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```

The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install fails. Run pnpm install locally and commit the lockfile.

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

## October 2026

We made every component read right to left, so Arabic, Hebrew and Persian apps get the same library as everyone else. Turn it on when you run zard-cli init, or set dir="rtl" on your html tag, and see the RTL guide for fonts and migration. The CLI also learned to design: zard-cli create starts a project already styled from a preset, and zard-cli apply restyles one you already have.

### Highlights

#### Start a styled project with one command

`zard-cli create` scaffolds an Angular, Nx or Analog.js application and configures it from a design preset, with a button already installed. Run it with no arguments to answer the questions, or paste the command the create page gives you.

`npx zard-cli@latest create my-app --template angular`

#### Design your look on the create page

Pick one of eight styles, a base color out of nine (Mauve, Olive, Mist and Taupe are new), the theme and chart colors, fonts, one of five icon libraries, the radius and the menu look, with a live preview. The preset code it produces works in `create`, `init --preset` and `apply`.

#### Restyle an existing project

`zard-cli apply --preset` swaps the theme, fonts and icons of a project that is already initialized. It only rewrites the regions the CLI manages, so your own CSS survives, and it prints the commands to re-add the components you want to follow the new look.

`npx zard-cli@latest apply --preset <code>`

### Right to left

#### card

## Run the CLI

Use the CLI to add card to your project.

```
npx zard-cli@latest add card
```

The same card in Arabic, Hebrew and English: pick a language and the layout mirrors with it.

تسجيل الدخول إلى حسابك

أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك

إنشاء حساب

البريد الإلكتروني

كلمة المرور

نسيت كلمة المرور؟

تسجيل الدخول

تسجيل الدخول باستخدام Google

```
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CardRtlValues {
  title: string;
  description: string;
  signUp: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  forgotPassword: string;
  login: string;
  loginWithGoogle: string;
}

const translations: ZardRtlTranslations<CardRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Login to your account',
      description: 'Enter your email below to login to your account',
      signUp: 'Sign Up',
      email: 'Email',
      emailPlaceholder: 'm@example.com',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      login: 'Login',
      loginWithGoogle: 'Login with Google',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'تسجيل الدخول إلى حسابك',
      description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'm@example.com',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
      loginWithGoogle: 'تسجيل الدخول باستخدام Google',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'התחבר לחשבון שלך',
      description: 'הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך',
      signUp: 'הירשם',
      email: 'אימייל',
      emailPlaceholder: 'm@example.com',
      password: 'סיסמה',
      forgotPassword: 'שכחת את הסיסמה?',
      login: 'התחבר',
      loginWithGoogle: 'התחבר עם Google',
    },
  },
};

@Component({
  selector: 'z-demo-card-rtl',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title [zTitle]="i18n.t().title" />
        <z-card-description [zDescription]="i18n.t().description" />
        <z-card-action>
          <a z-button zType="link" href="#">{{ i18n.t().signUp }}</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-rtl-email">{{ i18n.t().email }}</label>
            <input z-input id="card-rtl-email" type="email" [placeholder]="i18n.t().emailPlaceholder" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-rtl-password">{{ i18n.t().password }}</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">{{ i18n.t().forgotPassword }}</a>
            </div>
            <input z-input id="card-rtl-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">{{ i18n.t().login }}</z-button>
        <z-button zType="outline" class="w-full">{{ i18n.t().loginWithGoogle }}</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
```

## Zard UI v1.0 is here

Alpha, Beta, and Release Candidate converge into a stable 1.0: the component API, the CLI, and the registry format are now covered by semantic versioning, and breaking changes only ship behind a major bump from here on.

## September 2026

The month v1.0.0 ships — see the announcement above for what a stable 1.0 means.

### Highlights

#### Dialog, sheet and alert dialog in the template

The three overlays gain the declarative form the drawer already had: compose z-dialog, z-sheet or z-alert-dialog with [(zVisible)] and header, title, description and footer children, or keep opening the same panel from code through the service. Every example on their pages now shows both.

## August 2026

One-time passwords land this month. We added the Input OTP component, with grouped slots, separators, pattern validation, and paste support out of the box.

### New Components

#### input-otp

## Run the CLI

Use the CLI to add input-otp to your project.

```
npx zard-cli@latest add input-otp
```

Accessible one-time password input with grouped slots, custom separators, and copy-paste support.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-preview',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpPreviewComponent {
  value = '123456';
}
```

## July 2026

Four new components this month — Field, Item, Textarea, and Sonner — and a reorganisation that moved every demo and API doc next to the component it documents.

### Highlights

#### Toast is now Sonner

The `toast` component has been replaced by `sonner`. Swap `z-toast` / `z-toaster` for `z-sonner`, import `ZardSonnerService` instead of the toast service, and reinstall under the new name. The old component no longer ships.

`npx zard-cli@latest add sonner`

#### Demos and docs live with the components

Every demo, API reference, and overview moved from the documentation site into `libs/zard/.../components/<name>/`. Nothing changes for you as a consumer — the CLI and the registry are unaffected — but contributing a component is now a single folder.

### New Components

#### field

## Run the CLI

Use the CLI to add field to your project.

```
npx zard-cli@latest add field
```

Composable building blocks for accessible forms, pairing a control with its label, description, and error message.

Payment Method

All transactions are secure and encrypted.

Name on Card

Card Number

Enter your 16-digit card number.

Month

Year

CVV

Billing Address

The billing address associated with your payment method.

Same as shipping address

Comments

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-field-preview',
  imports: [
    ...ZardFieldImports,
    ZardButtonComponent,
    ZardCheckboxComponent,
    ZardInputComponent,
    ZardTextareaComponent,
    ZardSelectImports,
    FormsModule,
  ],
  template: `
    <div class="w-full min-w-md">
      <form>
        <div z-field-group>
          <fieldset z-field-set>
            <legend z-field-legend>Payment Method</legend>
            <p z-field-description>All transactions are secure and encrypted.</p>

            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-card-name">Name on Card</label>
                <input z-input id="checkout-card-name" placeholder="Evil Rabbit" zSize="sm" required />
              </div>

              <div z-field>
                <label z-field-label for="checkout-card-number">Card Number</label>
                <input z-input id="checkout-card-number" placeholder="1234 5678 9012 3456" zSize="sm" required />
                <p z-field-description>Enter your 16-digit card number.</p>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div z-field>
                  <label z-field-label for="checkout-exp-month" class="w-fit">Month</label>
                  <z-select id="checkout-exp-month" zPlaceholder="MM" zSize="sm">
                    <z-select-item zValue="01">01</z-select-item>
                    <z-select-item zValue="02">02</z-select-item>
                    <z-select-item zValue="03">03</z-select-item>
                    <z-select-item zValue="04">04</z-select-item>
                    <z-select-item zValue="05">05</z-select-item>
                    <z-select-item zValue="06">06</z-select-item>
                    <z-select-item zValue="07">07</z-select-item>
                    <z-select-item zValue="08">08</z-select-item>
                    <z-select-item zValue="09">09</z-select-item>
                    <z-select-item zValue="10">10</z-select-item>
                    <z-select-item zValue="11">11</z-select-item>
                    <z-select-item zValue="12">12</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-exp-year">Year</label>
                  <z-select id="checkout-exp-year" zPlaceholder="YYYY" zSize="sm">
                    <z-select-item zValue="2024">2024</z-select-item>
                    <z-select-item zValue="2025">2025</z-select-item>
                    <z-select-item zValue="2026">2026</z-select-item>
                    <z-select-item zValue="2027">2027</z-select-item>
                    <z-select-item zValue="2028">2028</z-select-item>
                    <z-select-item zValue="2029">2029</z-select-item>
                  </z-select>
                </div>
                <div z-field>
                  <label z-field-label for="checkout-cvv">CVV</label>
                  <input z-input id="checkout-cvv" placeholder="123" zSize="sm" required />
                </div>
              </div>
            </div>
          </fieldset>

          <z-field-separator />

          <fieldset z-field-set>
            <legend z-field-legend>Billing Address</legend>
            <p z-field-description>The billing address associated with your payment method.</p>

            <div z-field-group>
              <div z-field zOrientation="horizontal">
                <span
                  z-checkbox
                  zId="checkout-same-as-shipping"
                  [(ngModel)]="sameAsShipping"
                  name="sameAsShipping"
                ></span>
                <label z-field-label for="checkout-same-as-shipping" class="font-normal">
                  Same as shipping address
                </label>
              </div>
            </div>
          </fieldset>

          <fieldset z-field-set>
            <div z-field-group>
              <div z-field>
                <label z-field-label for="checkout-comments">Comments</label>
                <textarea
                  z-textarea
                  id="checkout-comments"
                  placeholder="Add any additional comments"
                  class="resize-none"
                ></textarea>
              </div>
            </div>
          </fieldset>

          <div z-field zOrientation="horizontal">
            <button z-button type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldPreviewComponent {
  protected sameAsShipping = true;
}
```

#### item

## Run the CLI

Use the CLI to add item to your project.

```
npx zard-cli@latest add item
```

A versatile row for displaying media, a title, a description, and actions side by side.

Basic Item

A simple item with title and description.

Your profile has been verified.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';

@Component({
  selector: 'z-demo-item-preview',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-content>
          <z-item-title>Basic Item</z-item-title>
          <z-item-description>A simple item with title and description.</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">Action</button>
        </z-item-actions>
      </z-item>

      <a z-item href="#" zVariant="outline" zSize="sm">
        <z-item-media>
          <ng-icon name="lucideBadgeCheck" size="1.25rem" />
        </z-item-media>
        <z-item-content>
          <z-item-title>Your profile has been verified.</z-item-title>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" />
        </z-item-actions>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemPreviewComponent {}
```

#### textarea

## Run the CLI

Use the CLI to add textarea to your project.

```
npx zard-cli@latest add textarea
```

Multi-line text input with the same variants, sizes, and validation states as the single-line input.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-preview',
  imports: [ZardTextareaComponent],
  template: `
    <textarea z-textarea id="textarea-preview" placeholder="Type your message here." class="w-72"></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaPreviewComponent {}
```

#### sonner

## Run the CLI

Use the CLI to add sonner to your project.

```
npx zard-cli@latest add sonner
```

An opinionated toast component with stacking, positioning, and per-type styling. Replaces the old toast.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-sonner-preview',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">Show Toast</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerPreviewComponent {
  private readonly sonner = inject(ZardSonnerService);

  show() {
    this.sonner.show('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  }
}
```

## May 2026

A quieter month focused on form correctness. We taught the input directive to speak numbers, and we changed one dialog default that had been surprising people.

### Highlights

#### Numeric inputs keep their type

The input directive now reads and writes real numbers for `type="number"` and `type="range"`, so a signal or reactive form typed as `number` stays a number instead of being turned into a string. An empty field resolves to `null`.

#### Alert Dialog no longer closes on the backdrop

`zMaskClosable` now defaults to `false` on Alert Dialog. A confirmation is meant to be answered, not dismissed by a stray click. If you relied on the old behaviour, opt back in explicitly.

`zMaskClosable: true`

## April 2026

A thin month — two releases, no new components. One quietly narrows the Avatar `zSize` API to named sizes only; the other makes Select track option lists that keep changing after render.

### Highlights

#### Avatar drops numeric sizes

`zSize` on `z-avatar` only takes `sm`, `default`, `md`, `lg` and `xl` now: the numeric option is gone. Swap a number for the closest name (32, 40, 48, 56 and 64 px) or for a `size-*` class. Its exported types were renamed too.

- `ZardAvatarVariants` → `ZardAvatarSizeVariants`
- `ZardImageVariants` → `ZardAvatarShapeVariants`
- `ZardAvatarGroupVariants` → `ZardAvatarGroupOrientationVariants`

`<z-avatar zSize="sm" />`

#### Select follows dynamic option lists

Options added to a `z-select` after it renders, from a signal or a reactive list, are now selectable. The current value survives new options, and removing the selected one falls back to the raw value. No input or output changed.

## March 2026

Complete icon system migration! We replaced the custom `ZardIconComponent` with `@ng-icons/lucide`, bringing better tree-shaking, a wider icon selection, and a simpler API across all components.

### Highlights

#### Migration to @ng-icons/lucide

All components now use `NgIcon` from `@ng-icons/core` with icons sourced from `@ng-icons/lucide`. This replaces the deprecated `ZardIconComponent` and the custom icon registry, resulting in better tree-shaking and smaller bundle sizes.

#### New Icon API

Icons are now provided at component level using `provideIcons()` in `viewProviders` and rendered with `<ng-icon name="lucideIconName" />`. Import only the icons you need from `@ng-icons/lucide`.

#### Updated Dependencies

The `lucide-angular` dependency has been replaced by `@ng-icons/core` and `@ng-icons/lucide`. The CLI `init` command now installs these automatically.

`npm install @ng-icons/core @ng-icons/lucide`

## February 2026

The busiest month of the year outside August — 77 commits, most of them release automation. Underneath that: the CLI is renamed to `zard-cli` and hardened for monorepos, dark mode becomes safe under SSR, Button is restyled to match the latest shadcn/ui, Switch moves to a breaking model-input API, and Tree lands (it was removed again in August, see that entry).

### Highlights

#### CLI package renamed to zard-cli

The package moves from `@ngzard/ui` to `zard-cli`, and the binary from `ngzard` to `zard-cli`. The old package now prints a deprecation warning instead of doing anything. `components.json` and components you already installed are unaffected.

`npx zard-cli@latest init`

#### Tree component

A new `z-tree` shipped this month — expand/collapse, single and checkbox selection with propagation and indeterminate state, CDK virtual scroll, keyboard navigation, and a custom node template. It was removed again in August 2026, so there is no install command or demo for it here; mentioned for the record.

#### Switch moves to a model input

`z-switch` is now a component driven by `[(zChecked)]` and `zDisabled` instead of an attribute directive. The `(checkChange)` output and the bare `[z-switch]` selector are gone. Migrate `(checkChange)` to `(zCheckedChange)` or `[(zChecked)]`, `<button z-switch>` to `<z-switch>`, and a bare `disabled` attribute to `[zDisabled]`.

`<z-switch [(zChecked)]="enabled" [zDisabled]="locked">Label</z-switch>`

#### Button matches the latest shadcn/ui

New `zSize` values (`xs`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`), every existing size 4px shorter, a `rounded-lg` base radius, and a tinted rather than solid `destructive` variant. Not an API break, but layouts shift — reinstall `button` (and `date-picker`, which picked up the same size scale) to pick up the new styles.

#### Dark mode service works under SSR

`ZardDarkMode` no longer touches `matchMedia` in its constructor, so it no longer throws on the server and no longer flashes the wrong theme on first paint. It initialises after first render and keeps tracking OS changes while in `system` mode.

`npx zard-cli@latest add dark-mode`

#### CLI add is monorepo- and Angular-aware

`zard-cli add` now walks up to find the right `package.json`, pins `embla-carousel-angular` to your Angular major, retries with `--legacy-peer-deps` when needed, warns on Angular pre-releases, and rewrites `@/shared/*` imports using the aliases in `components.json`.

## January 2026

A quiet month by commit count but not by API surface: Angular 21 becomes the floor, every generated id moves to a new `ZardIdDirective` so server and client stop disagreeing, and both the input directive and Checkbox learn to honour the Reactive Forms disabled state.

### Highlights

#### Angular 21 is now required

Peer dependencies move to `^21.0.0` for `@angular/core`, `common`, `forms`, `router`, `platform-browser`, and `cdk` (previously pinned to 20.3.14), with `embla-carousel-angular` on `^21` and `tailwind-merge` on `^3.4`. Apps still on Angular 20 need to update before installing new components.

`ng update @angular/core@21 @angular/cli@21 @angular/cdk@21`

#### SSR-stable ids with ZardIdDirective

Alert Dialog, Card, Checkbox, Input Group, Radio, Switch, Tooltip, and Menu now generate their ids through the public `ZardIdDirective` instead of `crypto.randomUUID()`, so the id is deterministic and the server and browser render the same markup — no more hydration mismatch. `generateId` from `@/shared/utils/merge-classes` is gone; use `ZardIdDirective` from `@/shared/core` instead.

`<label zardId="email" #e="zardId" [for]="e.id()">Email</label>`

#### ZardTooltipModule replaced by ZardTooltipImports

The tooltip module is gone. Import `ZardTooltipImports` (or the standalone directive/component directly) instead.

`imports: [ZardTooltipImports]`

#### Input directive is a ControlValueAccessor

The `input[z-input]` and `textarea[z-input]` directives now register `NG_VALUE_ACCESSOR`: `setValue`/`patchValue` work, `control.disable()` disables the field, and blur marks it touched. A new signal-form demo shows it wired through `[formField]` from `@angular/forms/signals`.

#### Checkbox: zDisabled input and form disabled state

The `disabled` input is renamed to `zDisabled`, `setDisabledState` is implemented so reactive forms can disable a checkbox directly, and `checked` is now a signal. The outer `<span>` wrapper is gone — the host itself carries the layout and `aria-disabled`.

`<span z-checkbox [zDisabled]="true">Disabled</span>`

#### Avatar and Empty render images with NgOptimizedImage

Avatar gains a `zPriority` input and accepts a `SafeUrl` for `zSrc`; the image fills its container and lazy-loads unless marked priority. Empty renders its `zImage` at 64×64 by default. Both reject `data:`/`blob:` URLs in dev mode.

`<z-avatar zSrc="/me.png" zPriority />`

#### Variant helper types renamed

Several exported variant types were renamed or split for consistency. `ZardAlertIconVariants`, `ZardAlertTitleVariants`, `ZardAlertDescriptionVariants` and `ZardCheckLabelVariants` were removed with no replacement.

- `ZardAlertVariants` → `ZardAlertTypeVariants`
- `ZardBadgeVariants` → `ZardBadgeTypeVariants, ZardBadgeShapeVariants`
- `ZardCheckboxVariants` → `ZardCheckboxTypeVariants, ZardCheckboxSizeVariants, ZardCheckboxShapeVariants`
- `ZardIconVariants` → `ZardIconSizeVariants`

## December 2025

Major infrastructure improvements this month! We focused on developer experience with a new provider system, CLI enhancements with our own private registry, and streamlined dark-mode setup.

### Highlights

#### provideZard()

New provider function for streamlined app configuration. Add event manager plugins and other Zard utilities with a single function call in your app.config.ts.

`provideZard()`

#### Private Registry System

The CLI now uses our own private registry instead of fetching from GitHub. This brings significant performance improvements, better version control, and more reliable component installations.

#### Dark Mode via CLI

Adding dark-mode support to your project is now as simple as running a single CLI command. It automatically configures everything you need.

`npx zard-cli@latest add dark-mode`

## November 2025

Major updates this month with new interactive components including Carousel, Button Group, Input Group, and Kbd components. Enhanced user experience with better form controls and keyboard navigation support.

### New Components

#### carousel

## Run the CLI

Use the CLI to add carousel to your project.

```
npx zard-cli@latest add carousel
```

A slideshow component for cycling through elements with support for mouse drag, touch swipe, and automatic playback.

1

2

3

4

5

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';

@Component({
  selector: 'z-demo-carousel-preview',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <div class="w-full max-w-48 sm:max-w-xs">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides; track slide) {
            <z-carousel-item>
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-4xl font-semibold">{{ slide }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselPreviewComponent {
  protected slides = ['1', '2', '3', '4', '5'];
}
```

#### kbd

## Run the CLI

Use the CLI to add kbd to your project.

```
npx zard-cli@latest add kbd
```

Display keyboard keys and shortcuts in a visually consistent way.

Ctrl

B

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';

@Component({
  selector: 'z-demo-kbd-preview',
  imports: [ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <z-kbd-group>
        <z-kbd>⌘</z-kbd>
        <z-kbd>⇧</z-kbd>
        <z-kbd>⌥</z-kbd>
        <z-kbd>⌃</z-kbd>
      </z-kbd-group>
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <span>+</span>
        <z-kbd>B</z-kbd>
      </z-kbd-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdPreviewComponent {}
```

## October 2025

Breaking changes with icons migration from lucide-static to lucide-angular for better performance. New layout components including Sheet and Empty state component for better UX.

### New Components

#### sheet

## Run the CLI

Use the CLI to add sheet to your project.

```
npx zard-cli@latest add sheet
```

A versatile sheet component for side panels and overlays with customizable positioning and smooth transitions.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { ZardSheetService } from '@/shared/components/sheet/sheet.service';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

/** Content the service renders inside the sheet. */
@Component({
  selector: 'z-demo-sheet-preview-form',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <label for="sheet-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="sheet-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="sheet-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="sheet-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoSheetPreviewForm',
})
export class ZardDemoSheetPreviewFormComponent {
  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });
}

@Component({
  selector: 'z-demo-sheet-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ZardSheetImports, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Open</button>

        <z-sheet [(zVisible)]="visible">
          <z-sheet-header>
            <z-sheet-title>Edit profile</z-sheet-title>
            <z-sheet-description>Make changes to your profile here. Click save when you're done.</z-sheet-description>
          </z-sheet-header>
          <form [formGroup]="form" class="grid flex-1 auto-rows-min gap-6 px-4">
            <div class="grid gap-3">
              <label for="sheet-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="sheet-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="sheet-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="sheet-username" formControlName="username" />
            </div>
          </form>
          <z-sheet-footer>
            <button type="button" z-button (click)="save()">Save changes</button>
            <button type="button" z-button zType="outline" z-sheet-close>Close</button>
          </z-sheet-footer>
        </z-sheet>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openSheet()">Open</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetPreviewComponent {
  private readonly sheetService = inject(ZardSheetService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openSheet() {
    this.sheetService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoSheetPreviewFormComponent,
      zOkText: 'Save changes',
      zCancelText: 'Close',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

#### empty

## Run the CLI

Use the CLI to add empty to your project.

```
npx zard-cli@latest add empty
```

Clean empty state component for "no data" scenarios with customizable messages and icons.

No Projects Yet

You haven't created any projects yet. Get started by creating your first project.

Learn More

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';

@Component({
  selector: 'z-demo-empty-preview',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      zTitle="No Projects Yet"
      zDescription="You haven't created any projects yet. Get started by creating your first project."
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>Create Project</button>
      </ng-template>

      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">Import Project</button>
      </ng-template>

      <a z-button zType="link" zSize="sm" class="text-muted-foreground" href="#">
        Learn More
        <ng-icon name="lucideArrowUpRight" />
      </a>
    </z-empty>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUpRight,
      lucideFolderCode,
    }),
  ],
})
export class ZardDemoEmptyPreviewComponent {}
```

## September 2025

Focus on loading and feedback components this month. New Progress, Skeleton, and Loader components for better perceived performance and user feedback during async operations.

### New Components

#### progress

## Run the CLI

Use the CLI to add progress to your project.

```
npx zard-cli@latest add progress
```

Visual progress indicator showing the completion progress of a task.

```
import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardProgressComponent } from '@/shared/components/progress/progress.component';

@Component({
  selector: 'z-demo-progress-preview',
  imports: [ZardProgressComponent],
  template: `
    <z-progress class="w-60" [value]="value()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressPreviewComponent {
  protected readonly value = signal(13);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => this.value.set(66), 500);
    });
  }
}
```

#### skeleton

## Run the CLI

Use the CLI to add skeleton to your project.

```
npx zard-cli@latest add skeleton
```

Loading placeholder component for better perceived performance during content loading with pulse animation.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';

@Component({
  selector: 'z-demo-skeleton-preview',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex items-center space-x-4">
      <z-skeleton class="size-12 rounded-full" />
      <div class="space-y-2">
        <z-skeleton class="h-4 w-[250px]" />
        <z-skeleton class="h-4 w-[200px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonPreviewComponent {}
```

#### spinner

## Run the CLI

Use the CLI to add spinner to your project.

```
npx zard-cli@latest add spinner
```

Animated loading spinner customizable via the [zIcon] template input for swapping the underlying icon.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';

@Component({
  selector: 'z-demo-spinner-custom-icon',
  imports: [ZardSpinnerComponent],
  template: `
    <div class="flex items-center gap-4">
      <z-spinner [zIcon]="customIcon" />
    </div>

    <ng-template #customIcon let-classes>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        [class]="classes"
      >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSpinnerCustomIconComponent {}
```

## August 2025

Enhanced navigation and display components. New Avatar component with fallback support, Divider for content separation, and Breadcrumb for hierarchical navigation.

### New Components

#### avatar

## Run the CLI

Use the CLI to add avatar to your project.

```
npx zard-cli@latest add avatar
```

User profile image component with automatic fallback to initials and multiple size variants.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';

@Component({
  selector: 'z-demo-avatar-basic',
  imports: [ZardAvatarComponent],
  template: `
    <div class="mb-4 flex gap-3">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" zFallback="ZA" />
      <z-avatar zSrc="error-image.png" zFallback="ZA" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarBasicComponent {}
```

#### separator

## Run the CLI

Use the CLI to add separator to your project.

```
npx zard-cli@latest add separator
```

Visual separator component for separating content sections with horizontal and vertical orientations.

Zard/ui

The Next Level for Your Angular Projects

A set of beautifully designed components that you can customize, extend, and build on.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSeparatorComponent } from '../separator.component';

@Component({
  selector: 'z-demo-separator-preview',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">Zard/ui</div>
        <div class="text-muted-foreground">The Next Level for Your Angular Projects</div>
      </div>
      <z-separator />
      <div>A set of beautifully designed components that you can customize, extend, and build on.</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorPreviewComponent {}
```

#### breadcrumb

## Run the CLI

Use the CLI to add breadcrumb to your project.

```
npx zard-cli@latest add breadcrumb
```

Navigation breadcrumb trail showing the current page location within a hierarchical structure.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBreadcrumbImports } from '../breadcrumb.imports';

@Component({
  selector: 'z-demo-breadcrumb-basic',
  imports: [ZardBreadcrumbImports],
  template: `
    <z-breadcrumb zLabel="Basic breadcrumb">
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/">Home</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <a z-breadcrumb-link href="/docs/components">Components</a>
      </z-breadcrumb-item>
      <z-breadcrumb-item>
        <span z-breadcrumb-page>Breadcrumb</span>
      </z-breadcrumb-item>
    </z-breadcrumb>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBreadcrumbBasicComponent {}
```

## July 2025

Major release of navigation and content organization components. New Tabs for multi-view interfaces, Accordion for collapsible content, and Tooltip for contextual information. Theming system improvements with new color palettes.

### New Components

#### tabs

## Run the CLI

Use the CLI to add tabs to your project.

```
npx zard-cli@latest add tabs
```

Tabbed interface component for organizing content into separate views with smooth transitions and keyboard navigation.

Overview

View your key metrics and recent project activity. Track progress across all your active projects.

You have 12 active projects and 3 pending tasks.

Analytics

Track performance and user engagement metrics. Monitor trends and identify growth opportunities.

Page views are up 25% compared to last month.

Reports

Generate and download your detailed reports. Export data in multiple formats for analysis.

You have 5 reports ready and available to export.

Settings

Manage your account preferences and options. Customize your experience to fit your needs.

Configure notifications, security, and themes.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

@Component({
  selector: 'z-demo-tabs-preview',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardImports],
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab label="Overview">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Overview" />
            <z-card-description
              zDescription="View your key metrics and recent project activity. Track progress across all your active projects."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 12 active projects and 3 pending tasks.</p>
        </z-card>
      </z-tab>
      <z-tab label="Analytics">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Analytics" />
            <z-card-description
              zDescription="Track performance and user engagement metrics. Monitor trends and identify growth opportunities."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Page views are up 25% compared to last month.</p>
        </z-card>
      </z-tab>
      <z-tab label="Reports">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Reports" />
            <z-card-description
              zDescription="Generate and download your detailed reports. Export data in multiple formats for analysis."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">You have 5 reports ready and available to export.</p>
        </z-card>
      </z-tab>
      <z-tab label="Settings">
        <z-card>
          <z-card-header>
            <z-card-title zTitle="Settings" />
            <z-card-description
              zDescription="Manage your account preferences and options. Customize your experience to fit your needs."
            />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">Configure notifications, security, and themes.</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsPreviewComponent {}
```

#### accordion

## Run the CLI

Use the CLI to add accordion to your project.

```
npx zard-cli@latest add accordion
```

Collapsible content panels for organizing information in a compact space with expand/collapse animations.

Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.

Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.

We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';

@Component({
  selector: 'z-demo-accordion-basic',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zDefaultValue="item-1" zType="single" class="max-w-sm">
      <z-accordion-item zValue="item-1" zTitle="How do I reset my password?">
        Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your
        password. The link will expire in 24 hours.
      </z-accordion-item>

      <z-accordion-item zValue="item-2" zTitle="Can I change my subscription plan?">
        Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in
        your next billing cycle.
      </z-accordion-item>

      <z-accordion-item zValue="item-3" zTitle="What payment methods do you accept?">
        We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our
        payment partners.
      </z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionBasicComponent {}
```

#### tooltip

## Run the CLI

Use the CLI to add tooltip to your project.

```
npx zard-cli@latest add tooltip
```

Contextual information overlay displayed on hover with customizable positioning and delay settings.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

@Component({
  selector: 'z-demo-tooltip-preview',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <button type="button" z-button zType="outline" zTooltip="Tooltip content">Hover</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipPreviewComponent {}
```

## June 2025

Overlay components release! New Dialog, Popover, Alert Dialog, and Dropdown Menu components. CVA integration for type-safe styling variants across all components.

### New Components

#### dialog

## Run the CLI

Use the CLI to add dialog to your project.

```
npx zard-cli@latest add dialog
```

Modal dialog component for displaying important content that requires user attention with backdrop overlay.

```
import { ChangeDetectionStrategy, Component, inject, signal, type AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { Z_MODAL_DATA, ZardDialogService } from '@/shared/components/dialog/dialog.service';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

interface DialogData {
  name: string;
  username: string;
}

/** Content the service renders inside the dialog; reads what was passed through `zData`. */
@Component({
  selector: 'z-demo-dialog-preview-content',
  imports: [ReactiveFormsModule, ZardInputComponent],
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="dialog-service-name" class="text-sm leading-none font-medium select-none">Name</label>
        <input z-input id="dialog-service-name" formControlName="name" />
      </div>
      <div class="grid gap-3">
        <label for="dialog-service-username" class="text-sm leading-none font-medium select-none">Username</label>
        <input z-input id="dialog-service-username" formControlName="username" />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'zardDemoDialogPreviewContent',
})
export class ZardDemoDialogPreviewContentComponent implements AfterViewInit {
  private readonly data = inject(Z_MODAL_DATA) as DialogData;

  readonly form = new FormGroup({
    name: new FormControl('Pedro Duarte'),
    username: new FormControl('@peduarte'),
  });

  ngAfterViewInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }
}

@Component({
  selector: 'z-demo-dialog-preview',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent, ZardTabsImports, ReactiveFormsModule],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Edit profile</button>

        <z-dialog [(zVisible)]="visible">
          <z-dialog-header>
            <z-dialog-title>Edit profile</z-dialog-title>
            <z-dialog-description>Make changes to your profile here. Click save when you're done.</z-dialog-description>
          </z-dialog-header>
          <form [formGroup]="form" class="grid gap-4">
            <div class="grid gap-3">
              <label for="dialog-name" class="text-sm leading-none font-medium select-none">Name</label>
              <input z-input id="dialog-name" formControlName="name" />
            </div>
            <div class="grid gap-3">
              <label for="dialog-username" class="text-sm leading-none font-medium select-none">Username</label>
              <input z-input id="dialog-username" formControlName="username" />
            </div>
          </form>
          <z-dialog-footer>
            <button type="button" z-button zType="outline" z-dialog-close>Cancel</button>
            <button type="button" z-button (click)="save()">Save changes</button>
          </z-dialog-footer>
        </z-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="openDialog()">Edit profile</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogPreviewComponent {
  private readonly dialogService = inject(ZardDialogService);

  readonly visible = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('Samuel Rizzon'),
    username: new FormControl('@samuelrizzondev'),
  });

  save() {
    console.log('Form submitted:', this.form.value);
    this.visible.set(false);
  }

  openDialog() {
    this.dialogService.create({
      zTitle: 'Edit profile',
      zDescription: `Make changes to your profile here. Click save when you're done.`,
      zContent: ZardDemoDialogPreviewContentComponent,
      zData: {
        name: 'Samuel Rizzon',
        username: '@samuelrizzondev',
      } satisfies DialogData,
      zOkText: 'Save changes',
      zOnOk: instance => {
        console.log('Form submitted:', instance.form.value);
      },
    });
  }
}
```

#### popover

## Run the CLI

Use the CLI to add popover to your project.

```
npx zard-cli@latest add popover
```

Floating content container that appears on trigger with customizable positioning and close behavior.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-preview',
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="popoverContent">Open popover</button>

    <ng-template #popoverContent>
      <z-popover class="w-80">
        <div z-popover-header>
          <h4 z-popover-title>Dimensions</h4>
          <p z-popover-description>Set the dimensions for the layer.</p>
        </div>

        <div class="grid gap-2">
          @for (dimension of dimensions; track dimension.id) {
            <div class="grid grid-cols-3 items-center gap-4">
              <label class="text-sm" [attr.for]="dimension.id">{{ dimension.label }}</label>
              <input
                z-input
                type="text"
                class="col-span-2 h-8"
                [id]="dimension.id"
                [value]="dimension.value"
                [attr.aria-label]="dimension.label"
              />
            </div>
          }
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverPreviewComponent {
  readonly dimensions = [
    { id: 'width', label: 'Width', value: '100%' },
    { id: 'maxWidth', label: 'Max. width', value: '300px' },
    { id: 'height', label: 'Height', value: '25px' },
    { id: 'maxHeight', label: 'Max. height', value: 'none' },
  ];
}
```

#### alert-dialog

## Run the CLI

Use the CLI to add alert-dialog to your project.

```
npx zard-cli@latest add alert-dialog
```

Confirmation dialog for critical actions requiring explicit user confirmation with cancel and confirm options.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardAlertDialogService } from '@/shared/components/alert-dialog/alert-dialog.service';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTabsImports } from '@/shared/components/tabs/tabs.imports';

@Component({
  selector: 'z-demo-alert-dialog-preview',
  imports: [ZardAlertDialogImports, ZardButtonComponent, ZardTabsImports],
  template: `
    <z-tab-group>
      <z-tab label="Template">
        <button type="button" z-button zType="outline" (click)="visible.set(true)">Show Dialog</button>

        <z-alert-dialog [(zVisible)]="visible">
          <z-alert-dialog-header>
            <z-alert-dialog-title>Are you absolutely sure?</z-alert-dialog-title>
            <z-alert-dialog-description>
              This action cannot be undone. This will permanently delete your account from our servers.
            </z-alert-dialog-description>
          </z-alert-dialog-header>
          <z-alert-dialog-footer>
            <button type="button" z-button zType="outline" z-alert-dialog-close>Cancel</button>
            <button type="button" z-button (click)="visible.set(false)">Continue</button>
          </z-alert-dialog-footer>
        </z-alert-dialog>
      </z-tab>

      <z-tab label="Service">
        <button type="button" z-button zType="outline" (click)="open()">Show Dialog</button>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAlertDialogPreviewComponent {
  private readonly alertDialogService = inject(ZardAlertDialogService);

  readonly visible = signal(false);

  open() {
    this.alertDialogService.create({
      zTitle: 'Are you absolutely sure?',
      zDescription: 'This action cannot be undone. This will permanently delete your account from our servers.',
      zOkText: 'Continue',
      zCancelText: 'Cancel',
    });
  }
}
```

#### dropdown

## Run the CLI

Use the CLI to add dropdown to your project.

```
npx zard-cli@latest add dropdown
```

Context menu with hierarchical actions, keyboard navigation, and support for nested submenus.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';

@Component({
  selector: 'z-demo-dropdown-basic',
  imports: [ZardDropdownImports, ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" z-dropdown [zDropdownMenu]="menu">Open menu</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-label>My Account</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="log('Profile')">Profile</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Billing')">Billing</z-dropdown-menu-item>
      <z-dropdown-menu-item (click)="log('Team')">Team</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item [disabled]="true">Subscription</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDropdownBasicComponent {
  log(item: string) {
    console.log(`${item} clicked`);
  }
}
```

## May 2025

Comprehensive form controls release! New Select, Checkbox, Radio, Switch, and Slider components with full Angular Reactive Forms integration and ControlValueAccessor support.

### New Components

#### select

## Run the CLI

Use the CLI to add select to your project.

```
npx zard-cli@latest add select
```

Dropdown select with grouped options, multi-select support, keyboard navigation, and custom item rendering.

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-preview',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit">
      <z-select-label>Fruits</z-select-label>
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectPreviewComponent {
  readonly selectedFruit = signal('');
}
```

#### checkbox

## Run the CLI

Use the CLI to add checkbox to your project.

```
npx zard-cli@latest add checkbox
```

Checkbox input component with indeterminate state support and full accessibility features.

Accept terms and conditions

By clicking this checkbox, you agree to the terms.

Enable notifications

Enable notifications You can enable or disable notifications at any time.

```
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-preview',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="min-w-sm">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox" [(ngModel)]="terms" />
        <label z-field-label for="terms-checkbox">Accept terms and conditions</label>
      </div>
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-2" [(ngModel)]="termsWithDesc" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-2">Accept terms and conditions</label>
          <p z-field-description>By clicking this checkbox, you agree to the terms.</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal" data-disabled="true">
        <z-checkbox zId="toggle-checkbox" zDisabled />
        <label z-field-label for="toggle-checkbox">Enable notifications</label>
      </div>
      <label z-field-label for="toggle-checkbox-2">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="toggle-checkbox-2" [(ngModel)]="notifications" />
          <div z-field-content>
            <div z-field-title>Enable notifications</div>
            <p z-field-description>You can enable or disable notifications at any time.</p>
          </div>
        </div>
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxPreviewComponent {
  terms = false;
  termsWithDesc = true;
  notifications = false;
}
```

#### radio-group

## Run the CLI

Use the CLI to add radio-group to your project.

```
npx zard-cli@latest add radio-group
```

Radio button group for mutually exclusive options with customizable layouts and orientation.

Default

Comfortable

Compact

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';

@Component({
  selector: 'z-demo-radio-group-preview',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group [(value)]="selected" class="w-fit">
      <div class="flex items-center gap-3">
        <z-radio zId="r1" value="default" />
        <label z-field-label for="r1">Default</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r2" value="comfortable" />
        <label z-field-label for="r2">Comfortable</label>
      </div>
      <div class="flex items-center gap-3">
        <z-radio zId="r3" value="compact" />
        <label z-field-label for="r3">Compact</label>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupPreviewComponent {
  selected: unknown = 'comfortable';
}
```

#### switch

## Run the CLI

Use the CLI to add switch to your project.

```
npx zard-cli@latest add switch
```

Toggle switch component for boolean settings with smooth animation transitions.

Airplane Mode

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-preview',
  imports: [ZardSwitchComponent],
  template: `
    <z-switch zId="airplane-mode">Airplane Mode</z-switch>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchPreviewComponent {}
```

#### slider

## Run the CLI

Use the CLI to add slider to your project.

```
npx zard-cli@latest add slider
```

Range slider for numeric value selection with min/max bounds, step support, and value display.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '../slider.component';

@Component({
  selector: 'z-demo-slider-preview',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex min-h-50 w-full items-center p-10">
      <z-slider class="mx-auto w-full max-w-xs" [zDefault]="[75]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderPreviewComponent {}
```

## April 2025

Form foundations and CLI launch! New Input and Form components with validation support. Official CLI tool released for easy project initialization and component installation. The Form component has since been discontinued — use Field instead, which covers the same ground and is what the form guides are built on.

### New Components

#### input

## Run the CLI

Use the CLI to add input to your project.

```
npx zard-cli@latest add input
```

Text input field component with multiple variants, sizes, and built-in validation state indicators.

API Key

Your API key is encrypted and stored securely.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-input-preview',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-demo-api-key">API Key</label>
      <input z-input id="input-demo-api-key" type="password" placeholder="sk-..." />
      <p z-field-description>Your API key is encrypted and stored securely.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputPreviewComponent {}
```

## March 2025

🎉 Initial release of ZardUI! An Angular component library built with TailwindCSS v4, featuring standalone components, signal-based reactivity, and modern Angular architecture. Core components including Button, Card, Badge, Alert, and Table.

### New Components

#### button

## Run the CLI

Use the CLI to add button to your project.

```
npx zard-cli@latest add button
```

Versatile button component with multiple variants (primary, secondary, outline, ghost), sizes, and loading states.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../button.component';

@Component({
  selector: 'z-demo-button-default',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button>Button</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoButtonDefaultComponent {}
```

#### card

## Run the CLI

Use the CLI to add card to your project.

```
npx zard-cli@latest add card
```

Container component for grouping related content with optional header, footer, and customizable padding.

Login to your account

Enter your email below to login to your account

Sign up

Email

Password

Forgot your password?

Login

Login with Google

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-card-preview',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <a z-button zType="link" href="#">Sign up</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-login-email">Email</label>
            <input z-input id="card-login-email" type="email" placeholder="m@example.com" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-login-password">Password</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input z-input id="card-login-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardPreviewComponent {}
```

#### badge

## Run the CLI

Use the CLI to add badge to your project.

```
npx zard-cli@latest add badge
```

Small label component for displaying status, categories, counts, or tags with various color variants.

Badge

Secondary

Destructive

Outline

Ghost

Link

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '../badge.component';

@Component({
  selector: 'z-demo-badge-variants',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full flex-wrap gap-2">
        <z-badge>Badge</z-badge>
        <z-badge zType="secondary">Secondary</z-badge>
        <z-badge zType="destructive">Destructive</z-badge>
        <z-badge zType="outline">Outline</z-badge>
        <z-badge zType="ghost">Ghost</z-badge>
        <z-badge zType="link">Link</z-badge>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBadgeVariantsComponent {}
```

#### alert

## Run the CLI

Use the CLI to add alert to your project.

```
npx zard-cli@latest add alert
```

Notification component for displaying important information to users with different severity levels.

Payment successful

Your payment of $29.99 has been processed. A receipt has been sent to your email address.

New feature available

We've added dark mode support. You can enable it in your account settings.

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';

@Component({
  selector: 'z-demo-alert-basic',
  imports: [ZardAlertComponent],
  template: `
    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zIcon="lucideCircleCheck"
        zTitle="Payment successful"
        zDescription="Your payment of $29.99 has been processed. A receipt has been sent to your email address."
      />

      <z-alert
        zIcon="lucideInfo"
        zTitle="New feature available"
        zDescription="We've added dark mode support. You can enable it in your account settings."
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo })],
})
export class ZardDemoAlertBasicComponent {}
```

#### table

## Run the CLI

Use the CLI to add table to your project.

```
npx zard-cli@latest add table
```

Data table component with sorting, filtering, pagination, and customizable column rendering.

| Name | Age | Address |
| --- | --- | --- |
| John Brown | 32 | New York No. 1 Lake Park |
| Jim Green | 42 | London No. 1 Lake Park |
| Joe Black | 32 | Sidney No. 1 Lake Park |

```
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of registered users.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Name</th>
          <th z-table-head scope="col">Age</th>
          <th z-table-head scope="col">Address</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableSimpleComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
```
