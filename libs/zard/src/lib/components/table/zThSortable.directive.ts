import { AfterViewInit, Directive, effect, ElementRef, HostListener, inject, input, Renderer2, signal } from '@angular/core';
import { ZardTableComponent } from './table.component';

@Directive({
  selector: '[zThSortable]',
  standalone: true,
})
export class ZThSortableDirective implements AfterViewInit {
  readonly key = input<string>('');
  readonly isOrderingEnabled = input<boolean>(false);

  private readonly asc = signal(true);
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly zTable = inject(ZardTableComponent, { optional: true, host: true });

  private icon!: HTMLElement;

  ngAfterViewInit(): void {
    const ordering = this.zTable?.isOrderingEnabled() ?? this.isOrderingEnabled();

    if (!ordering) return;

    this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
    this.renderer.setAttribute(this.el.nativeElement, 'role', 'button');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-label', `Ordenar por ${this.key}, estado atual: não ordenado`);

    this.icon = this.renderer.createElement('span');
    this.renderer.setStyle(this.icon, 'margin-left', '5px');
    this.renderer.setStyle(this.icon, 'font-size', '1em');
    this.setIcon('⇅');
    this.renderer.appendChild(this.el.nativeElement, this.icon);

    effect(() => {
      const icon = this.asc() ? '▲' : '▼';
      this.setIcon(icon);
      this.setAriaSort();

      this.renderer.setAttribute(this.el.nativeElement, 'aria-label', `Ordenar por ${this.key}, ordenado ${this.asc() ? 'ascendente' : 'descendente'}`);
    });

    this.setAriaSort('none');
  }

  @HostListener('click')
  @HostListener('keydown.enter', ['$event'])
  onClick(): void {
    if (!this.zTable?.isOrderingEnabled()) return;

    const th = this.el.nativeElement;
    const tr = th.closest('tr');
    const table = th.closest('table');
    if (!tr || !table) return;

    const index = Array.from(tr.children).indexOf(th);
    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));

    tr.querySelectorAll('th').forEach((header: HTMLElement) => {
      header.classList.remove('sorted-asc', 'sorted-desc');

      const icon = header.querySelector('span');
      if (icon) icon.textContent = '⇅';
    });

    const direction = !this.asc();
    this.asc.set(direction);
    th.classList.add(direction ? 'sorted-asc' : 'sorted-desc');
    this.setIcon(direction ? '▲' : '▼');

    rows.sort((a, b) => {
      const aRow = a as HTMLTableRowElement;
      const bRow = b as HTMLTableRowElement;
      const aVal = aRow.children[index]?.textContent?.trim() ?? '';
      const bVal = bRow.children[index]?.textContent?.trim() ?? '';
      return direction ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    rows.forEach(row => tbody.appendChild(row));
  }

  @HostListener('keydown.space', ['$event'])
  onSpace(event: KeyboardEvent): void {
    event.preventDefault();
    this.onClick();
  }

  private setIcon(char: string): void {
    if (this.icon) this.icon.textContent = char;
  }

  private setAriaSort(value: 'ascending' | 'descending' | 'none' = this.asc() ? 'ascending' : 'descending') {
    this.renderer.setAttribute(this.el.nativeElement, 'aria-sort', value);
  }
}
