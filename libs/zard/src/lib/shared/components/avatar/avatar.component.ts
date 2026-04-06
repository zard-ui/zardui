import { NgOptimizedImage } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import type { SafeUrl } from '@angular/platform-browser';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  avatarVariants,
  badgeVariants,
  fallbackVariants,
  imageVariants,
  type ZardAvatarSizeVariants,
} from './avatar.variants';

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgOptimizedImage, NgIcon],
  template: `
    @if (zFallback() && (!zSrc() || !imageLoaded())) {
      <span [class]="fallbackClasses()">
        {{ zFallback() }}
      </span>
    }

    @if (zSrc() && !imageError()) {
      <img
        [width]="32"
        [height]="32"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [ngSrc]="zSrc()"
        [priority]="zPriority()"
        (error)="onImageError()"
        (load)="onImageLoad()"
      />
    }

    @if (zShowBadge()) {
      <div [class]="badgeClasses()">
        @if (zBadgeIcon()) {
          <ng-icon [name]="zBadgeIcon()" size="8" />
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'avatarClasses()',
    '[attr.data-slot]': '"avatar"',
    '[attr.data-size]': 'zSize()',
  },
  exportAs: 'zAvatar',
})
export class ZardAvatarComponent {
  readonly class = input<ClassValue>('');
  readonly zAlt = input<string>('');
  readonly zBadgeClass = input<ClassValue>('');
  readonly zBadgeIcon = input<string>('');
  readonly zFallback = input<string>('');
  readonly zPriority = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardAvatarSizeVariants>('default');
  readonly zSrc = input<string | SafeUrl>('');
  readonly zShowBadge = input(false, { transform: booleanAttribute });

  protected readonly imageError = signal(false);
  protected readonly imageLoaded = signal(false);

  constructor() {
    effect(() => {
      // Reset image state when zSrc changes
      this.zSrc();
      this.imageError.set(false);
      this.imageLoaded.set(false);
    });
  }

  protected readonly avatarClasses = computed(() =>
    mergeClasses(avatarVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly fallbackClasses = computed(() => fallbackVariants());

  protected readonly badgeClasses = computed(() => mergeClasses(badgeVariants, this.zBadgeClass()));

  protected readonly imgClasses = computed(() => imageVariants({ zSize: this.zSize() }));

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  protected onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
