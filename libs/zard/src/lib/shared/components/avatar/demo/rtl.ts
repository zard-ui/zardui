import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarGroupCountComponent } from '@/shared/components/avatar/avatar-group-count.component';
import { ZardAvatarGroupComponent } from '@/shared/components/avatar/avatar-group.component';
import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ online: string; user: string }> = {
  en: { dir: 'ltr', values: { online: 'Online', user: 'User' } },
  ar: { dir: 'rtl', values: { online: 'متصل', user: 'مستخدم' } },
  he: { dir: 'rtl', values: { online: 'מחובר', user: 'משתמש' } },
};

@Component({
  selector: 'z-demo-avatar-rtl',
  imports: [ZardAvatarComponent, ZardAvatarGroupComponent, ZardAvatarGroupCountComponent],
  template: `
    <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
      <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" [zAlt]="i18n.t().user" zFallback="RS" class="grayscale" />
      <z-avatar
        zFallback="LG"
        [zAlt]="i18n.t().online"
        [zShowBadge]="true"
        zBadgeClass="bg-green-600 dark:bg-green-800"
      />
      <z-avatar-group class="grayscale">
        <z-avatar zSrc="/images/avatar/imgs/avatar_image.jpg" [zAlt]="i18n.t().user" zFallback="RS" />
        <z-avatar zFallback="SR" />
        <z-avatar zFallback="MR" />
        <z-avatar-group-count [zCount]="3" />
      </z-avatar-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAvatarRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
