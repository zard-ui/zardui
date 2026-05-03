import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  inputGroupTextVariants,
  inputGroupVariants,
  type ZardInputGroupAddonAlignVariants,
  type ZardInputGroupButtonSizeVariants,
  type ZardInputGroupButtonVariantVariants,
} from './input-group.variants';
import { ZardInputComponent } from '../input/input.component';
import { ZardTextareaComponent } from '../textarea/textarea.component';

@Component({
  selector: 'z-input-group, [z-input-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'input-group',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroup',
})
export class ZardInputGroupComponent {
  readonly class = input<ClassValue>('');

  private readonly contentInput = contentChild(ZardInputComponent);
  private readonly contentTextarea = contentChild(ZardTextareaComponent);

  protected readonly classes = computed(() => mergeClasses(inputGroupVariants(), this.class()));

  constructor() {
    effect(() => {
      this.contentInput()?.setDataSlot('input-group-control');
      this.contentTextarea()?.setDataSlot('input-group-control');
    });
  }
}

@Component({
  selector: 'z-input-group-addon, [z-input-group-addon]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'input-group-addon',
    '[attr.data-align]': 'zAlign()',
    '[class]': 'classes()',
    '(click)': 'onClick($event)',
  },
  exportAs: 'zInputGroupAddon',
})
export class ZardInputGroupAddonComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<ClassValue>('');
  readonly zAlign = input<ZardInputGroupAddonAlignVariants>('inline-start');

  protected readonly classes = computed(() =>
    mergeClasses(inputGroupAddonVariants({ zAlign: this.zAlign() }), this.class()),
  );

  protected onClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('button')) return;
    const control = this.elementRef.nativeElement.parentElement?.querySelector('input, textarea') as HTMLElement | null;
    control?.focus();
  }
}

@Directive({
  selector: 'button[z-input-group-button]',
  host: {
    type: 'button',
    'data-slot': 'input-group-button',
    '[attr.data-size]': 'zSize()',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroupButton',
})
export class ZardInputGroupButtonDirective {
  readonly class = input<ClassValue>('');
  readonly zVariant = input<ZardInputGroupButtonVariantVariants>('ghost');
  readonly zSize = input<ZardInputGroupButtonSizeVariants>('xs');

  protected readonly classes = computed(() =>
    mergeClasses(inputGroupButtonVariants({ zVariant: this.zVariant(), zSize: this.zSize() }), this.class()),
  );
}

@Component({
  selector: 'z-input-group-text, span[z-input-group-text]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'input-group-text',
    '[class]': 'classes()',
  },
  exportAs: 'zInputGroupText',
})
export class ZardInputGroupTextComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(inputGroupTextVariants(), this.class()));
}
