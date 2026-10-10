import { Dir } from '@angular/cdk/bidi';
import { ComponentType } from '@angular/cdk/overlay';
import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, input, signal, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import { CodeBlockComponent } from '@highlight/components/code-block/code-block.component';
import { CopyButtonComponent } from '@highlight/components/copy-button/copy-button.component';
import type { CodeBlockData } from '@highlight/types';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo } from '@ng-icons/lucide';

import { AnchorDirective } from '@doc/domain/directives/anchor.directive';
import { ProseDirective } from '@doc/domain/directives/prose.directive';
import type { CodeSnippet, ExampleType } from '@doc/shared/constants/components.constant';
import { HyphenToSpacePipe } from '@doc/shared/pipes/hyphen-to-space.pipe';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardPopoverImports } from '@zard/components/popover/popover.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';

import {
  ZARD_RTL_DEFAULT_LANGUAGE,
  ZARD_RTL_LANGUAGE,
  ZARD_RTL_LANGUAGES,
  type ZardRtlLanguage,
} from '@/shared/demo-utils/rtl-translation';

@Component({
  selector: 'z-code-box',
  imports: [
    NgComponentOutlet,
    HyphenToSpacePipe,
    CodeBlockComponent,
    CopyButtonComponent,
    ProseDirective,
    AnchorDirective,
    Dir,
    NgIcon,
    ZardButtonComponent,
    ZardPopoverImports,
    ZardSelectImports,
  ],
  viewProviders: [
    provideIcons({ lucideInfo }),
    // What the demos of an RTL example read through `injectRtlTranslation`: one language per code box.
    { provide: ZARD_RTL_LANGUAGE, useFactory: () => inject(ZardCodeBoxComponent).language.asReadonly() },
  ],
  templateUrl: './zard-code-box.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ZardCodeBoxComponent {
  // Supports single or multiple codeBefore/codeAfter snippets via codeBeforeList/codeAfterList.
  readonly componentType = input<string>();
  readonly demoDescription = input<string | undefined>();
  readonly onlyDemo = input<boolean | undefined>(false);
  readonly fullWidth = input<boolean | undefined>(false);
  readonly fullScreen = input<boolean | undefined>(false);
  readonly flexAlign = input<'start' | 'center' | 'end' | undefined>('center');
  readonly column = input<boolean | undefined>(false);
  readonly fillContainer = input<boolean | undefined>(false);
  readonly dynamicComponent = input<ComponentType<unknown>>();
  readonly codeData = input<CodeBlockData>();
  readonly codeBefore = input<CodeSnippet | CodeSnippet[]>();
  readonly codeAfter = input<CodeSnippet | CodeSnippet[]>();
  /** Optional CSS max-height (e.g. '28rem') overriding the default code block height. */
  readonly codeHeight = input<string>();
  /** Optional CSS min-height (e.g. '32rem') overriding the default preview (component) area height. */
  readonly previewHeight = input<string>();

  /** `'rtl'` renders the example in the RTL preview; anything else is a plain example, forced to `dir="ltr"`. */
  readonly type = input<ExampleType>();

  readonly codeCollapsed = signal(true);

  protected readonly rtlLanguages = ZARD_RTL_LANGUAGES;
  protected readonly rtlNotes = RTL_AI_NOTES;

  /** The language picked in the header of the RTL preview. Arabic until the visitor changes it. */
  readonly language = signal<ZardRtlLanguage>(ZARD_RTL_DEFAULT_LANGUAGE);

  protected readonly isRtl = computed(() => this.type() === 'rtl');

  /** Ordinary previews are always `ltr`, so a `dir` on the page never leaks into them. */
  protected readonly previewDir = computed(() =>
    this.isRtl() ? (ZARD_RTL_LANGUAGES.find(({ code }) => code === this.language())?.dir ?? 'rtl') : 'ltr',
  );

  protected onLanguageChange(value: string | string[]): void {
    const code = Array.isArray(value) ? value[0] : value;
    if (ZARD_RTL_LANGUAGES.some(language => language.code === code)) {
      this.language.set(code as ZardRtlLanguage);
    }
  }

  readonly codeBeforeList = computed(() => toSnippetList(this.codeBefore()));
  readonly codeAfterList = computed(() => toSnippetList(this.codeAfter()));

  readonly codeBlockData = computed(() => {
    const data = this.codeData();
    if (!data) return undefined;
    return { ...data, expandable: false, copyButton: false };
  });

  readonly previewClasses = computed(() => {
    const base = 'preview relative flex min-h-72 w-full justify-center p-6 md:p-10';
    return this.fillContainer() ? `${base} [&>*]:size-full` : base;
  });
}

/** The note behind the info button of the RTL preview, in the three languages of the selector. */
const RTL_AI_NOTES: readonly { lang: ZardRtlLanguage; dir: 'ltr' | 'rtl'; text: string }[] = [
  {
    lang: 'en',
    dir: 'ltr',
    text: 'I used AI to translate the text for demonstration purposes. It might not be perfect and could contain errors.',
  },
  {
    lang: 'ar',
    dir: 'rtl',
    text: 'لقد استخدمت الذكاء الاصطناعي لترجمة النص لأغراض العرض التوضيحي. قد لا تكون الترجمة مثالية وقد تحتوي على أخطاء.',
  },
  {
    lang: 'he',
    dir: 'rtl',
    text: 'השתמשתי בבינה מלאכותית כדי לתרגם את הטקסט למטרות הדגמה. ייתכן שהתרגום אינו מושלם ועלול להכיל שגיאות.',
  },
];

function toSnippetList(value: CodeSnippet | CodeSnippet[] | undefined): CodeSnippet[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}
