import { Component, input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { toast } from 'ngx-sonner';
import { LucideAngularModule, Check, Clipboard as ClipboardIcon } from 'lucide-angular';

import { Color } from '@zard/shared/constants/colors.constant';
import { ColorsService, ColorFormat } from '@zard/shared/services/colors.service';

@Component({
  selector: 'z-color-card',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-card.component.html',
})
export class ColorCardComponent {
  private readonly clipboard = inject(Clipboard);
  private readonly colorsService = inject(ColorsService);

  readonly color = input.required<Color>();
  readonly format = input.required<ColorFormat>();

  readonly Check = Check;
  readonly ClipboardIcon = ClipboardIcon;

  readonly isCopied = computed(() => this.colorsService.lastCopied() === this.formattedValue());

  readonly formattedValue = computed(() => {
    const color = this.color();
    const format = this.format();

    switch (format) {
      case 'className':
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
