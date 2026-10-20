import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide';

import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ branch: string; thinking: string; compacted: string; explored: string }> = {
  en: {
    dir: 'ltr',
    values: {
      branch: 'Switched to a new branch',
      thinking: 'Thinking...',
      compacted: 'Conversation compacted',
      explored: 'Explored 4 files',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      branch: 'تم التبديل إلى فرع جديد',
      thinking: 'جارٍ التفكير...',
      compacted: 'تم ضغط المحادثة',
      explored: 'تم استكشاف 4 ملفات',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      branch: 'עברת לענף חדש',
      thinking: 'חושב...',
      compacted: 'השיחה דוחסה',
      explored: 'נסרקו 4 קבצים',
    },
  },
};

@Component({
  selector: 'z-demo-marker-rtl',
  imports: [NgIcon, ZardSpinnerComponent, ...ZardMarkerImports],
  template: `
    <div class="flex w-full max-w-sm min-w-sm flex-col gap-8">
      <z-marker>
        <z-marker-icon><ng-icon name="lucideGitBranch" /></z-marker-icon>
        <z-marker-content>{{ i18n.t().branch }}</z-marker-content>
      </z-marker>

      <z-marker role="status">
        <z-marker-icon><z-spinner /></z-marker-icon>
        <z-marker-content class="shimmer">{{ i18n.t().thinking }}</z-marker-content>
      </z-marker>

      <z-marker zVariant="separator">
        <z-marker-content>{{ i18n.t().compacted }}</z-marker-content>
      </z-marker>

      <z-marker zVariant="border">
        <z-marker-icon><ng-icon name="lucideSearch" /></z-marker-icon>
        <z-marker-content>{{ i18n.t().explored }}</z-marker-content>
      </z-marker>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGitBranch, lucideSearch })],
})
export class ZardDemoMarkerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
