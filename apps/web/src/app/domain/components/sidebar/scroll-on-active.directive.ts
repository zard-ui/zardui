// scroll-on-active.directive.ts
import { DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLinkActive } from '@angular/router';

@Directive({
  selector: '[routerLinkActive][scrollOnActive]',
})
export class ScrollOnActiveDirective implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef);
  private readonly routerLinkActive = inject(RouterLinkActive);

  ngOnInit(): void {
    this.routerLinkActive.isActiveChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isActive => {
      if (isActive) {
        this.scrollToElement();
      }
    });
  }

  private scrollToElement(): void {
    const element = this.el.nativeElement;
    if (!element.scrollIntoView) {
      // on mobile scrollIntoView is undefined
      return;
    }

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}
