import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

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
  template: '<ng-content />',
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

  protected readonly classes = computed(() => mergeClasses(messageHeaderVariants(), this.class()));
}

@Component({
  selector: 'z-message-footer, [z-message-footer]',
  template: '<ng-content />',
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
  template: `
    <ng-content select="z-message-avatar, [z-message-avatar]" />
    <ng-content />
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

  protected readonly classes = computed(() => mergeClasses(messageVariants(), this.class()));
}
