import { test, expect, type Locator, type Page } from '@playwright/test';

import { checkA11y } from '../utils/axe-helper';
import { ComponentDemoPage } from '../utils/component-page';

/** The scrollable viewport inside a demo. */
const viewportOf = (demo: Locator) => demo.locator('[data-slot="message-scroller-viewport"]');

/** Pixels left to scroll toward the end of the transcript. */
const distanceToEnd = (viewport: Locator) => viewport.evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop);

const scrollTopOf = (viewport: Locator) => viewport.evaluate(el => el.scrollTop);

/** Distance in px between the top of an element and the top of its viewport. */
const offsetInViewport = (viewport: Locator, item: Locator) =>
  Promise.all([viewport.boundingBox(), item.boundingBox()]).then(([v, i]) => (i?.y ?? 0) - (v?.y ?? 0));

/** A reader scrolling: the wheel is what releases following, so use it instead of assigning scrollTop. */
async function wheelUp(page: Page, viewport: Locator, deltaY = 300) {
  const box = await viewport.boundingBox();
  await page.mouse.move((box?.x ?? 0) + (box?.width ?? 0) / 2, (box?.y ?? 0) + (box?.height ?? 0) / 2);
  await page.mouse.wheel(0, -deltaY);
}

test.describe('Message Scroller component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'message-scroller');
    await demoPage.goto();
  });

  test.describe('structure', () => {
    test('exposes a labelled, focusable region that contains a log', async () => {
      const scroller = demoPage.firstDemoBox.locator('z-message-scroller');
      const region = scroller.getByRole('region', { name: 'Messages' });

      await expect(region).toBeVisible();
      await expect(region).toHaveAttribute('tabindex', '0');
      await expect(region.locator('[role="log"]')).toHaveAttribute('aria-relevant', 'additions');
    });

    test('keeps the keyboard able to scroll the transcript', async ({ page }) => {
      const viewport = viewportOf(demoPage.firstDemoBox);
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      await viewport.focus();
      const before = await scrollTopOf(viewport);
      await page.keyboard.press('PageUp');
      await expect.poll(() => scrollTopOf(viewport)).toBeLessThan(before);

      await page.keyboard.press('End');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
    });
  });

  test.describe('opening position', () => {
    test('opens at the end of the transcript', async () => {
      const viewport = viewportOf(demoPage.firstDemoBox);
      await expect(viewport).not.toHaveAttribute('data-pending-scroll');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      expect(await scrollTopOf(viewport)).toBeGreaterThan(0);
    });

    test('opens a saved thread at the last anchored turn', async () => {
      const demo = demoPage.getDemoByName('last-anchor');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();

      const lastAnchor = demo.locator('z-message-scroller-item[data-scroll-anchor="true"]').last();
      await expect.poll(async () => Math.abs(await offsetInViewport(viewport, lastAnchor))).toBeLessThanOrEqual(2);
      // the reply is longer than the viewport, so it opened at the anchor, not at the bottom
      expect(await distanceToEnd(viewport)).toBeGreaterThan(8);
    });
  });

  test.describe('jump button', () => {
    test('is inert at the live edge and becomes usable after scrolling away', async ({ page }) => {
      const scroller = demoPage.firstDemoBox.locator('z-message-scroller');
      const viewport = viewportOf(demoPage.firstDemoBox);
      const button = scroller.locator('[z-message-scroller-button]');

      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
      await expect(button).toHaveAttribute('inert', '');
      await expect(button).toHaveAttribute('tabindex', '-1');

      await wheelUp(page, viewport);
      await expect(button).toHaveAttribute('data-active', 'true');
      await expect(button).not.toHaveAttribute('inert');
      await expect(button).not.toHaveAttribute('tabindex');
      await expect(scroller).toHaveAttribute('data-scrollable', /end/);

      await button.click();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
    });

    test('is reachable with the keyboard only while active', async ({ page }) => {
      const scroller = demoPage.firstDemoBox.locator('z-message-scroller');
      const viewport = viewportOf(demoPage.firstDemoBox);
      const button = scroller.locator('[z-message-scroller-button]');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      await viewport.focus();
      await page.keyboard.press('Tab');
      await expect(button).not.toBeFocused();

      await viewport.focus();
      await page.keyboard.press('Home');
      await expect(button).toHaveAttribute('data-active', 'true');
      await page.keyboard.press('Tab');
      await expect(button).toBeFocused();
      await page.keyboard.press('Enter');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
    });

    test('scrolls instantly under prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const scroller = demoPage.firstDemoBox.locator('z-message-scroller');
      const viewport = viewportOf(demoPage.firstDemoBox);
      await wheelUp(page, viewport);

      await scroller.locator('[z-message-scroller-button]').click();
      // no animation: the end is reached within two frames instead of over hundreds of milliseconds
      await page.evaluate(
        () => new Promise<void>(done => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
      );
      expect(await distanceToEnd(viewport)).toBeLessThanOrEqual(8);
    });
  });

  test.describe('streaming', () => {
    test('follows the answer while the reader stays at the live edge', async ({ page }) => {
      const demo = demoPage.getDemoByName('streaming');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();
      const send = demo.locator('button[z-button]');
      const rows = demo.locator('z-message-scroller-item');
      const before = await rows.count();

      await send.click();
      await expect(rows).toHaveCount(before + 2);
      await expect(send).toBeEnabled({ timeout: 20_000 });

      expect(await distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(viewport).not.toHaveAttribute('data-autoscrolling');
      // the follow never released, so there is nothing to jump back to
      await expect(demo.locator('[z-message-scroller-button]')).toHaveAttribute('data-active', 'false');
      void page;
    });

    test('lets go as soon as the reader scrolls up, and the button brings it back', async ({ page }) => {
      const demo = demoPage.getDemoByName('streaming');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();
      const send = demo.locator('button[z-button]');
      const button = demo.locator('[z-message-scroller-button]');

      await send.click();
      await expect(demo.locator('z-message-scroller-item')).toHaveCount(4);
      const beforeWheel = await scrollTopOf(viewport);
      await wheelUp(page, viewport, 200);
      // the wheel does not wait for the scroll it causes: let it land, and settle, before recording the position
      await expect.poll(() => scrollTopOf(viewport)).toBeLessThan(beforeWheel);
      let released = await scrollTopOf(viewport);
      await expect
        .poll(async () => {
          const current = await scrollTopOf(viewport);
          const settled = current === released;
          released = current;
          return settled;
        })
        .toBe(true);

      await expect(send).toBeEnabled({ timeout: 20_000 });
      expect(await scrollTopOf(viewport)).toBe(released);
      await expect(button).toHaveAttribute('data-active', 'true');

      await button.click();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
    });
  });

  test.describe('loading earlier messages', () => {
    test('keeps the visible row in place when older rows are prepended', async () => {
      const demo = demoPage.getDemoByName('load-earlier');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      // read near the top of the loaded history, with the first loaded message as the first visible row
      const reference = demo.locator('z-message-scroller-item[data-message-id="m19"]');
      await viewport.evaluate(el => {
        const row = el.querySelector('[data-message-id="m19"]') as HTMLElement;
        el.scrollTop += row.getBoundingClientRect().top - el.getBoundingClientRect().top + 12;
      });
      await expect.poll(() => offsetInViewport(viewport, reference)).toBeLessThan(0);
      const rows = demo.locator('z-message-scroller-item');
      const rowsBefore = await rows.count();
      const offsetBefore = await offsetInViewport(viewport, reference);

      // dispatch the click: the load row is scrolled out of view and a real click would scroll it back
      await demo.locator('button[z-button]').dispatchEvent('click');
      await expect(rows).toHaveCount(rowsBefore + 6);

      // the same row is exactly where the reader left it; the new history is above, out of view
      await expect
        .poll(async () => Math.abs((await offsetInViewport(viewport, reference)) - offsetBefore))
        .toBeLessThanOrEqual(2);
      expect(await scrollTopOf(viewport)).toBeGreaterThan(0);
    });

    test('lets the reader keep going up into the loaded history', async () => {
      const demo = demoPage.getDemoByName('load-earlier');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      await viewport.evaluate(el => {
        el.scrollTop = 0;
      });
      await demo.locator('button[z-button]').click();
      await expect(demo.locator('z-message-scroller-item[data-message-id="m13"]')).toBeAttached();
      await expect(demo.locator('button[z-button]')).toBeEnabled();
    });
  });

  test.describe('jump to message', () => {
    test('scrolls a mounted message into view from a control outside the transcript', async () => {
      const demo = demoPage.getDemoByName('jump-to-message');
      const viewport = viewportOf(demo);
      await demo.scrollIntoViewIfNeeded();
      const target = demo.locator('z-message-scroller-item[data-message-id="m20"]');

      await expect.poll(() => scrollTopOf(viewport)).toBeGreaterThan(0);
      await demo.locator('button[data-target="20"]').click();

      await expect
        .poll(async () => {
          const [v, t] = await Promise.all([viewport.boundingBox(), target.boundingBox()]);
          return !!v && !!t && t.y >= v.y && t.y + t.height <= v.y + v.height;
        })
        .toBe(true);
      // an explicit jump releases the live edge
      await expect(demo.locator('[z-message-scroller-button]')).toHaveAttribute('data-active', 'true');
    });
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview');
  });
});
