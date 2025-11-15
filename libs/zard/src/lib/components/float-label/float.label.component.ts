import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, HostListener, PLATFORM_ID, ViewEncapsulation, computed, input, inject } from '@angular/core';

import { floatLabelStyles } from './float.label.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-float-label',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardFloatLabelComponent implements AfterViewInit {
  readonly class = input<string>('');

  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly classes = computed(() => mergeClasses(floatLabelStyles(), this.class()));

  ngAfterViewInit() {
    this.updateLabelState();
  }

  @HostListener('input')
  @HostListener('focus')
  @HostListener('blur')
  onInteraction() {
    this.updateLabelState();
  }

  private updateLabelState() {
    if (!isPlatformBrowser(this.platformId)) return;

    const input: HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | null = this.el.nativeElement.querySelector('input, textarea, button');

    if (!input) return;

    const hasValue = !!input.value;
    input.classList.toggle('input-has-value', hasValue);
  }
}
