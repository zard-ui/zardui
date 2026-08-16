export * from '@/shared/components/chart/chart.component';
export * from '@/shared/components/chart/chart-legend.component';
export * from '@/shared/components/chart/chart-tooltip.component';
export * from '@/shared/components/chart/chart-tooltip.formatter';
export * from '@/shared/components/chart/chart-colors.util';
export * from '@/shared/components/chart/chart-option.builder';
export * from '@/shared/components/chart/chart-echarts.provider';
// `chart-echarts.registry` is deliberately absent: it calls `echarts.use(...)` at module scope,
// so re-exporting it here would pull the whole engine into anything that touches this barrel.
// `provideZardCharts()` imports it on demand, and the server renderer does the same.
export * from '@/shared/components/chart/chart-context';
export * from '@/shared/components/chart/chart-ssr.util';
export * from '@/shared/components/chart/chart.types';
export * from '@/shared/components/chart/chart.variants';
export * from '@/shared/components/chart/chart.imports';
