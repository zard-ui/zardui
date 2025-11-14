import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, AfterViewInit, ViewEncapsulation, Renderer2, HostListener, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'zard-float-label',
  standalone: true,
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  styles: `
    zard-float-label {
      display: block;
      position: relative;
    }

    zard-float-label label {
      margin-left: 0.25rem;
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      transition: all 0.2s ease-in-out;
      color: var(--color-muted-foreground);
      padding: 0;
      font-size: 0.875rem;
      line-height: 1;
      z-index: 1;
    }

    zard-float-label:has(input:focus) label,
    zard-float-label:has(textarea:focus) label,
    zard-float-label:has(button:focus) label,
    zard-float-label:has(input.input-has-value) label,
    zard-float-label:has(textarea.input-has-value) label,
    zard-float-label:has(button.input-has-value) label {
      top: 0.5rem;
      font-size: 0.75rem;
      color: color-mix(in oklab, var(--color-primary) 70%, var(--color-foreground));
    }

    zard-float-label:has(input.border-destructive:not(:disabled)) label,
    zard-float-label:has(textarea.border-destructive:not(:disabled)) label,
    zard-float-label:has(button.border-destructive:not(:disabled)) label {
      color: var(--color-destructive);
    }

    zard-float-label:has(input.border-warning:not(:disabled)) label,
    zard-float-label:has(textarea.border-warning:not(:disabled)) label,
    zard-float-label:has(button.border-warning:not(:disabled)) label {
      color: var(--color-yellow-500);
    }

    zard-float-label:has(input.border-success:not(:disabled)) label,
    zard-float-label:has(textarea.border-success:not(:disabled)) label,
    zard-float-label:has(button.border-success:not(:disabled)) label {
      color: var(--color-green-500);
    }
  `,
})
export class ZardFloatLabelComponent implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngAfterViewInit() {
    this.updateLabelState();
  }

  @HostListener('input', ['$event'])
  @HostListener('focus', ['$event'])
  @HostListener('blur', ['$event'])
  onInteraction(event: Event) {
    this.updateLabelState();
  }

  private updateLabelState() {
    const isBrowser = isPlatformBrowser(this.platformId);

    if (!isBrowser) return;

    const input = this.el.nativeElement.querySelector('input, textarea, button');

    if (input) {
      const hasValue = !!input.value;
      if (hasValue) {
        this.renderer.addClass(input, 'input-has-value');
      } else {
        this.renderer.removeClass(input, 'input-has-value');
      }
    }
  }
}
