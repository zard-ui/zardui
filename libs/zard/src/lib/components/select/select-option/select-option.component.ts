import { NgIf } from '@angular/common';
import { Component, Input, HostBinding, ElementRef, inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'z-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  imports: [NgIf],
})
export class SelectOptionComponent {
  private elementRef = inject(ElementRef);

  @Input() value: any;
  @Input() label = '';
  @Input() disabled = false;

  selected = false;

  @Output() optionSelected = new EventEmitter<SelectOptionComponent>();

  @HostBinding('attr.role') role = 'option';
  @HostBinding('class.disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  // Método para ser chamado quando a opção for clicada
  onClick() {
    if (this.disabled) return; // Não faz nada se estiver desabilitada
    this.optionSelected.emit(this); // Emite a opção clicada para o pai
  }
}
