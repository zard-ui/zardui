import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

/** The tokens a chart paints with: when one of their values changes, every chart has to resolve its colors again. */
const WATCHED_TOKENS = [
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--background',
  '--foreground',
  '--border',
  '--muted-foreground',
  '--card',
  '--popover',
] as const;

/**
 * Tells the charts when the theme's colors changed at run time.
 *
 * ECharts paints on a canvas, so a chart turns `var(--chart-1)` into a literal color when it builds its option. A
 * theme switched by a class on `<html>`, an attribute or a stylesheet added to `<head>` changes the variables but
 * nothing the chart reads, and it would keep the old colors. One observer, shared by every chart on the page, watches
 * those places and bumps `revision` (at most once a frame) only when the resolved value of a watched token changed:
 * a stylesheet that does not touch the theme costs a style read, not a repaint.
 */
@Injectable({ providedIn: 'root' })
export class ZardChartThemeWatcher {
  private readonly document = inject(DOCUMENT);

  /** Bumped each time the theme's colors changed. */
  readonly revision = signal(0);

  private observer: MutationObserver | null = null;
  private users = 0;
  private signature = '';
  private frame: number | null = null;

  /** Starts watching while at least one chart is on the page; call the returned function when the chart goes away. */
  watch(): () => void {
    const view = this.document.defaultView;
    if (!view || typeof view.MutationObserver !== 'function') return () => undefined;

    this.users++;
    if (!this.observer) this.start(view);

    let stopped = false;
    return () => {
      if (stopped) return;
      stopped = true;
      this.users--;
      if (this.users === 0) this.stop();
    };
  }

  private start(view: Window & typeof globalThis): void {
    this.signature = this.readSignature();
    this.observer = new view.MutationObserver(() => this.scheduleCheck());
    this.observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme'],
    });
    this.observer.observe(this.document.head, { childList: true, subtree: true, characterData: true });
  }

  private stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    const view = this.document.defaultView;
    if (this.frame !== null && view) view.cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  private scheduleCheck(): void {
    const view = this.document.defaultView;
    if (!view || this.frame !== null) return;

    this.frame = view.requestAnimationFrame(() => {
      this.frame = null;
      const signature = this.readSignature();
      if (signature === this.signature) return;

      this.signature = signature;
      this.revision.update(value => value + 1);
    });
  }

  private readSignature(): string {
    const view = this.document.defaultView;
    if (!view) return '';

    const style = view.getComputedStyle(this.document.documentElement);
    return WATCHED_TOKENS.map(token => style.getPropertyValue(token).trim()).join('|');
  }
}
