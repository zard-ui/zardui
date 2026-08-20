---
title: Message
description: Displays a message in a conversation, with optional avatar, header, footer, and alignment.
---

# Message

Displays a message in a conversation, with optional avatar, header, footer, and alignment.

## Installation

### CLI

```bash
npx zard-cli@latest add message
```

### Manual

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import type { SafeUrl } from '@angular/platform-browser';

import type { ClassValue } from 'clsx';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardBubbleComponent } from '@/shared/components/bubble/bubble.component';
import type { ZardBubbleVariantVariants } from '@/shared/components/bubble/bubble.variants';
import { ZardStringTemplateOutletDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  messageAvatarVariants,
  messageContentVariants,
  messageFooterVariants,
  messageGroupVariants,
  messageHeaderVariants,
  messageVariants,
  type ZardMessageAlignVariants,
} from './message.variants';

@Component({
  selector: 'z-message-group, [z-message-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-group',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageGroup',
})
export class ZardMessageGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(messageGroupVariants(), this.class()));
}

@Component({
  selector: 'z-message-avatar, [z-message-avatar]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-avatar',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageAvatar',
})
export class ZardMessageAvatarComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(messageAvatarVariants(), this.class()));
}

@Component({
  selector: 'z-message-header, [z-message-header]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let header = zHeader();
    @if (header) {
      <ng-container *zStringTemplateOutlet="header">{{ header }}</ng-container>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-header',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageHeader',
})
export class ZardMessageHeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeader = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(messageHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-message-footer, [z-message-footer]',
  imports: [ZardStringTemplateOutletDirective],
  template: `
    @let footer = zFooter();
    @if (footer) {
      <ng-container *zStringTemplateOutlet="footer">{{ footer }}</ng-container>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageFooter',
})
export class ZardMessageFooterComponent {
  readonly class = input<ClassValue>('');
  readonly zFooter = input<string | TemplateRef<void>>();

  protected readonly classes = computed(() => mergeClasses(messageFooterVariants(), this.class()));
}

@Component({
  selector: 'z-message-content, [z-message-content]',
  /**
   * The header comes first and the footer last whatever order they are written in,
   * so the reading order stays avatar → header → surface → footer even when the
   * template puts the footer next to the bubble it belongs to.
   */
  template: `
    <ng-content select="z-message-header, [z-message-header]" />
    <ng-content />
    <ng-content select="z-message-footer, [z-message-footer]" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message-content',
    '[class]': 'classes()',
  },
  exportAs: 'zMessageContent',
})
export class ZardMessageContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(messageContentVariants(), this.class()));
}

@Component({
  selector: 'z-message, [z-message]',
  imports: [
    ZardAvatarComponent,
    ZardBubbleComponent,
    ZardMessageAvatarComponent,
    ZardMessageContentComponent,
    ZardMessageFooterComponent,
    ZardMessageHeaderComponent,
  ],
  template: `
    <ng-content select="z-message-avatar, [z-message-avatar]" />
    @if (!hasAvatar() && (zSrc() || zFallback())) {
      <z-message-avatar>
        <z-avatar [zSrc]="zSrc()" [zAlt]="zAlt()" [zFallback]="zFallback()" />
      </z-message-avatar>
    }

    <ng-content select="z-message-content, [z-message-content]" />
    @if (!hasContent()) {
      <z-message-content>
        @if (zHeader()) {
          <z-message-header [zHeader]="zHeader()" />
        }
        <z-bubble [zVariant]="zVariant()">
          <ng-content />
        </z-bubble>
        @if (zFooter()) {
          <z-message-footer [zFooter]="zFooter()" />
        }
      </z-message-content>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'message',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
  },
  exportAs: 'zMessage',
})
export class ZardMessageComponent {
  readonly class = input<ClassValue>('');
  readonly zAlign = input<ZardMessageAlignVariants>('start');

  /**
   * Shorthand inputs. A message with no projected `z-message-content` builds the
   * whole turn itself — content wrapper, bubble, header and footer — so the common
   * case is one tag. Project the content and the row goes back to being pure
   * layout: `zVariant`, `zHeader` and `zFooter` belong to the surface it would
   * have rendered, so they no longer apply.
   *
   * The avatar is a separate slot: `zSrc` / `zFallback` work either way, and a
   * projected `z-message-avatar` always wins over them.
   */
  readonly zVariant = input<ZardBubbleVariantVariants>('default');
  readonly zSrc = input<string | SafeUrl>('');
  readonly zAlt = input<string>('');
  readonly zFallback = input<string>('');
  readonly zHeader = input<string | TemplateRef<void>>();
  readonly zFooter = input<string | TemplateRef<void>>();

  private readonly projectedAvatar = contentChild(ZardMessageAvatarComponent, { descendants: false });
  private readonly projectedContent = contentChild(ZardMessageContentComponent, { descendants: false });

  protected readonly hasAvatar = computed(() => !!this.projectedAvatar());
  protected readonly hasContent = computed(() => !!this.projectedContent());
  protected readonly classes = computed(() => mergeClasses(messageVariants(), this.class()));
}
```

```angular-ts
import { cva } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const messageGroupVariants = cva('flex min-w-0 flex-col gap-2');

export const messageVariants = cva(
  mergeClasses('group/message relative flex w-full min-w-0 gap-2 text-sm', 'data-[align=end]:flex-row-reverse'),
);

export const messageAvatarVariants = cva(
  mergeClasses(
    'flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted',
    'group-has-data-[slot=message-footer]/message:-translate-y-8',
  ),
);

export const messageContentVariants = cva(
  mergeClasses(
    'flex w-full min-w-0 flex-col gap-2.5 wrap-break-word',
    'group-data-[align=end]/message:*:data-slot:self-end',
  ),
);

/**
 * A ghost bubble has no surface of its own, so the header and footer drop the
 * padding that would otherwise indent them against it. The `has()` is scoped to
 * the bubble slot on purpose: `z-button` also reflects its type on
 * `data-variant`, and a ghost action button in the footer must not flatten the
 * padding of the whole row.
 */
const messageMetaVariants = mergeClasses(
  'flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground',
  'group-has-[[data-slot=bubble][data-variant=ghost]]/message:px-0',
);

export const messageHeaderVariants = cva(messageMetaVariants);

export const messageFooterVariants = cva(
  mergeClasses(messageMetaVariants, 'group-data-[align=end]/message:justify-end'),
);

export type ZardMessageAlignVariants = 'start' | 'end';
```

```angular-ts
export * from './message.component';
export * from './message.imports';
export * from './message.variants';
```

```angular-ts
export {
  ZardMessageAvatarComponent,
  ZardMessageComponent,
  ZardMessageContentComponent,
  ZardMessageFooterComponent,
  ZardMessageGroupComponent,
  ZardMessageHeaderComponent,
} from './message.component';

import {
  ZardMessageAvatarComponent,
  ZardMessageComponent,
  ZardMessageContentComponent,
  ZardMessageFooterComponent,
  ZardMessageGroupComponent,
  ZardMessageHeaderComponent,
} from './message.component';

export const ZardMessageImports = [
  ZardMessageGroupComponent,
  ZardMessageComponent,
  ZardMessageAvatarComponent,
  ZardMessageContentComponent,
  ZardMessageHeaderComponent,
  ZardMessageFooterComponent,
] as const;
```

## Usage

```angular-ts
import { ZardMessageImports } from '@/shared/components/message/message.imports';
```

```angular-html
<z-message zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zVariant="muted">
  How can I help you today?
</z-message>
```

## Examples

### Default

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-default',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Deploying to prod real quick.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>It's 4:55 PM. On a Friday.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>It's a one-line change.</z-bubble-content>
          </z-bubble>
          <z-message-footer>Delivered</z-message-footer>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble-group>
            <z-bubble zVariant="muted">
              <z-bubble-content>It's always a one-line change 😭.</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="muted">
              <z-bubble-content>Alright, let me take a look.</z-bubble-content>
              <z-bubble-reactions role="img" aria-label="Reactions: thumbs up">
                <span>👍</span>
              </z-bubble-reactions>
            </z-bubble>
          </z-bubble-group>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageDefaultComponent {}
```

### Avatar

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-avatar',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>The build failed during dependency installation.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Can you share the exact error?</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble-group>
            <z-bubble zVariant="muted">
              <z-bubble-content>Here's the error from the logs</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="muted">
              <z-bubble-content>
                Something went wrong with the build. The libraries are not installed correctly. Try running the build
                again.
              </z-bubble-content>
            </z-bubble>
          </z-bubble-group>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageAvatarComponent {}
```

### Group

```angular-ts
import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-group',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message-group>
        <z-message>
          <z-message-avatar />
          <z-message-content>
            <z-bubble zVariant="muted">
              <z-bubble-content>I checked the registry addresses.</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
        <z-message>
          <z-message-avatar>
            <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
          </z-message-avatar>
          <z-message-content>
            <z-bubble zVariant="muted">
              <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
      </z-message-group>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageGroupComponent {}
```

### Header Footer

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-header-footer',
  imports: [...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message>
        <z-message-content>
          <z-message-header>Olivia</z-message-header>
          <z-bubble zVariant="muted">
            <z-bubble-content>I already checked the logs.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Send the report to the team. Ping &#64;srizzon if you need help.</z-bubble-content>
          </z-bubble>
          <z-message-footer>
            <div>
              Read
              <span class="font-normal">Yesterday</span>
            </div>
          </z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageHeaderFooterComponent {}
```

### Actions

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-actions',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>The install failure is coming from the workspace package.</z-bubble-content>
          </z-bubble>
          <z-message-footer>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Copy" title="Copy">
              <ng-icon name="lucideCopy" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Like" title="Like">
              <ng-icon name="lucideThumbsUp" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Dislike" title="Dislike">
              <ng-icon name="lucideThumbsDown" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Okay drop me a link. Taking a look...</z-bubble-content>
          </z-bubble>
          <z-message-footer class="gap-2">
            <span class="text-destructive font-normal">Failed to send</span>
            <button type="button" z-button zType="ghost" zSize="icon-xs" aria-label="Retry" title="Retry">
              <ng-icon name="lucideRefreshCcw" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCopy, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp })],
  host: { class: 'contents' },
})
export class ZardDemoMessageActionsComponent {}
```

### Attachment

```angular-ts
import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileText } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-attachment',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardItemImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message zAlign="end">
        <z-message-content>
          <z-item zVariant="outline" class="w-fit rounded-2xl p-1.5">
            <z-item-media zVariant="image" class="size-24 rounded-xl">
              <img src="/images/github_banner.png" alt="Cover page" />
            </z-item-media>
          </z-item>
          <z-bubble>
            <z-bubble-content>Here's the image. Can you add it to the PDF? Use it for the cover page.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>Done. Here's the PDF with the image added as the cover page.</z-bubble-content>
          </z-bubble>
          <z-item zVariant="muted" class="w-fit rounded-2xl">
            <z-item-media zVariant="icon" class="bg-background size-9 rounded-xl">
              <ng-icon name="lucideFileText" />
            </z-item-media>
            <z-item-content>
              <z-item-title>sales-dashboard.pdf</z-item-title>
              <z-item-description>PDF · 2.4 MB</z-item-description>
            </z-item-content>
            <z-item-actions>
              <button
                type="button"
                z-button
                zType="secondary"
                zSize="icon-sm"
                zShape="circle"
                aria-label="Download"
                title="Download"
              >
                <ng-icon name="lucideDownload" />
              </button>
            </z-item-actions>
          </z-item>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Thanks. Looks good.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
    </div>
  `,
  viewProviders: [provideIcons({ lucideDownload, lucideFileText })],
  host: { class: 'contents' },
})
export class ZardDemoMessageAttachmentComponent {}
```

### Shorthand

```angular-ts
import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-shorthand',
  imports: [...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zVariant="muted">
        How can I help you today?
      </z-message>

      <z-message zAlign="end" zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFooter="Delivered">
        Send me the release notes.
      </z-message>

      <z-message zFallback="OL" zVariant="muted" zHeader="Olivia" zFooter="Read Yesterday">
        The notes are in the shared doc.
      </z-message>

      <z-message zAlign="end" zSrc="https://github.com/srizzon.png" zAlt="@srizzon">
        <z-message-content>
          <z-bubble zVariant="outline">
            <z-bubble-content>Project the content when the turn needs more than a bubble.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageShorthandComponent {}
```

## API Reference

### z-message

The message row wrapper. It owns the avatar, alignment, header and footer around the message surface.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zAlign]` | The alignment of the message in the conversation. | `start \| end` | `start` |
| `[zSrc]` | Avatar image of the sender. Renders the avatar slot for you; a projected z-message-avatar wins over it. | `string \| SafeUrl` | `-` |
| `[zAlt]` | Alternative text of the shorthand avatar image. | `string` | `-` |
| `[zFallback]` | Initials shown while the shorthand avatar has no image, or instead of one. | `string` | `-` |
| `[zHeader]` | Content above the turn, such as a sender name. Only applies to the shorthand. | `string \| TemplateRef<void>` | `-` |
| `[zFooter]` | Content below the turn, such as a delivery status. Only applies to the shorthand. | `string \| TemplateRef<void>` | `-` |
| `[zVariant]` | Variant of the bubble the shorthand renders. Ignored once the content is projected. | `default \| secondary \| muted \| tinted \| outline \| ghost \| destructive` | `default` |
| `[class]` | Additional classes to apply to the row. | `ClassValue` | `-` |

### z-message-avatar

The avatar slot, aligned to the bottom of the message. When the message has a z-message-footer, the avatar shifts up to stay aligned with the message surface instead of the footer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional classes to apply to the avatar slot. | `ClassValue` | `-` |

### z-message-content

Wraps the header, message surface and footer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional classes to apply to the content slot. | `ClassValue` | `-` |

### z-message-header

Displays content above the message, such as a sender name. Stays aligned to the start regardless of zAlign.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zHeader]` | Header content, as an alternative to projecting it. | `string \| TemplateRef<void>` | `-` |
| `[class]` | Additional classes to apply to the header. | `ClassValue` | `-` |

### z-message-footer

Displays content below the message, such as status or actions. Aligns to the message side.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zFooter]` | Footer content, as an alternative to projecting it. | `string \| TemplateRef<void>` | `-` |
| `[class]` | Additional classes to apply to the footer. | `ClassValue` | `-` |

### z-message-group

Groups consecutive messages from the same sender.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional classes to apply to the group root. | `ClassValue` | `-` |

---

[Open in browser](https://zardui.com/docs/components/message)
