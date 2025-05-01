import { CommonModule } from '@angular/common';
import { ZardCommandOption } from './command.types';
import { Component, signal, input, output, ContentChildren, QueryList, HostListener, AfterViewInit, computed, viewChild, effect, ElementRef } from '@angular/core';
import { ZardCommandVariants, commandVariants } from './command.variants';
import { ZardCommandOptionGroupComponent } from './command-option-group.component';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-command',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex min-h-full w-[400px] p-4">
      <div [class]="classes()" class="overflow-hidden rounded-md border bg-white shadow-sm dark:border-accent dark:bg-accent/50">
        <div class="relative border-b dark:border-accent">
          <div class="relative flex items-center">
            <i class="icon-search absolute left-4 text-gray-500 dark:text-gray-400"></i>
            <input
              #commandInput
              type="text"
              [placeholder]="zPlaceholder()"
              class="w-full border-0 bg-transparent pl-10 pr-4 py-3 outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              (input)="onInputChange($event)"
              (keydown)="onKeyDown($event)"
            />
          </div>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <ng-content select="z-command-option-group"></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ZardCommandComponent implements AfterViewInit {
  // Input/Output signals
  readonly zSize = input<ZardCommandVariants['zSize']>('default');
  readonly zPlaceholder = input<string>('Type a command or search...');
  readonly zOnChange = output<ZardCommandOption>();
  readonly zOnSelect = output<ZardCommandOption>();
  readonly class = input<string>('');
  readonly commandInput = viewChild<ElementRef<HTMLInputElement>>('commandInput');

  // State signals
  private readonly selectedIndex = signal(-1);
  private readonly options = signal<ZardCommandOption[]>([]);

  // Computed values
  protected readonly classes = computed(() => mergeClasses(commandVariants({ zSize: this.zSize() }), this.class()));

  @ContentChildren(ZardCommandOptionGroupComponent)
  private readonly groups!: QueryList<ZardCommandOptionGroupComponent>;

  constructor() {
    // Update options selection state when selectedIndex changes
    effect(() => {
      const currentIndex = this.selectedIndex();
      this.updateOptionsSelection(currentIndex);
    });
  }

  ngAfterViewInit() {
    this.initializeOptions();
    this.groups.changes.subscribe(() => this.initializeOptions());
  }

  private initializeOptions(): void {
    const newOptions = this.groups.reduce((acc: ZardCommandOption[], group) => {
      const groupOptions = group.options().map((option, index) => ({
        value: option.zValue(),
        label: option.zLabel(),
        disabled: option.zDisabled(),
        selected: false,
        index: acc.length + index,
      }));
      return [...acc, ...groupOptions];
    }, []);

    this.options.set(newOptions);
    this.updateOptionsSelection(this.selectedIndex());
  }

  private updateOptionsSelection(selectedIdx: number): void {
    const currentOptions = this.options();
    currentOptions.forEach((option, index) => {
      const isSelected = index === selectedIdx;
      option.selected = isSelected;

      const group = this.findGroupByOptionIndex(index);
      const optionComponent = group?.options()[index - this.getGroupStartIndex(group)];
      if (optionComponent) {
        optionComponent.zSelected.set(isSelected);
      }
    });
  }

  private findGroupByOptionIndex(index: number): ZardCommandOptionGroupComponent | undefined {
    let currentIndex = 0;
    return this.groups.find(group => {
      const groupSize = group.options().length;
      const isInGroup = index >= currentIndex && index < currentIndex + groupSize;
      if (!isInGroup) {
        currentIndex += groupSize;
      }
      return isInGroup;
    });
  }

  private getGroupStartIndex(group: ZardCommandOptionGroupComponent): number {
    let startIndex = 0;
    for (const g of this.groups) {
      if (g === group) break;
      startIndex += g.options().length;
    }
    return startIndex;
  }

  private navigateOptions(direction: 'next' | 'prev'): void {
    const currentOptions = this.options();
    if (!currentOptions.length) return;

    this.selectedIndex.update(current => {
      if (direction === 'next') {
        return current + 1 >= currentOptions.length ? 0 : current + 1;
      } else {
        return current - 1 < 0 ? currentOptions.length - 1 : current - 1;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (document.activeElement !== this.commandInput()?.nativeElement) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions('next');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions('prev');
        break;
      case 'Enter':
        event.preventDefault();
        this.handleOptionSelect();
        break;
      case 'Escape':
        event.preventDefault();
        // Handle escape - can be used to close the command palette
        break;
    }
  }

  private handleOptionSelect(): void {
    const currentIndex = this.selectedIndex();
    const selectedOption = this.options()[currentIndex];

    if (selectedOption && !selectedOption.disabled) {
      this.zOnSelect.emit(selectedOption);
    }
  }

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.zOnChange.emit({ value, label: value });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.metaKey && event.key === 'k') {
      event.preventDefault();
      // Handle command palette toggle
    }
  }
}
