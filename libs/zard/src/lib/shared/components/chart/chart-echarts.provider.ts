import { provideEchartsCore } from 'ngx-echarts';

/**
 * Registers the ECharts modules ZardUI charts need. Add to `app.config.ts` providers.
 *
 * The engine is imported lazily: `ngx-echarts` accepts a loader function and awaits it the
 * first time a chart is created, which keeps roughly a megabyte of ECharts out of the
 * application's initial bundle. Edit `chart-echarts.registry.ts` to change what is loaded.
 */
export const provideZardCharts = () =>
  provideEchartsCore({ echarts: () => import('./chart-echarts.registry').then(module => module.zardEcharts) });
