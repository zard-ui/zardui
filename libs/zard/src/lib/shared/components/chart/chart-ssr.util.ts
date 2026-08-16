import type { EChartsOption } from 'echarts';

/** The slice of an ECharts instance the server renderer uses. */
interface ZardEchartsSsrInstance {
  setOption(option: EChartsOption): void;
  renderToSVGString(): string;
  dispose(): void;
}

/** The slice of `echarts/core` the server renderer uses. */
export interface ZardEchartsSsrApi {
  init(
    dom: null,
    theme: null,
    opts: { renderer: 'svg'; ssr: true; width: number; height: number },
  ): ZardEchartsSsrInstance;
}

/**
 * Lets the server-rendered SVG scale with its container. ECharts stamps the fixed pixel
 * size it was initialised with, so it is swapped for a `viewBox`.
 */
function makeResponsive(svg: string, width: number, height: number): string {
  return svg.replace(/^<svg([^>]*)>/, (_match, attributes: string) => {
    const cleaned = attributes.replace(/\s(?:width|height)="[^"]*"/g, '');
    return `<svg${cleaned} width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`;
  });
}

/**
 * Renders the chart to an SVG string on the server. The browser replaces it with the real
 * chart as soon as the ngx-echarts directive initialises, which is why the host carries
 * `ngSkipHydration`. Returns `null` when anything goes wrong, so the caller can fall back
 * to a client-only chart instead of breaking the prerender.
 */
export function renderChartToSvg(
  api: ZardEchartsSsrApi | null | undefined,
  option: EChartsOption,
  width: number,
  height: number,
): string | null {
  if (!api || typeof api.init !== 'function') {
    return null;
  }

  let instance: ZardEchartsSsrInstance | undefined;

  try {
    instance = api.init(null, null, { renderer: 'svg', ssr: true, width, height });
    instance.setOption(option);
    return makeResponsive(instance.renderToSVGString(), width, height);
  } catch (error) {
    console.warn('[z-chart] server-side rendering failed; the chart will render on the client only.', error);
    return null;
  } finally {
    instance?.dispose();
  }
}
