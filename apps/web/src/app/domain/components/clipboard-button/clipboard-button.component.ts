import { ZardButtonComponent } from '@zard/components/button/button.component';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'z-clipboard-button',
  template: `<button z-button zType="outline" zSize="icon" class="h-7 w-7 relative top-2" (click)="onClick()">
    @if (clipState()) {
      <i class="icon-check"></i>
    } @else {
      <i class="icon-clipboard"></i>
    }
  </button>`,
  standalone: true,
  imports: [RouterModule, ZardButtonComponent],
})
export class ClipboardButtonComponent {
  clipState = signal(false);

  onClick() {
    this.handleChangeClipState();
  }

  handleChangeClipState() {
    this.clipState.set(true);
    setTimeout(() => {
      this.clipState.set(false);
    }, 2000);
  }
}
