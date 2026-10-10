import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardResizableImports } from '@/shared/components/resizable/resizable.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ one: string; two: string; three: string }> = {
  en: { dir: 'ltr', values: { one: 'One', two: 'Two', three: 'Three' } },
  ar: { dir: 'rtl', values: { one: 'واحد', two: 'اثنان', three: 'ثلاثة' } },
  he: { dir: 'rtl', values: { one: 'אחד', two: 'שניים', three: 'שלושה' } },
};

@Component({
  selector: 'z-demo-resizable-rtl',
  imports: [...ZardResizableImports],
  template: `
    @let t = i18n.t();
    <!-- In RTL the first panel sits on the right, and ArrowLeft on the handle grows it. -->
    <z-resizable class="h-60 w-80 rounded-lg border sm:w-96">
      <z-resizable-panel [zDefaultSize]="50">
        <div class="flex h-full items-center justify-center p-6">
          <span class="font-semibold">{{ t.one }}</span>
        </div>
      </z-resizable-panel>
      <z-resizable-handle zWithHandle />
      <z-resizable-panel [zDefaultSize]="50">
        <z-resizable zLayout="vertical">
          <z-resizable-panel [zDefaultSize]="25">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">{{ t.two }}</span>
            </div>
          </z-resizable-panel>
          <z-resizable-handle zWithHandle />
          <z-resizable-panel [zDefaultSize]="75">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">{{ t.three }}</span>
            </div>
          </z-resizable-panel>
        </z-resizable>
      </z-resizable-panel>
    </z-resizable>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoResizableRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
