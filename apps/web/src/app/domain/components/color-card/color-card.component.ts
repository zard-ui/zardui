import { Clipboard } from '@angular/cdk/clipboard';
import { Component, input, inject, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';

import { LucideAngularModule, Check, Clipboard as ClipboardIcon } from 'lucide-angular';
import { toast } from 'ngx-sonner';

import { Color } from '@doc/shared/constants/colors.constant';
import { ColorsService, ColorFormat } from '@doc/shared/services/colors.service';

@Component({
  selector: 'button[z-color-card]',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-card.component.html',
  host: {
    type: 'button',
    '[class]': 'hostClasses()',
    '[attr.data-last-copied]': 'isCopied()',
    '[style.--bg]': 'color().oklch',
    '[style.--text]': 'color().foreground',
  },
})
export class ColorCardComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly colorsService = inject(ColorsService);

  readonly color = input.required<Color>();
  readonly format = input.required<ColorFormat>();

  readonly Check = Check;
  readonly ClipboardIcon = ClipboardIcon;

  readonly isCopied = computed(() => this.colorsService.lastCopied() === this.formattedValue());

  readonly hostClasses = computed(
    () =>
      'group relative flex flex-1 flex-col gap-2 cursor-pointer aspect-[3/1] sm:aspect-[2/3] sm:h-auto sm:w-auto text-(--text) w-full',
  );

  readonly formattedValue = computed(() => {
    const color = this.color();
    const format = this.format();

    switch (format) {
      case 'class':
        return color.className;
      case 'hex':
        return color.hex;
      case 'rgb':
        return color.rgb;
      case 'hsl':
        return color.hsl;
      case 'oklch':
        return color.oklch;
      case 'var':
        return color.var;
      default:
        return color.hsl;
    }
  });

  @HostListener('click')
  copyToClipboard(): void {
    const value = this.formattedValue();
    const success = this.clipboard.copy(value);

    if (success) {
      this.colorsService.setLastCopied(value);
      toast.success(`Copied ${value} to clipboard.`);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  }
}
