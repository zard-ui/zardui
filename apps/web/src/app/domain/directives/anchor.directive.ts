import { afterNextRender, Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[anchor]',
})
export class AnchorDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly anchor = input<string>('');

  constructor() {
    afterNextRender(() => this.render());
  }

  private render(): void {
    const element = this.elementRef.nativeElement;
    const id = this.anchor() || element.id || findAncestorId(element);
    if (!id) return;

    const text = element.textContent?.trim();
    if (!text) return;

    const href = `${location.pathname}${location.search}#${escapeAttr(id)}`;
    element.innerHTML = `<a class="group no-underline" href="${href}"><span class="underline-offset-4 group-hover:underline">${escapeHtml(text)}</span><span aria-hidden="true" class="text-muted-foreground ml-2 opacity-0 group-hover:opacity-100">#</span></a>`;
  }
}

function findAncestorId(element: HTMLElement): string {
  let current: HTMLElement | null = element.parentElement;
  while (current) {
    if (current.id) return current.id;
    current = current.parentElement;
  }
  return '';
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
