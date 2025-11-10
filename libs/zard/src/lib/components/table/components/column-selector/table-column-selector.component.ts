import { Component, ElementRef, HostListener, input, output, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { tableVariants } from './../../table.variants';

@Component({
  selector: 'z-table-column-selector',
  standalone: true,
  exportAs: 'zTableColumnSelector',
  template: `
    <details #detailsRef [class]="tableVariants.details()" (toggle)="onDetailsToggle($event)">
      <summary
        [class]="tableVariants.summary({ zSize: zSize() })"
        #summaryRef
        role="button"
        id="columns-summary"
        aria-haspopup="true"
        [attr.aria-expanded]="isDetailsOpen()"
        aria-controls="dropdown-list-id"
      >
        Columns
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-chevron-down-icon lucide-chevron-down"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <ul [class]="tableVariants.dropdownUl()" tabindex="-1" id="dropdown-list-id" aria-orientation="vertical" (keydown)="onMenuKeydown($event)" aria-labelledby="columns-summary">
        @for (column of columns(); track column.accessor) {
          <li
            [class]="tableVariants.dropdownLi()"
            role="menuitemcheckbox"
            [attr.aria-checked]="visibleColumns()[column.accessor]"
            [attr.aria-labelledby]="column.accessor + '-label'"
          >
            <label [class]="tableVariants.dropdownLiLabel()" id="{{ column.accessor }}-label" for="{{ column.accessor }}">
              <input
                [class]="tableVariants.dropdownCheckbox()"
                #checkboxInputs
                type="checkbox"
                id="{{ column.accessor }}"
                name="{{ column.accessor }}"
                [checked]="visibleColumns()[column.accessor]"
                (change)="onToggle(column.accessor)"
                (keydown)="onCheckboxKeydown($event, column.accessor)"
              />
              <span [class]="tableVariants.dropdownCheckIconWrapper()">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {{ column.header }}
            </label>
          </li>
        }
      </ul>
    </details>
  `,
})
export class ZardTableColumnSelectorComponent {
  @ViewChild('summaryRef', { static: true }) summaryElementRef!: ElementRef<HTMLElement>;
  @ViewChild('detailsRef', { static: true }) detailsElementRef!: ElementRef<HTMLDetailsElement>;
  @ViewChildren('checkboxInputs', { read: ElementRef }) checkboxInputs!: QueryList<ElementRef<HTMLInputElement>>;

  readonly zSize = input<'default' | 'compact' | 'comfortable'>('default');
  readonly columns = input<Array<{ accessor: string; header: string }>>([]);
  readonly visibleColumns = input<Record<string, boolean>>({});
  readonly toggleColumn = output<string>();

  readonly isDetailsOpen = signal(false);
  readonly openedByKeyboard = signal(false);

  readonly tableVariants = tableVariants;

  onToggle(accessor: string) {
    this.toggleColumn.emit(accessor);
  }

  onCheckboxKeydown(event: KeyboardEvent, accessor: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onToggle(accessor);
    }
  }

  onDetailsToggle(event: Event) {
    const detailsElement = event.target as HTMLDetailsElement;

    this.isDetailsOpen.set(detailsElement.open);

    if (detailsElement.open && this.openedByKeyboard()) {
      requestAnimationFrame(() => {
        this.checkboxInputs.first?.nativeElement.focus();
      });
    }

    this.openedByKeyboard.set(false);
  }

  private isDetailsOpenAndAvailable(): boolean {
    const details = this.detailsElementRef?.nativeElement;
    return details && details.open;
  }

  private closeDetails() {
    const details = this.detailsElementRef?.nativeElement;
    if (details && details.open) {
      details.open = false;
      this.isDetailsOpen.set(false);
    }
  }

  @HostListener('keydown', ['$event'])
  onSummaryKeydown(event: KeyboardEvent) {
    if (event.target === this.summaryElementRef?.nativeElement && (event.key === 'Enter' || event.key === ' ')) {
      this.openedByKeyboard.set(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isDetailsOpenAndAvailable()) {
      this.closeDetails();
      this.summaryElementRef?.nativeElement?.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const details = this.detailsElementRef?.nativeElement;
    if (this.isDetailsOpenAndAvailable() && !details.contains(event.target as Node)) {
      this.closeDetails();
    }
  }

  @HostListener('document:focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    const details = this.detailsElementRef?.nativeElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (this.isDetailsOpenAndAvailable() && (!relatedTarget || !details.contains(relatedTarget))) {
      this.closeDetails();
    }
  }

  onMenuKeydown(event: KeyboardEvent) {
    const inputs = this.checkboxInputs.toArray();
    const currentIndex = inputs.findIndex(input => input.nativeElement === document.activeElement);

    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        this.closeDetails();
        this.summaryElementRef?.nativeElement?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        inputs[(currentIndex + 1) % inputs.length].nativeElement.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        inputs[(currentIndex - 1 + inputs.length) % inputs.length].nativeElement.focus();
        break;
      case 'Home':
        event.preventDefault();
        inputs[0].nativeElement.focus();
        break;
      case 'End':
        event.preventDefault();
        inputs[inputs.length - 1].nativeElement.focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDetails();
        this.summaryElementRef?.nativeElement?.focus();
        break;
    }
  }
}
