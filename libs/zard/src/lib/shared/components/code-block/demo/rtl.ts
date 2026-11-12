import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CodeBlockRtlValues {
  title: string;
}

const translations: ZardRtlTranslations<CodeBlockRtlValues> = {
  en: { dir: 'ltr', values: { title: 'Install' } },
  ar: { dir: 'rtl', values: { title: 'التثبيت' } },
  he: { dir: 'rtl', values: { title: 'התקנה' } },
};

@Component({
  selector: 'z-demo-code-block-rtl',
  imports: [ZardCodeBlockImports],
  template: `
    <z-code-block class="max-w-md">
      <z-code-block-header>
        <z-code-block-title>{{ i18n.t().title }}</z-code-block-title>
        <z-code-block-actions>
          <z-code-block-copy-button [zValue]="command" />
        </z-code-block-actions>
      </z-code-block-header>
      <z-code-block-content zLineNumbers>{{ command }}</z-code-block-content>
    </z-code-block>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCodeBlockRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  // Code always reads left to right: only the header follows the page direction.
  protected readonly command = `npm install zard-cli
npx zard-cli@latest add button`;
}
