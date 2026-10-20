import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileCode, lucideFileText, lucideImage, lucideX } from '@ng-icons/lucide';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardAttachmentImports } from '../attachment.imports';

interface AttachmentRtlValues {
  attached: string;
  ready: string;
  remove: string;
  notes: string;
  photo: string;
  budget: string;
  archive: string;
}

const translations: ZardRtlTranslations<AttachmentRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      attached: 'Attached files',
      ready: 'Ready · 24 KB',
      remove: 'Remove',
      notes: 'Notes.pdf',
      photo: 'Photo.png',
      budget: 'Budget.csv',
      archive: 'Archive.zip',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      attached: 'الملفات المرفقة',
      ready: 'جاهز · 24 كيلوبايت',
      remove: 'إزالة',
      notes: 'ملاحظات.pdf',
      photo: 'صورة.png',
      budget: 'الميزانية.csv',
      archive: 'أرشيف.zip',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      attached: 'קבצים מצורפים',
      ready: 'מוכן · 24 ק״ב',
      remove: 'הסר',
      notes: 'הערות.pdf',
      photo: 'תמונה.png',
      budget: 'תקציב.csv',
      archive: 'ארכיון.zip',
    },
  },
};

@Component({
  selector: 'z-demo-attachment-rtl',
  imports: [NgIcon, ...ZardAttachmentImports],
  template: `
    <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-6">
      <z-attachment-group [attr.aria-label]="i18n.t().attached" class="max-w-sm">
        @for (file of files(); track file.name) {
          <z-attachment class="w-64">
            <z-attachment-media aria-hidden="true">
              <ng-icon [name]="file.icon" class="size-4" />
            </z-attachment-media>
            <z-attachment-content>
              <z-attachment-title>{{ file.name }}</z-attachment-title>
              <z-attachment-description>{{ i18n.t().ready }}</z-attachment-description>
            </z-attachment-content>
            <z-attachment-actions>
              <button type="button" z-attachment-action [attr.aria-label]="i18n.t().remove + ' ' + file.name">
                <ng-icon name="lucideX" class="size-3.5" />
              </button>
            </z-attachment-actions>
          </z-attachment>
        }
      </z-attachment-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideFileCode, lucideFileText, lucideImage, lucideX })],
})
export class ZardDemoAttachmentRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly files = computed(() => {
    const t = this.i18n.t();
    return [
      { name: t.notes, icon: 'lucideFileText' },
      { name: t.photo, icon: 'lucideImage' },
      { name: t.budget, icon: 'lucideFileText' },
      { name: t.archive, icon: 'lucideFileCode' },
    ];
  });
}
