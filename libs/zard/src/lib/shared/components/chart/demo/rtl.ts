import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface ChartRtlValues {
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  desktop: string;
  mobile: string;
}

const translations: ZardRtlTranslations<ChartRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      desktop: 'Desktop',
      mobile: 'Mobile',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      january: 'يناير',
      february: 'فبراير',
      march: 'مارس',
      april: 'أبريل',
      may: 'مايو',
      june: 'يونيو',
      desktop: 'سطح المكتب',
      mobile: 'الجوال',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      january: 'ינואר',
      february: 'פברואר',
      march: 'מרץ',
      april: 'אפריל',
      may: 'מאי',
      june: 'יוני',
      desktop: 'מחשב',
      mobile: 'נייד',
    },
  },
};

@Component({
  selector: 'z-demo-chart-rtl',
  imports: [ZardChartImports],
  template: `
    <z-chart
      zType="bar"
      [zConfig]="chartConfig()"
      [zData]="chartData()"
      [zSeries]="series"
      zXAxisKey="month"
      [zXAxisFormatter]="shortMonth"
      class="min-h-[200px] w-full"
    >
      <z-chart-tooltip />
      <z-chart-legend />
    </z-chart>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly series = ['desktop', 'mobile'];

  protected readonly chartConfig = computed<ZardChartConfig>(() => {
    const t = this.i18n.t();
    return {
      desktop: { label: t.desktop, color: 'var(--chart-2)' },
      mobile: { label: t.mobile, color: 'var(--chart-1)' },
    };
  });

  protected readonly chartData = computed(() => {
    const t = this.i18n.t();
    return [
      { month: t.january, desktop: 186, mobile: 80 },
      { month: t.february, desktop: 305, mobile: 200 },
      { month: t.march, desktop: 237, mobile: 120 },
      { month: t.april, desktop: 73, mobile: 190 },
      { month: t.may, desktop: 209, mobile: 130 },
      { month: t.june, desktop: 214, mobile: 140 },
    ];
  });

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
