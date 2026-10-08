import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  ViewEncapsulation,
} from '@angular/core';
import type { SafeUrl } from '@angular/platform-browser';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  avatarVariants,
  avatarBadgeVariants,
  fallbackVariants,
  imageVariants,
  type ZardAvatarSizeVariants,
} from './avatar.variants';

/** Rendered `<img>` size (px) per `zSize`, matching `size-6`/`size-8`/`size-10` in `avatarVariants`. */
const AVATAR_IMAGE_SIZE: Record<ZardAvatarSizeVariants, number> = {
  sm: 24,
  default: 32,
  lg: 40,
};

@Component({
  selector: 'z-avatar, [z-avatar]',
  imports: [NgIcon],
  template: `
    @if (zFallback()) {
      <span [class]="fallbackClasses()" [attr.aria-hidden]="imageLoaded() ? 'true' : null">
        {{ zFallback() }}
      </span>
    }

    @if (zSrc() && !imageError()) {
      <img
        [width]="imgSize()"
        [height]="imgSize()"
        [alt]="zAlt()"
        [class]="imgClasses()"
        [src]="imgSrc()"
        [attr.fetchpriority]="zPriority() ? 'high' : 'auto'"
        loading="eager"
        decoding="async"
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

  // Keyed on zSrc so a source change resets synchronously — no stale frame between sources.
  protected readonly imageError = linkedSignal(() => {
    this.zSrc();
    return false;
  });

  protected readonly imageLoaded = linkedSignal(() => {
    this.zSrc();
    return false;
  });

  protected readonly avatarClasses = computed(() =>
    mergeClasses(avatarVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly fallbackClasses = computed(() => fallbackVariants());

  protected readonly badgeClasses = computed(() => mergeClasses(avatarBadgeVariants, this.zBadgeClass()));

  protected readonly imgSize = computed(() => AVATAR_IMAGE_SIZE[this.zSize()]);

  // `HTMLImageElement.src` is typed `string`; `SafeUrl` type-checks against `[ngSrc]` via
  // `NgOptimizedImage.ngAcceptInputType_ngSrc`, but a plain `<img [src]>` has no such escape
  // hatch under strictTemplates. The runtime binding still goes through Angular's URL
  // sanitizer/SafeValue unwrapping regardless of this compile-time assertion.
  protected readonly imgSrc = computed(() => this.zSrc() as string);

  protected readonly imgClasses = computed(() =>
    mergeClasses(imageVariants({ zSize: this.zSize() }), this.imageLoaded() && 'opacity-100'),
  );

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
    this.imageError.set(false);
  }

  protected onImageError(): void {
    this.imageError.set(true);
    this.imageLoaded.set(false);
  }
}
