import '@testing-library/jest-dom';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { ZardMessageScrollerComponent } from './message-scroller.component';
import { ZardMessageScrollerImports } from './message-scroller.imports';
import { ZardMessageScrollerService } from './message-scroller.service';

// ---------------------------------------------------------------------------------------------
// happy-dom has no layout. These helpers give the scroller a deterministic one: rows of ROW px
// stacked in a VIEW px viewport, with scrollHeight/scrollTop/getBoundingClientRect derived from them,
// plus controllable observers. The real scrolling is covered by the Playwright spec.
// ---------------------------------------------------------------------------------------------

const ROW = 50;
const VIEW = 200;

const slotOf = (el: unknown): string | null => (el as Element).getAttribute?.('data-slot') ?? null;
const scrollTops = new WeakMap<object, number>();
const scrollToCalls: { top: number; behavior?: string }[] = [];

function rowsOf(content: Element | null): HTMLElement[] {
  return Array.from(content?.children ?? []).filter(c => slotOf(c) === 'message-scroller-item') as HTMLElement[];
}

function viewportMetrics(viewport: HTMLElement) {
  const content = viewport.querySelector('[data-slot="message-scroller-content"]');
  const spacer = viewport.querySelector('[data-slot="message-scroller-spacer"]') as HTMLElement | null;
  const contentHeight = Math.max(VIEW, rowsOf(content).length * ROW);
  const spacerHeight = parseFloat(spacer?.style.height || '0') || 0;
  return { contentHeight, scrollHeight: contentHeight + spacerHeight };
}

type PatchedProp = [object, string, PropertyDescriptor | undefined];
const patched: PatchedProp[] = [];

function patch(proto: object, prop: string, descriptor: PropertyDescriptor): void {
  patched.push([proto, prop, Object.getOwnPropertyDescriptor(proto, prop)]);
  Object.defineProperty(proto, prop, { configurable: true, ...descriptor });
}

function installLayout(): void {
  const proto = HTMLElement.prototype;
  const rect = (top: number, height: number) => ({
    top,
    bottom: top + height,
    height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });

  patch(proto, 'clientHeight', {
    get(this: HTMLElement) {
      return slotOf(this) === 'message-scroller-viewport' ? VIEW : 0;
    },
  });
  patch(proto, 'scrollHeight', {
    get(this: HTMLElement) {
      return slotOf(this) === 'message-scroller-viewport' ? viewportMetrics(this).scrollHeight : 0;
    },
  });
  patch(proto, 'offsetHeight', {
    get(this: HTMLElement) {
      return slotOf(this) === 'message-scroller-content'
        ? viewportMetrics(this.parentElement as HTMLElement).contentHeight
        : 0;
    },
  });
  patch(proto, 'scrollTop', {
    get(this: HTMLElement) {
      return scrollTops.get(this) ?? 0;
    },
    set(this: HTMLElement, value: number) {
      if (slotOf(this) !== 'message-scroller-viewport') {
        return;
      }
      const max = Math.max(0, viewportMetrics(this).scrollHeight - VIEW);
      scrollTops.set(this, Math.min(Math.max(value, 0), max));
    },
  });
  patch(proto, 'scrollTo', {
    value(this: HTMLElement, options: { top: number; behavior?: string }) {
      scrollToCalls.push({ top: options.top, behavior: options.behavior });
      this.scrollTop = options.top;
    },
  });
  patch(proto, 'getBoundingClientRect', {
    value(this: HTMLElement) {
      const slot = slotOf(this);
      if (slot === 'message-scroller-viewport') {
        return rect(0, VIEW);
      }
      const viewport = this.closest('[data-slot="message-scroller-viewport"]') as HTMLElement | null;
      const scrolled = viewport ? (scrollTops.get(viewport) ?? 0) : 0;
      if (slot === 'message-scroller-content') {
        return rect(-scrolled, viewport ? viewportMetrics(viewport).contentHeight : 0);
      }
      if (slot === 'message-scroller-item') {
        return rect(rowsOf(this.parentElement).indexOf(this) * ROW - scrolled, ROW);
      }
      return rect(0, 0);
    },
  });
}

function uninstallLayout(): void {
  for (const [proto, prop, original] of patched.splice(0).reverse()) {
    if (original) {
      Object.defineProperty(proto, prop, original);
    } else {
      delete (proto as Record<string, unknown>)[prop];
    }
  }
}

class FakeObserver {
  static instances: FakeObserver[] = [];
  observed = new Set<Element>();
  disconnected = false;
  constructor(readonly callback: (entries: unknown[]) => void) {
    FakeObserver.instances.push(this);
  }

  observe(el: Element) {
    this.observed.add(el);
  }

  unobserve(el: Element) {
    this.observed.delete(el);
  }

  disconnect() {
    this.disconnected = true;
    this.observed.clear();
  }

  takeRecords() {
    return [];
  }

  fire(entries: unknown[] = []) {
    this.callback(entries);
  }
}
class FakeResizeObserver extends FakeObserver {}
class FakeMutationObserver extends FakeObserver {}
class FakeIntersectionObserver extends FakeObserver {}

const original = {
  resize: globalThis.ResizeObserver,
  mutation: globalThis.MutationObserver,
  intersection: globalThis.IntersectionObserver,
  matchMedia: globalThis.matchMedia,
};

const observers = (type: typeof FakeObserver) => FakeObserver.instances.filter(o => o instanceof type);

interface Row {
  id: string;
  anchor?: boolean;
}
const rows = (from: number, to: number, anchorEvery = 0): Row[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    id: `m${from + i}`,
    anchor: anchorEvery > 0 && (from + i) % anchorEvery === 0,
  }));

@Component({
  selector: 'z-test-message-scroller',
  imports: [...ZardMessageScrollerImports],
  template: `
    <z-message-scroller
      [zAutoScroll]="autoScroll()"
      [zDefaultPosition]="position()"
      [zPreserveScrollOnPrepend]="preserve()"
      [zEdgeThreshold]="threshold()"
      [zScrollMargin]="margin()"
      [class]="extraClass()"
    >
      @for (row of items(); track row.id) {
        <z-message-scroller-item [zMessageId]="row.id" [zAnchor]="!!row.anchor">{{ row.id }}</z-message-scroller-item>
      }
      <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
      <button z-message-scroller-button zDirection="start" aria-label="Back to top"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TestHost {
  readonly items = signal<Row[]>(rows(1, 12));
  readonly autoScroll = signal(false);
  readonly position = signal<'start' | 'end' | 'last-anchor'>('end');
  readonly preserve = signal(true);
  readonly threshold = signal(8);
  readonly margin = signal(0);
  readonly extraClass = signal('');
  readonly scroller = viewChild.required(ZardMessageScrollerComponent);
}

interface Setup {
  fixture: ComponentFixture<TestHost>;
  host: TestHost;
  el: HTMLElement;
  viewport: HTMLElement;
  service: ZardMessageScrollerService;
  /** Applies a change to the rows and lets the scroller reconcile, as its mutation/resize observers would. */
  update(fn: (items: Row[]) => Row[]): void;
  /** Simulates the reader scrolling: sets the position and fires the scroll event. */
  userScroll(top: number): Promise<void>;
  /** Simulates the browser reporting the scroll the scroller just made. */
  fireScroll(): Promise<void>;
}

const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 160));

async function setup(configure?: (host: TestHost) => void): Promise<Setup> {
  TestBed.configureTestingModule({ imports: [TestHost] });
  const fixture = TestBed.createComponent(TestHost);
  const host = fixture.componentInstance;
  configure?.(host);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();

  const el = fixture.nativeElement as HTMLElement;
  const viewport = el.querySelector('[data-slot="message-scroller-viewport"]') as HTMLElement;
  const service = fixture.debugElement.children[0].injector.get(ZardMessageScrollerService);

  const reconcile = () => {
    observers(FakeMutationObserver).forEach(o => o.fire());
    observers(FakeResizeObserver).forEach(o => o.fire());
  };

  return {
    fixture,
    host,
    el,
    viewport,
    service,
    update(fn) {
      host.items.update(fn);
      fixture.detectChanges();
      reconcile();
      fixture.detectChanges();
    },
    async userScroll(top) {
      viewport.scrollTop = top;
      viewport.dispatchEvent(new Event('scroll'));
      await frame();
      fixture.detectChanges();
    },
    async fireScroll() {
      viewport.dispatchEvent(new Event('scroll'));
      await frame();
      fixture.detectChanges();
    },
  };
}

const max = (n: number) => n * ROW - VIEW;
const wheel = (viewport: HTMLElement, deltaY: number) =>
  viewport.dispatchEvent(Object.assign(new Event('wheel'), { deltaY }));

describe('ZardMessageScrollerComponent', () => {
  beforeEach(() => {
    FakeObserver.instances = [];
    scrollToCalls.length = 0;
    globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
    globalThis.MutationObserver = FakeMutationObserver as unknown as typeof MutationObserver;
    globalThis.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
    installLayout();
  });

  afterEach(() => {
    uninstallLayout();
    globalThis.ResizeObserver = original.resize;
    globalThis.MutationObserver = original.mutation;
    globalThis.IntersectionObserver = original.intersection;
    globalThis.matchMedia = original.matchMedia;
    TestBed.resetTestingModule();
  });

  describe('structure and accessibility', () => {
    it('renders a labelled, keyboard-focusable region around a log', async () => {
      const { el } = await setup();
      const region = el.querySelector('[role="region"]') as HTMLElement;

      expect(region).toHaveAttribute('aria-label', 'Messages');
      expect(region).toHaveAttribute('tabindex', '0');
      expect(region).toHaveAttribute('data-slot', 'message-scroller-viewport');

      const log = region.querySelector('[role="log"]') as HTMLElement;
      expect(log).toBeInTheDocument();
      expect(log).toHaveAttribute('aria-relevant', 'additions');
      expect(log).toHaveAttribute('data-slot', 'message-scroller-content');
    });

    it('moves a custom aria-label from the host to the viewport', async () => {
      @Component({
        imports: [...ZardMessageScrollerImports],
        template: `
          <z-message-scroller aria-label="Conversation">
            <z-message-scroller-item zMessageId="a">a</z-message-scroller-item>
          </z-message-scroller>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
      })
      class Labelled {}
      const fixture = TestBed.createComponent(Labelled);
      fixture.detectChanges();

      const root = fixture.nativeElement.querySelector('z-message-scroller') as HTMLElement;
      expect(root).not.toHaveAttribute('aria-label');
      expect(fixture.nativeElement.querySelector('[role="region"]')).toHaveAttribute('aria-label', 'Conversation');
    });

    it('keeps the aria-hidden spacer out of the accessibility tree', async () => {
      const { el } = await setup();
      expect(el.querySelector('[data-slot="message-scroller-spacer"]')).toHaveAttribute('aria-hidden', 'true');
    });

    it('projects the rows into the log and the buttons outside the viewport', async () => {
      const { el } = await setup();
      const log = el.querySelector('[role="log"]') as HTMLElement;

      expect(log.querySelectorAll('[data-slot="message-scroller-item"]')).toHaveLength(12);
      expect(log.querySelector('button')).toBeNull();
      expect(el.querySelectorAll('[data-slot="message-scroller-button"]')).toHaveLength(2);
    });
  });

  describe('root and item attributes', () => {
    it('merges the class input last on the host', async () => {
      const { el, host, fixture } = await setup();
      const root = el.querySelector('z-message-scroller') as HTMLElement;
      expect(root).toHaveClass('relative', 'flex', 'overflow-hidden');

      host.extraClass.set('h-96 overflow-visible');
      fixture.detectChanges();
      expect(root).toHaveClass('h-96', 'overflow-visible');
      expect(root).not.toHaveClass('overflow-hidden');
    });

    it('reflects the message id and anchor flag on each item', async () => {
      const { el } = await setup(host => host.items.set([{ id: 'a', anchor: true }, { id: 'b' }]));
      const [first, second] = Array.from(el.querySelectorAll('[data-slot="message-scroller-item"]'));

      expect(first).toHaveAttribute('data-message-id', 'a');
      expect(first).toHaveAttribute('data-scroll-anchor', 'true');
      expect(second).toHaveAttribute('data-message-id', 'b');
      expect(second).toHaveAttribute('data-scroll-anchor', 'false');
    });
  });

  describe('default position', () => {
    it('opens at the end and clears the pending state', async () => {
      const { viewport, el } = await setup();
      expect(viewport.scrollTop).toBe(max(12));
      expect(el.querySelector('z-message-scroller')).not.toHaveAttribute('data-pending-scroll');
      expect(viewport).not.toHaveAttribute('data-pending-scroll');
    });

    it('opens at the start', async () => {
      const { viewport } = await setup(host => host.position.set('start'));
      expect(viewport.scrollTop).toBe(0);
    });

    it('opens at the last anchor when its turn does not fit', async () => {
      // anchor m8, then m8..m12 = 5 rows = 250px, taller than the 200px viewport
      const { viewport } = await setup(host => {
        host.position.set('last-anchor');
        host.items.set(rows(1, 12, 8));
      });
      expect(viewport.scrollTop).toBe(7 * ROW);
    });

    it('falls back to the end when the last turn fits the viewport', async () => {
      // anchor m12 is the last row: the turn is 50px, so the end already shows it
      const { viewport } = await setup(host => {
        host.position.set('last-anchor');
        host.items.set(rows(1, 12, 12));
      });
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('falls back to the end when there is no anchor', async () => {
      const { viewport } = await setup(host => host.position.set('last-anchor'));
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('applies the position once: later rows do not move a reader who is not following', async () => {
      const { viewport, update } = await setup();
      viewport.scrollTop = 100;
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(100);
    });

    it('does not keep an empty transcript hidden, and positions it on the first rows', async () => {
      const { viewport, el, update } = await setup(host => host.items.set([]));
      expect(viewport).not.toHaveAttribute('data-pending-scroll');
      expect(el.querySelector('[role="log"]')?.children.length).toBe(0);

      update(() => rows(1, 12));
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('does not mark a start position as pending', async () => {
      const { viewport } = await setup(host => host.position.set('start'));
      expect(viewport).not.toHaveAttribute('data-pending-scroll');
    });
  });

  describe('scrollable state', () => {
    it('reports both edges and mirrors them as data-scrollable', async () => {
      const { service, viewport, el, userScroll, fixture } = await setup();
      const root = el.querySelector('z-message-scroller') as HTMLElement;

      // at the end of a long transcript: more above, nothing below
      expect(service.scrollable()).toEqual({ start: true, end: false });
      expect(viewport).toHaveAttribute('data-scrollable', 'start');

      await userScroll(100);
      expect(service.scrollable()).toEqual({ start: true, end: true });
      expect(viewport).toHaveAttribute('data-scrollable', 'start end');
      expect(root).toHaveAttribute('data-scrollable', 'start end');

      await userScroll(0);
      fixture.detectChanges();
      expect(service.scrollable()).toEqual({ start: false, end: true });
      expect(viewport).toHaveAttribute('data-scrollable', 'end');
    });

    it('is absent when the transcript fits', async () => {
      const { service, viewport } = await setup(host => host.items.set(rows(1, 2)));
      expect(service.scrollable()).toEqual({ start: false, end: false });
      expect(viewport).not.toHaveAttribute('data-scrollable');
    });

    it('counts distances within zEdgeThreshold as being at the edge', async () => {
      const { service, userScroll } = await setup(host => host.threshold.set(30));
      await userScroll(max(12) - 20);
      expect(service.scrollable().end).toBe(false);
      await userScroll(max(12) - 40);
      expect(service.scrollable().end).toBe(true);
    });
  });

  describe('following the live edge', () => {
    it('follows new rows while at the edge', async () => {
      const { viewport, update } = await setup(host => host.autoScroll.set(true));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(14));
    });

    it('does not follow when zAutoScroll is off', async () => {
      const { viewport, update } = await setup();
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('keeps scrollable.end false while following', async () => {
      const { service, update } = await setup(host => host.autoScroll.set(true));
      update(items => [...items, ...rows(13, 14)]);
      expect(service.scrollable().end).toBe(false);
    });

    it('is released by wheel scrolling up', async () => {
      const { viewport, update } = await setup(host => host.autoScroll.set(true));
      wheel(viewport, -40);
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(12));
    });

    it.each(['ArrowUp', 'PageUp', 'Home'])('is released by the %s key', async key => {
      const { viewport, update } = await setup(host => host.autoScroll.set(true));
      viewport.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('ignores navigation keys typed in a field inside the transcript', async () => {
      const { viewport, update, host } = await setup(h => h.autoScroll.set(true));
      const input = document.createElement('input');
      viewport.appendChild(input);
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(14));
      expect(host.autoScroll()).toBe(true);
    });

    it('is released by a scroll away from the edge, and resumes when the reader returns', async () => {
      const { viewport, update, userScroll } = await setup(host => host.autoScroll.set(true));
      await userScroll(100);
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(100);

      await userScroll(max(14));
      update(items => [...items, ...rows(15, 16)]);
      expect(viewport.scrollTop).toBe(max(16));
    });

    it('does not scroll under a finger that is on the screen', async () => {
      const { viewport, update } = await setup(host => host.autoScroll.set(true));
      viewport.dispatchEvent(new Event('touchstart'));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(12));

      viewport.dispatchEvent(new Event('touchend'));
      update(items => [...items, ...rows(15, 16)]);
      expect(viewport.scrollTop).toBe(max(16));
    });

    it('is released by an explicit jump to a message', async () => {
      const { viewport, update, service } = await setup(host => host.autoScroll.set(true));
      service.scrollToMessage('m2');
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(ROW);
    });

    it('is released by a scrollbar drag, even while a follow scroll is in flight', async () => {
      const { viewport, update, userScroll } = await setup(host => host.autoScroll.set(true));
      update(items => [...items, ...rows(13, 14)]); // a follow scroll is now in flight
      viewport.dispatchEvent(new Event('pointerdown')); // the press lands on the viewport: its scrollbar
      await userScroll(100);
      update(items => [...items, ...rows(15, 16)]);
      expect(viewport.scrollTop).toBe(100);

      viewport.dispatchEvent(new Event('pointerup'));
      document.dispatchEvent(new Event('pointerup'));
      update(items => [...items, ...rows(17, 18)]);
      expect(viewport.scrollTop).toBe(100);
    });

    it('ignores presses on the rows, which are not scrollbar drags', async () => {
      const { viewport, update, el } = await setup(host => host.autoScroll.set(true));
      const row = el.querySelector('[data-slot="message-scroller-item"]') as HTMLElement;
      row.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(14));
    });

    it('resumes following when a jump to a message lands on the bottom', async () => {
      const { viewport, update, service } = await setup(host => host.autoScroll.set(true));
      service.scrollToMessage('m12', { align: 'end' });
      expect(viewport.scrollTop).toBe(max(12));
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(14));
    });

    it('is resumed by scrollToEnd', async () => {
      const { viewport, update, service, userScroll } = await setup(host => host.autoScroll.set(true));
      await userScroll(100);
      await settle();
      service.scrollToEnd();
      await settle();
      update(items => [...items, ...rows(13, 14)]);
      expect(viewport.scrollTop).toBe(max(14));
    });

    it('reflects data-autoscrolling while scrolling to the end', async () => {
      const { service, viewport, userScroll, fixture } = await setup();
      await userScroll(0);
      await settle();
      service.scrollToEnd({ behavior: 'smooth' });
      fixture.detectChanges();
      expect(viewport).toHaveAttribute('data-autoscrolling');

      await settle();
      fixture.detectChanges();
      expect(viewport).not.toHaveAttribute('data-autoscrolling');
    });
  });

  describe('anchoring new turns', () => {
    it('settles an appended anchor near the top with a peek of the previous row', async () => {
      const { viewport, update } = await setup();
      update(items => [...items, { id: 'm13', anchor: true }, { id: 'm14' }]);
      // m13 sits at 12 * 50 = 600; the previous row peeks 64px above it
      expect(viewport.scrollTop).toBe(600 - 64);
    });

    it('makes room below a short reply with the spacer, and releases it once the reply is long', async () => {
      const { viewport, el, update } = await setup();
      update(items => [...items, { id: 'm13', anchor: true }, { id: 'm14' }]);

      const spacer = el.querySelector('[data-slot="message-scroller-spacer"]') as HTMLElement;
      expect(parseFloat(spacer.style.height)).toBeGreaterThan(0);

      update(items => [...items, ...rows(15, 22)]);
      expect(parseFloat(spacer.style.height)).toBe(0);
      expect(viewport.scrollTop).toBe(600 - 64);
    });

    it('leaves a reader who scrolled away where they are', async () => {
      const { viewport, update, userScroll } = await setup();
      await userScroll(100);
      update(items => [...items, { id: 'm13', anchor: true }]);
      expect(viewport.scrollTop).toBe(100);
    });

    it('anchors only the last appended anchor', async () => {
      const { viewport, update } = await setup();
      update(items => [...items, { id: 'm13', anchor: true }, { id: 'm14', anchor: true }, { id: 'm15' }]);
      expect(viewport.scrollTop).toBe(13 * ROW - 64);
    });
  });

  describe('prepending history', () => {
    it('keeps the visible row where it was', async () => {
      const { viewport, update, userScroll } = await setup();
      await userScroll(200);
      update(items => [...rows(-2, 0), ...items]);
      expect(viewport.scrollTop).toBe(200 + 3 * ROW);
    });

    it('does nothing when zPreserveScrollOnPrepend is off', async () => {
      const { viewport, update, userScroll } = await setup(host => host.preserve.set(false));
      await userScroll(200);
      update(items => [...rows(-2, 0), ...items]);
      expect(viewport.scrollTop).toBe(200);
    });

    it('does not move when rows are appended below the reader', async () => {
      const { viewport, update, userScroll } = await setup();
      await userScroll(200);
      update(items => [...items, ...rows(13, 15)]);
      expect(viewport.scrollTop).toBe(200);
    });

    it('also holds the row when something above it resizes', async () => {
      const { viewport, update, userScroll } = await setup();
      await userScroll(200);
      // rows inserted above stand in for any layout change above the visible row
      update(items => [...rows(-9, 0), ...items]);
      expect(viewport.scrollTop).toBe(200 + 10 * ROW);
    });
  });

  describe('commands', () => {
    it('scrollToEnd and scrollToStart move the viewport and return true', async () => {
      const { service, viewport } = await setup();
      expect(service.scrollToStart()).toBe(true);
      expect(viewport.scrollTop).toBe(0);
      expect(service.scrollToEnd()).toBe(true);
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('scrollToMessage returns false for an id that is not mounted', async () => {
      const { service, viewport } = await setup();
      expect(service.scrollToMessage('missing')).toBe(false);
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('aligns to start, center and end', async () => {
      const { service, viewport } = await setup();
      // m5 is at 200..250
      service.scrollToMessage('m5');
      expect(viewport.scrollTop).toBe(200);
      service.scrollToMessage('m5', { align: 'center' });
      expect(viewport.scrollTop).toBe(200 + ROW / 2 - VIEW / 2);
      service.scrollToMessage('m5', { align: 'end' });
      expect(viewport.scrollTop).toBe(250 - VIEW);
    });

    it('aligns to the nearest edge only when the row is out of view', async () => {
      const { service, viewport } = await setup();
      service.scrollToStart();
      // m2 (50..100) is already visible at scrollTop 0
      service.scrollToMessage('m2', { align: 'nearest' });
      expect(viewport.scrollTop).toBe(0);
      // m6 (250..300) is below: align its end
      service.scrollToMessage('m6', { align: 'nearest' });
      expect(viewport.scrollTop).toBe(300 - VIEW);
      // m1 is above: align its start
      service.scrollToMessage('m1', { align: 'nearest' });
      expect(viewport.scrollTop).toBe(0);
    });

    it('applies the zScrollMargin input and lets the option override it', async () => {
      const { service, viewport, host, fixture } = await setup();
      host.margin.set(10);
      fixture.detectChanges();
      service.scrollToMessage('m5');
      expect(viewport.scrollTop).toBe(190);

      service.scrollToMessage('m5', { scrollMargin: 30 });
      expect(viewport.scrollTop).toBe(170);
    });

    it('clamps the target to the scrollable range', async () => {
      const { service, viewport } = await setup();
      service.scrollToMessage('m12');
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('uses native smooth scrolling when asked', async () => {
      const { service } = await setup();
      service.scrollToMessage('m3', { behavior: 'smooth' });
      expect(scrollToCalls.at(-1)).toEqual({ top: 100, behavior: 'smooth' });
    });

    it('falls back to instant scrolling under prefers-reduced-motion', async () => {
      globalThis.matchMedia = ((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
      })) as unknown as typeof matchMedia;
      const { service, viewport } = await setup();
      service.scrollToMessage('m3', { behavior: 'smooth' });
      expect(scrollToCalls).toHaveLength(0);
      expect(viewport.scrollTop).toBe(100);
    });

    it('is the same instance inside the scroller and through the component', async () => {
      const { service, host } = await setup();
      expect(host.scroller().service).toBe(service);
    });
  });

  describe('visibility', () => {
    it('lists the intersecting ids in document order', async () => {
      const { service, el } = await setup();
      const [observer] = observers(FakeIntersectionObserver);
      const item = (id: string) => el.querySelector(`[data-message-id="${id}"]`) as Element;

      observer.fire([
        { target: item('m9'), isIntersecting: true },
        { target: item('m8'), isIntersecting: true },
        { target: item('m11'), isIntersecting: true },
      ]);
      expect(service.visibleMessageIds()).toEqual(['m8', 'm9', 'm11']);

      observer.fire([{ target: item('m8'), isIntersecting: false }]);
      expect(service.visibleMessageIds()).toEqual(['m9', 'm11']);
    });

    it('observes rows as they are added and stops when they are removed', async () => {
      const { update } = await setup();
      const [observer] = observers(FakeIntersectionObserver);
      expect(observer.observed.size).toBe(12);

      update(items => items.slice(2));
      expect(observer.observed.size).toBe(10);

      update(items => [...items, ...rows(13, 14)]);
      expect(observer.observed.size).toBe(12);
    });

    it('tracks the anchored turn at or above the reading line', async () => {
      const { service, userScroll } = await setup(host => host.items.set(rows(1, 12, 4)));
      // anchors: m4 (150), m8 (350), m12 (550). At scrollTop 400 the line is at 400: m8 is the last above it.
      await userScroll(400);
      expect(service.currentAnchorId()).toBe('m8');

      await userScroll(100);
      expect(service.currentAnchorId()).toBeNull();

      await userScroll(max(12));
      expect(service.currentAnchorId()).toBe('m8');
    });
  });

  describe('button', () => {
    it('is inert and out of the tab order when there is nothing that way', async () => {
      const { el } = await setup();
      const down = el.querySelector('[data-direction="end"]') as HTMLElement;

      expect(down).toHaveAttribute('data-active', 'false');
      expect(down).toHaveAttribute('inert');
      expect(down).toHaveAttribute('tabindex', '-1');
    });

    it('is active, focusable and clickable once there is something to scroll toward', async () => {
      const { el, userScroll, viewport } = await setup();
      await userScroll(0);
      const down = el.querySelector('[data-direction="end"]') as HTMLButtonElement;
      const up = el.querySelector('[data-direction="start"]') as HTMLButtonElement;

      expect(down).toHaveAttribute('data-active', 'true');
      expect(down).not.toHaveAttribute('inert');
      expect(down).not.toHaveAttribute('tabindex');
      expect(up).toHaveAttribute('inert');

      down.click();
      expect(scrollToCalls.at(-1)).toEqual({ top: max(12), behavior: 'smooth' });
      expect(viewport.scrollTop).toBe(max(12));
    });

    it('scrolls to the start for zDirection="start"', async () => {
      const { el, viewport } = await setup();
      const up = el.querySelector('[data-direction="start"]') as HTMLButtonElement;
      expect(up).toHaveAttribute('data-active', 'true');

      up.click();
      expect(viewport.scrollTop).toBe(0);
    });

    it('is a real button that never submits a form', async () => {
      const { el } = await setup();
      const button = el.querySelector('[data-slot="message-scroller-button"]') as HTMLButtonElement;
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('adds a default accessible name only when none is given', async () => {
      TestBed.configureTestingModule({ imports: [ZardMessageScrollerImports] });
      @Component({
        imports: [...ZardMessageScrollerImports],
        template: `
          <z-message-scroller>
            <z-message-scroller-item zMessageId="a">a</z-message-scroller-item>
            <button z-message-scroller-button>{{ '' }}</button>
            <button z-message-scroller-button zDirection="start" aria-label="Top"></button>
          </z-message-scroller>
        `,
        changeDetection: ChangeDetectionStrategy.Eager,
      })
      class Unlabelled {}
      const fixture = TestBed.createComponent(Unlabelled);
      fixture.detectChanges();

      const [end, start] = Array.from(
        fixture.nativeElement.querySelectorAll('[data-slot="message-scroller-button"]'),
      ) as HTMLElement[];
      expect(end).toHaveTextContent('Scroll to end');
      expect(start).not.toHaveTextContent('Scroll to start');
    });
  });

  describe('lifecycle', () => {
    it('releases its observers and listeners on destroy', async () => {
      const { fixture, viewport } = await setup(host => host.autoScroll.set(true));
      fixture.destroy();

      expect(FakeObserver.instances.length).toBeGreaterThan(0);
      expect(FakeObserver.instances.every(o => o.disconnected)).toBe(true);

      viewport.scrollTop = 0;
      expect(() => viewport.dispatchEvent(new Event('scroll'))).not.toThrow();
    });

    it('returns false from every command once destroyed', async () => {
      const { fixture, service } = await setup();
      fixture.destroy();

      expect(service.scrollToEnd()).toBe(false);
      expect(service.scrollToStart()).toBe(false);
      expect(service.scrollToMessage('m1')).toBe(false);
    });

    it('does not touch the DOM on the server', async () => {
      TestBed.configureTestingModule({
        imports: [TestHost],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      const fixture = TestBed.createComponent(TestHost);
      fixture.detectChanges();
      await fixture.whenStable();

      const service = fixture.debugElement.children[0].injector.get(ZardMessageScrollerService);
      expect(FakeObserver.instances).toHaveLength(0);
      expect(service.scrollToEnd()).toBe(false);
      expect(service.scrollToMessage('m1')).toBe(false);
      // the opening position is still pending, so the markup can hide the transcript until the browser applies it
      expect(fixture.nativeElement.querySelector('[data-slot="message-scroller-viewport"]')).toHaveAttribute(
        'data-pending-scroll',
      );
    });
  });
});
