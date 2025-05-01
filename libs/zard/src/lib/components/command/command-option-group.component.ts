import { Component, input, contentChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZardCommandOptionComponent } from './command-option.component';

@Component({
  selector: 'z-command-option-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-2 py-1.5">
      <div class="text-sm font-semibold text-slate-900 dark:text-slate-200">{{ zLabel() }}</div>
      <div class="mt-2 space-y-1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ZardCommandOptionGroupComponent {
  readonly zLabel = input.required<string>();
  options = contentChildren(ZardCommandOptionComponent);
}
