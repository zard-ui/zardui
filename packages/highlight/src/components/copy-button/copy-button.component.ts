import { ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'z-copy-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(click)': 'copy()',
    '[attr.aria-label]': '"Copy code"',
    '[attr.title]': '"Copy code"',
    role: 'button',
  },
  template: `
    @if (copied()) {
      <img src="/icons/check.svg" alt="Copied" class="size-4 invert-0 transition-transform duration-200 dark:invert" />
    } @else {
      <img
        src="/icons/clipboard.svg"
        alt="Copy"
        class="size-4 invert-0 transition-transform duration-200 dark:invert"
      />
    }
  `,
})
export class CopyButtonComponent {
  readonly code = input.required<string>();
  readonly inHeader = input(false);
  readonly copied = signal(false);

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }
}
