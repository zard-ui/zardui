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
