import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDrawerImports } from '@/shared/components/drawer/drawer.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface DrawerRtlStrings {
  trigger: string;
  title: string;
  description: string;
  confirm: string;
  cancel: string;
  asapLabel: string;
  asapDescription: string;
  asapBadge: string;
  slot500Label: string;
  slot500Description: string;
  slot530Label: string;
  slot530Description: string;
  slot600Label: string;
  slot600Description: string;
}

const translations: ZardRtlTranslations<DrawerRtlStrings> = {
  en: {
    dir: 'ltr',
    values: {
      trigger: 'Open Drawer',
      title: 'Pick a delivery time',
      description: "We'll prepare your order as soon as possible.",
      confirm: 'Confirm Delivery Time',
      cancel: 'Cancel',
      asapLabel: 'Standard delivery',
      asapDescription: '25–35 min · Driver assigned now',
      asapBadge: 'Fastest',
      slot500Label: '5:00 PM – 5:15 PM',
      slot500Description: 'Prep starts at 4:45 PM',
      slot530Label: '5:30 PM – 5:45 PM',
      slot530Description: "Good if you're heading home",
      slot600Label: '6:00 PM – 6:15 PM',
      slot600Description: 'Most popular · High demand',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      trigger: 'فتح الدرج',
      title: 'اختر وقت التوصيل',
      description: 'سنجهز طلبك في أقرب وقت ممكن.',
      confirm: 'تأكيد وقت التوصيل',
      cancel: 'إلغاء',
      asapLabel: 'توصيل قياسي',
      asapDescription: '25–35 دقيقة · تم تعيين السائق الآن',
      asapBadge: 'الأسرع',
      slot500Label: '5:00 م – 5:15 م',
      slot500Description: 'يبدأ التحضير في 4:45 م',
      slot530Label: '5:30 م – 5:45 م',
      slot530Description: 'مناسب إذا كنت في الطريق إلى المنزل',
      slot600Label: '6:00 م – 6:15 م',
      slot600Description: 'الأكثر شيوعًا · طلب مرتفع',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      trigger: 'פתח מגירה',
      title: 'בחר זמן משלוח',
      description: 'נכין את ההזמנה שלך בהקדם האפשרי.',
      confirm: 'אשר זמן משלוח',
      cancel: 'בטל',
      asapLabel: 'משלוח רגיל',
      asapDescription: '25–35 דק׳ · נהג הוקצה כעת',
      asapBadge: 'הכי מהיר',
      slot500Label: '17:00 – 17:15',
      slot500Description: 'ההכנה מתחילה ב-16:45',
      slot530Label: '17:30 – 17:45',
      slot530Description: 'מתאים אם אתה בדרך הביתה',
      slot600Label: '18:00 – 18:15',
      slot600Description: 'הפופולרי ביותר · ביקוש גבוה',
    },
  },
};

@Component({
  selector: 'z-demo-drawer-rtl',
  imports: [ZardBadgeComponent, ZardButtonComponent, ZardDrawerImports, ZardRadioGroupImports],
  template: `
    @let t = i18n.t();
    <button type="button" z-button zType="secondary" (click)="visible.set(true)">{{ t.trigger }}</button>

    <!-- zPlacement and the swipe-to-close axis stay physical, whatever the direction. -->
    <z-drawer [(zVisible)]="visible" zPlacement="right">
      <z-drawer-header>
        <z-drawer-title>{{ t.title }}</z-drawer-title>
        <z-drawer-description>{{ t.description }}</z-drawer-description>
      </z-drawer-header>

      <div class="flex-1 overflow-y-auto p-4">
        <z-radio-group [(value)]="deliveryTime" class="gap-2">
          @for (slot of slots(); track slot.value) {
            <label
              [attr.for]="'drawer-rtl-' + slot.value"
              class="has-[[data-state=checked]]:border-primary flex items-start gap-3 rounded-lg border p-3 text-sm"
            >
              <z-radio [zId]="'drawer-rtl-' + slot.value" [value]="slot.value" />
              <span class="grid flex-1 gap-1">
                <span class="flex items-center gap-2 font-medium">
                  {{ slot.label }}
                  @if (slot.badge) {
                    <z-badge zType="secondary">{{ slot.badge }}</z-badge>
                  }
                </span>
                <span class="text-muted-foreground text-xs">{{ slot.description }}</span>
              </span>
            </label>
          }
        </z-radio-group>
      </div>

      <z-drawer-footer>
        <button type="button" z-button (click)="visible.set(false)">{{ t.confirm }}</button>
        <button type="button" z-button zType="outline" z-drawer-close>{{ t.cancel }}</button>
      </z-drawer-footer>
    </z-drawer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDrawerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly visible = signal(false);
  protected readonly deliveryTime = signal<string>('asap');

  protected readonly slots = computed(() => {
    const t = this.i18n.t();
    return [
      { value: 'asap', label: t.asapLabel, description: t.asapDescription, badge: t.asapBadge },
      { value: '5-00', label: t.slot500Label, description: t.slot500Description, badge: '' },
      { value: '5-30', label: t.slot530Label, description: t.slot530Description, badge: '' },
      { value: '6-00', label: t.slot600Label, description: t.slot600Description, badge: '' },
    ];
  });
}
