---
title: Prompt Input
description: A message field with attachments and a send button.
---

# Prompt Input

A message field with attachments and a send button.

```
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideChevronDown, lucideFileText, lucidePlus, lucideX } from '@ng-icons/lucide';

import { ZardAttachmentImports } from '@/shared/components/attachment/attachment.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

interface AttachmentFile {
  id: number;
  name: string;
}

const PROVIDERS = [
  {
    name: 'OpenAI',
    models: [
      { id: 'gpt-5', name: 'GPT-5' },
      { id: 'gpt-5-mini', name: 'GPT-5 mini' },
    ],
  },
  {
    name: 'Anthropic',
    models: [
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5' },
    ],
  },
];
const MODELS = PROVIDERS.flatMap(provider => provider.models);
const EFFORTS = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
];

let nextFileId = 0;

@Component({
  selector: 'z-ai-elements-prompt-input',
  imports: [NgIcon, ZardTextareaComponent, ...ZardAttachmentImports, ...ZardDropdownImports, ...ZardInputGroupImports],
  template: `
    <div class="mx-auto w-full max-w-lg py-6">
      <form (submit)="$event.preventDefault(); submit()">
        <input
          #fileInput
          type="file"
          multiple
          class="sr-only"
          tabindex="-1"
          aria-label="Attach files"
          (change)="attach(fileInput)"
        />

        <z-input-group>
          @if (files().length) {
            <z-input-group-addon zAlign="block-start" class="flex-wrap">
              @for (file of files(); track file.id) {
                <z-attachment zSize="sm">
                  <z-attachment-media><ng-icon name="lucideFileText" /></z-attachment-media>
                  <z-attachment-content>
                    <z-attachment-title>{{ file.name }}</z-attachment-title>
                  </z-attachment-content>
                  <z-attachment-actions>
                    <button
                      type="button"
                      z-attachment-action
                      [attr.aria-label]="'Remove ' + file.name"
                      (click)="remove(file.id)"
                    >
                      <ng-icon name="lucideX" />
                    </button>
                  </z-attachment-actions>
                </z-attachment>
              }
            </z-input-group-addon>
          }

          <textarea
            z-textarea
            class="p-3"
            aria-label="Message"
            placeholder="Ask the agent to change your code..."
            [value]="text()"
            (input)="text.set($any($event.target).value)"
            (keydown.enter)="onEnter($any($event))"
          ></textarea>

          <z-input-group-addon zAlign="block-end">
            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="icon-sm"
              class="rounded-full"
              aria-label="Attach files"
              (click)="fileInput.click()"
            >
              <ng-icon name="lucidePlus" />
            </button>

            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="sm"
              class="ms-auto"
              [attr.aria-label]="'Model: ' + currentModel().name"
              z-dropdown
              [zDropdownMenu]="modelMenu"
            >
              {{ currentModel().name }}
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #modelMenu="zDropdownMenuContent" class="w-48">
              <z-dropdown-menu-radio-group [(zValue)]="model">
                @for (provider of providers; track provider.name; let first = $first) {
                  @if (!first) {
                    <z-dropdown-menu-separator />
                  }
                  <z-dropdown-menu-label>{{ provider.name }}</z-dropdown-menu-label>
                  @for (item of provider.models; track item.id) {
                    <z-dropdown-menu-radio-item [zValue]="item.id">{{ item.name }}</z-dropdown-menu-radio-item>
                  }
                }
              </z-dropdown-menu-radio-group>
            </z-dropdown-menu-content>

            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="sm"
              [attr.aria-label]="'Effort: ' + currentEffort().name"
              z-dropdown
              [zDropdownMenu]="effortMenu"
            >
              <span class="text-muted-foreground">Effort</span>
              {{ currentEffort().name }}
              <ng-icon name="lucideChevronDown" />
            </button>
            <z-dropdown-menu-content #effortMenu="zDropdownMenuContent" class="w-36">
              <z-dropdown-menu-label>Effort</z-dropdown-menu-label>
              <z-dropdown-menu-radio-group [(zValue)]="effort">
                @for (item of efforts; track item.id) {
                  <z-dropdown-menu-radio-item [zValue]="item.id">{{ item.name }}</z-dropdown-menu-radio-item>
                }
              </z-dropdown-menu-radio-group>
            </z-dropdown-menu-content>

            <button
              type="submit"
              z-input-group-button
              zVariant="default"
              zSize="icon-sm"
              class="rounded-full"
              aria-label="Send"
              [disabled]="!canSend()"
            >
              <ng-icon name="lucideArrowUp" />
            </button>
          </z-input-group-addon>
        </z-input-group>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideChevronDown, lucideFileText, lucidePlus, lucideX })],
  host: { class: 'contents' },
})
export class ZardAiElementsPromptInputComponent {
  protected readonly providers = PROVIDERS;
  protected readonly efforts = EFFORTS;

  protected readonly text = signal('');
  protected readonly files = signal<AttachmentFile[]>([]);
  protected readonly model = signal(MODELS[0].id);
  protected readonly effort = signal(EFFORTS[1].id);

  protected readonly currentModel = computed(() => MODELS.find(item => item.id === this.model()) ?? MODELS[0]);
  protected readonly currentEffort = computed(() => EFFORTS.find(item => item.id === this.effort()) ?? EFFORTS[1]);
  protected readonly canSend = computed(() => this.text().trim().length > 0);

  /** Send the text, the files, the model and the effort to your agent here. */
  protected submit(): void {
    if (!this.canSend()) return;
    this.text.set('');
    this.files.set([]);
  }

  /** Enter sends, Shift+Enter adds a line. */
  protected onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();
    this.submit();
  }

  protected attach(input: HTMLInputElement): void {
    const selected = Array.from(input.files ?? [], file => ({ id: nextFileId++, name: file.name }));
    this.files.update(files => [...files, ...selected]);
    // Lets the person pick the same file again.
    input.value = '';
  }

  protected remove(id: number): void {
    this.files.update(files => files.filter(file => file.id !== id));
  }
}
```

Prompt Input is the field the person types into to message the agent. It is an [Input Group](/docs/components/input-group) with a textarea, an attach button, the [Model Selector](/docs/ai-elements/model-selector) menus and a send button. Attached files show as [Attachment](/docs/components/attachment) chips above the text.

## Installation

Prompt Input is built with [Input Group](/docs/components/input-group), [Attachment](/docs/components/attachment) and [Dropdown](/docs/components/dropdown). Add them with the CLI:

```
npx zard-cli add input-group attachment dropdown
```

Then copy the code of the example into your project and adapt it. There is no package to install: the pattern is yours. To install a component by hand, follow the Manual tab on its page.

## Usage

```
import { ZardAttachmentImports } from '@/shared/components/attachment/attachment.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';
```

```
<form (submit)="$event.preventDefault(); submit()">
  <z-input-group>
    <textarea
      z-textarea
      class="p-3"
      placeholder="Ask the agent to change your code..."
      [value]="text()"
      (input)="text.set($any($event.target).value)"
    ></textarea>
    <z-input-group-addon zAlign="block-end">
      <button
        type="button"
        z-input-group-button
        zVariant="outline"
        zSize="icon-sm"
        class="rounded-full"
        aria-label="Attach files"
        (click)="fileInput.click()"
      >
        <ng-icon name="lucidePlus" />
      </button>
      <button
        type="submit"
        z-input-group-button
        zVariant="default"
        zSize="icon-sm"
        class="ms-auto rounded-full"
        aria-label="Send"
        [disabled]="!canSend()"
      >
        <ng-icon name="lucideArrowUp" />
      </button>
    </z-input-group-addon>
  </z-input-group>
</form>
```

## Attachments

The attach button opens a hidden file input. Show each file as a `z-attachment` in an addon with `zAlign="block-start"`, with a button to remove it.

## Model and Effort

Put the two [Model Selector](/docs/ai-elements/model-selector) menus in the `block-end` addon, between the attach and send buttons. Move `ms-auto` from the send button to the first menu trigger, so both menus sit next to the send button.

## Keyboard

Enter sends the message. Shift+Enter adds a new line.

```
<textarea z-textarea (keydown.enter)="onEnter($any($event))"></textarea>
```

```
/** Enter sends, Shift+Enter adds a line. */
protected onEnter(event: KeyboardEvent): void {
  if (event.shiftKey) return;
  event.preventDefault();
  this.submit();
}
```

## Streaming

Send the text and the files from the file input.

```
protected submit(): void {
  this.agent.send({ text: this.text(), files: this.fileInput().nativeElement.files });
}
```

## API Reference

Prompt Input has no API of its own. See the API of the components it is built with:

- [Input Group](/docs/components/input-group#api)
- [Attachment](/docs/components/attachment#api)
- [Dropdown](/docs/components/dropdown#api)
