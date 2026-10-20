import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardKbdGroupComponent } from '@/shared/components/kbd/kbd-group.component';
import { ZardKbdComponent } from '@/shared/components/kbd/kbd.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ save: string; hint: string }> = {
  en: {
    dir: 'ltr',
    values: {
      save: 'Save',
      hint: 'Press',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      save: 'حفظ',
      hint: 'اضغط',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      save: 'שמירה',
      hint: 'לחץ',
    },
  },
};

@Component({
  selector: 'z-demo-kbd-rtl',
  imports: [ZardKbdComponent, ZardKbdGroupComponent],
  template: `
    <div class="flex flex-col items-center justify-center gap-4">
      <z-kbd-group>
        <z-kbd>Ctrl</z-kbd>
        <span>+</span>
        <z-kbd>B</z-kbd>
      </z-kbd-group>
      <p class="text-muted-foreground flex items-center gap-2 text-sm">
        {{ i18n.t().hint }}
        <z-kbd-group>
          <z-kbd>Ctrl</z-kbd>
          <z-kbd>S</z-kbd>
        </z-kbd-group>
        {{ i18n.t().save }}
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoKbdRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
