import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ContentChildren,
  QueryList,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  ChangeDetectorRef,
  DestroyRef,
  inject,
  AfterContentInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './select-option/select-option.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ZardSelectVariants } from './select.variants';
import { FocusMonitor } from '@angular/cdk/a11y';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'z-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [NgIf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
  ],
  animations: [
    trigger('dropdownAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateY(-8px)',
        }),
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      transition('void => *', [animate('150ms cubic-bezier(0.4, 0, 0.2, 1)')]),
      transition('* => void', [animate('100ms cubic-bezier(0.4, 0, 0.2, 1)')]),
    ]),
  ],
})
export class ZardSelectComponent implements ControlValueAccessor, AfterContentInit, AfterViewInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private focusMonitor = inject(FocusMonitor);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);

  @Input() label?: string;
  @Input() placeholder = 'Selecione uma opção';
  @Input() disabled = false;
  @Input() required = false;
  @Input() name?: string;
  @Input() id?: string;
  @Input() zSize: ZardSelectVariants['zSize'] = 'default';
  @Input() zStatus?: ZardSelectVariants['zStatus'] = 'default';
  @Input() zBorderless = false;
  @Input() zFullWidth = false;
  @Input() errorMessage?: string;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() selectionChanged = new EventEmitter<any>();

  @ViewChild('selectTrigger') selectTrigger!: ElementRef;
  @ViewChild('dropdown') dropdown!: ElementRef;
  @ContentChildren(SelectOptionComponent) options!: QueryList<SelectOptionComponent>;

  isOpen = false;
  selectedValue: any = null;
  selectedLabel = '';
  touched = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  ngAfterViewInit(): void {
    this.focusMonitor.monitor(this.selectTrigger.nativeElement).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngAfterContentInit(): void {
    this.updateSelectedLabel();
    this.updateSelectedState();

    this.options.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateSelectedLabel();
      this.updateSelectedState();
    });

    this.options.forEach(option => {
      option.optionSelected.subscribe((selectedOption: SelectOptionComponent) => {
        this.selectOption(selectedOption);
      });
    });
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.updateSelectedLabel();
    this.updateSelectedState();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggleDropdown(): void {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.opened.emit();
      setTimeout(() => {
        this.positionDropdown();
        document.addEventListener('click', this.onClickOutside);
      });
    } else {
      this.closed.emit();
      document.removeEventListener('click', this.onClickOutside);
    }

    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  private positionDropdown(): void {
    if (!this.dropdown) return;

    const triggerRect = this.selectTrigger.nativeElement.getBoundingClientRect();
    const dropdownElement = this.dropdown.nativeElement;

    this.renderer.setStyle(dropdownElement, 'width', `${triggerRect.width}px`);
  }

  onClickOutside = (event: MouseEvent): void => {
    if (!this.selectTrigger.nativeElement.contains(event.target) && (!this.dropdown || !this.dropdown.nativeElement.contains(event.target))) {
      this.isOpen = false;
      document.removeEventListener('click', this.onClickOutside);
      this.cdr.markForCheck();
      this.closed.emit();
    }
  };

  selectOption(option: SelectOptionComponent): void {
    if (option.disabled) return;

    console.log('Selecionando opção:', option);

    this.selectedValue = option.value;
    this.selectedLabel = option.label;
    this.updateSelectedState();
    console.log('Valor selecionado:', this.selectedValue, 'Label selecionado:', this.selectedLabel); // Verifique o valor atualizado

    this.onChange(option.value);
    this.isOpen = false;
    document.removeEventListener('click', this.onClickOutside);
    this.selectionChanged.emit(option.value);
    this.cdr.markForCheck();
  }

  updateSelectedLabel(): void {
    if (this.options) {
      const selectedOption = this.options.find(option => option.value === this.selectedValue);
      if (selectedOption) {
        this.selectedLabel = selectedOption.label;
      } else {
        this.selectedLabel = '';
      }
      this.cdr.markForCheck();
    }
  }

  updateSelectedState(): void {
    if (this.options) {
      console.log(this.options);
      this.options.forEach(option => {
        option.selected = option.value === this.selectedValue;
      });
      this.cdr.markForCheck();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        if (this.isOpen) {
          event.preventDefault();
          this.isOpen = false;
          this.closed.emit();
        }
        break;
      case 'ArrowDown':
        if (this.isOpen && this.options.length > 0) {
          event.preventDefault();
          this.focusNextOption();
        }
        break;
      case 'ArrowUp':
        if (this.isOpen && this.options.length > 0) {
          event.preventDefault();
          this.focusPreviousOption();
        }
        break;
    }
  }

  private focusNextOption(): void {
    const options = this.options.toArray();
    const enabledOptions = options.filter(opt => !opt.disabled);
    if (enabledOptions.length === 0) return;

    const currentIndex = enabledOptions.findIndex(opt => opt.value === this.selectedValue);
    const nextIndex = currentIndex < 0 || currentIndex === enabledOptions.length - 1 ? 0 : currentIndex + 1;

    const nextOption = enabledOptions[nextIndex];
    this.selectOption(nextOption);
  }

  private focusPreviousOption(): void {
    const options = this.options.toArray();
    const enabledOptions = options.filter(opt => !opt.disabled);
    if (enabledOptions.length === 0) return;

    const currentIndex = enabledOptions.findIndex(opt => opt.value === this.selectedValue);
    const prevIndex = currentIndex <= 0 ? enabledOptions.length - 1 : currentIndex - 1;

    const prevOption = enabledOptions[prevIndex];
    this.selectOption(prevOption);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onClickOutside);
    if (this.selectTrigger) {
      this.focusMonitor.stopMonitoring(this.selectTrigger.nativeElement);
    }
  }
}
