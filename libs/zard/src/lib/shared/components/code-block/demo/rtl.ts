import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTerminal } from '@ng-icons/lucide';

import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CodeBlockRtlValues {
  description: string;
  title: string;
}

const translations: ZardRtlTranslations<CodeBlockRtlValues> = {
  en: {
    dir: 'ltr',
    values: { description: 'Install the packages, then start the dev server.', title: 'Terminal' },
  },
  ar: {
    dir: 'rtl',
    values: { description: 'ثبّت الحزم، ثم شغّل خادم التطوير.', title: 'الطرفية' },
  },
  he: {
    dir: 'rtl',
    values: { description: 'התקן את החבילות, ואז הפעל את שרת הפיתוח.', title: 'מסוף' },
  },
};

const CODE = `pnpm add @angular/cdk @ng-icons/core @ng-icons/lucide
ng serve`;

@Component({
  selector: 'z-demo-code-block-rtl',
  imports: [NgIcon, ZardCodeBlockImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3 text-sm">
      <p>{{ i18n.t().description }}</p>
      <z-code-block>
        <z-code-block-header>
          <z-code-block-title>
            <ng-icon name="lucideTerminal" />
            {{ i18n.t().title }}
          </z-code-block-title>
          <z-code-block-actions>
            <z-code-block-copy-button [zValue]="code" />
          </z-code-block-actions>
        </z-code-block-header>
        <!-- Code always reads left to right: only the header follows the page direction. -->
        <z-code-block-content zLineNumbers>
          @for (line of lines(); track $index) {
            <z-code-block-line [zTokens]="line" />
          }
        </z-code-block-content>
      </z-code-block>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardDemoCodeBlockRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly code = CODE;
  protected readonly lines = injectHighlightedCode(CODE, 'bash');
}
