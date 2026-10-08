import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  buttonVariants,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from '@/shared/components/button/button.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  attachmentVariants,
  attachmentMediaVariants,
  attachmentContentVariants,
  attachmentTitleVariants,
  attachmentDescriptionVariants,
  attachmentActionsVariants,
  attachmentActionVariants,
  attachmentTriggerVariants,
  attachmentGroupVariants,
  type ZardAttachmentStateVariants,
  type ZardAttachmentSizeVariants,
  type ZardAttachmentOrientationVariants,
  type ZardAttachmentMediaVariantVariants,
} from './attachment.variants';

@Component({
  selector: 'z-attachment, [z-attachment]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'attachment',
    '[class]': 'classes()',
    '[attr.data-state]': 'zState()',
    '[attr.data-size]': 'zSize()',
    '[attr.data-orientation]': 'zOrientation()',
    '[attr.aria-busy]': 'busy() ? "true" : null',
  },
  exportAs: 'zAttachment',
})
export class ZardAttachmentComponent {
  readonly class = input<ClassValue>('');
  readonly zState = input<ZardAttachmentStateVariants>('done');
  readonly zSize = input<ZardAttachmentSizeVariants>('default');
  readonly zOrientation = input<ZardAttachmentOrientationVariants>('horizontal');

  readonly busy = computed(() => this.zState() === 'uploading' || this.zState() === 'processing');
  protected readonly classes = computed(() =>
    mergeClasses(
      attachmentVariants({ zState: this.zState(), zSize: this.zSize(), zOrientation: this.zOrientation() }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'z-attachment-media, [z-attachment-media]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-media', '[class]': 'classes()', '[attr.data-variant]': 'zVariant()' },
  exportAs: 'zAttachmentMedia',
})
export class ZardAttachmentMediaComponent {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardAttachmentMediaVariantVariants>('icon');
  protected readonly classes = computed(() =>
    mergeClasses(attachmentMediaVariants({ zVariant: this.zVariant() }), this.class()),
  );
}

@Component({
  selector: 'z-attachment-content, [z-attachment-content]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-content', '[class]': 'classes()' },
  exportAs: 'zAttachmentContent',
})
export class ZardAttachmentContentComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentContentVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-title, [z-attachment-title]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-title', '[class]': 'classes()' },
  exportAs: 'zAttachmentTitle',
})
export class ZardAttachmentTitleComponent {
  private readonly attachment = inject(ZardAttachmentComponent, { optional: true });
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(attachmentTitleVariants(), this.attachment?.busy() && 'motion-safe:animate-pulse', this.class()),
  );
}

@Component({
  selector: 'z-attachment-description, [z-attachment-description]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-description', '[class]': 'classes()' },
  exportAs: 'zAttachmentDescription',
})
export class ZardAttachmentDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-actions, [z-attachment-actions]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { 'data-slot': 'attachment-actions', '[class]': 'classes()' },
  exportAs: 'zAttachmentActions',
})
export class ZardAttachmentActionsComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentActionsVariants(), this.class()));
}

@Component({
  selector: 'button[z-attachment-action], a[z-attachment-action]',
  imports: [NgIcon],
  template: `
    @if (zLoading()) {
      <ng-icon name="lucideLoaderCircle" class="animate-spin duration-2000" />
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideLoaderCircle })],
  host: {
    'data-slot': 'attachment-action',
    '[class]': 'classes()',
    '[attr.role]': 'null',
    '[attr.tabindex]': 'isLink && disabledState() ? -1 : tabindex()',
    '[attr.disabled]': '!isLink && disabledState() ? "" : null',
    '[attr.aria-disabled]': 'disabledState() ? "true" : null',
    '[attr.data-disabled]': 'disabledState() || null',
    '[attr.type]': 'isLink ? null : type()',
  },
  exportAs: 'zAttachmentAction',
})
export class ZardAttachmentActionComponent extends ZardButtonComponent {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly renderer = inject(Renderer2);
  protected readonly isLink = this.host.tagName === 'A';
  override readonly zType = input<ZardButtonTypeVariants>('ghost');
  override readonly zSize = input<ZardButtonSizeVariants>('icon-xs');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly tabindex = input<string | number | null>(null);
  protected readonly disabledState = computed(() => this.zDisabled() || this.disabled());

  protected override readonly classes = computed(() =>
    mergeClasses(
      buttonVariants({
        zType: this.zType(),
        zSize: this.zSize(),
        zShape: this.zShape(),
        zLoading: this.zLoading(),
        zDisabled: this.disabledState(),
      }),
      attachmentActionVariants(),
      this.class(),
    ),
  );

  // Capture precedes Angular's coalesced consumer listeners.
  private readonly removeClickListener = this.renderer.listen(
    this.host,
    'click',
    (event: MouseEvent) => this.onClick(event),
    { capture: true },
  );

  private readonly removeKeyListener = this.renderer.listen(
    this.host,
    'keydown',
    (event: KeyboardEvent) => this.onKeyDown(event),
    { capture: true },
  );

  override ngOnDestroy(): void {
    this.removeClickListener();
    this.removeKeyListener();
    super.ngOnDestroy();
  }

  onClick(event: MouseEvent): void {
    if (this.disabledState()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabledState() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

@Directive({
  selector: 'button[z-attachment-trigger], a[z-attachment-trigger]',
  host: {
    'data-slot': 'attachment-trigger',
    '[class]': 'classes()',
    '[attr.type]': 'isLink ? null : type()',
  },
  exportAs: 'zAttachmentTrigger',
})
export class ZardAttachmentTriggerDirective {
  protected readonly isLink = inject(ElementRef<HTMLElement>).nativeElement.tagName === 'A';
  readonly class = input<ClassValue>('');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  protected readonly classes = computed(() => mergeClasses(attachmentTriggerVariants(), this.class()));
}

@Component({
  selector: 'z-attachment-group, [z-attachment-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'attachment-group',
    role: 'group',
    tabindex: '0',
    '[class]': 'classes()',
    '(keydown)': 'onKeyDown($event)',
  },
  exportAs: 'zAttachmentGroup',
})
export class ZardAttachmentGroupComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(attachmentGroupVariants(), this.class()));

  onKeyDown(event: KeyboardEvent): void {
    const host = this.elementRef.nativeElement;
    if (
      event.target !== host ||
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (!host.children.length || host.clientWidth <= 0 || host.scrollWidth <= host.clientWidth) return;
    event.preventDefault();
    host.scrollBy({ left: event.key === 'ArrowRight' ? host.clientWidth : -host.clientWidth, behavior: 'auto' });
  }
}
