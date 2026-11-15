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

/** A click that lands before the page has hydrated does nothing, so retry until the expected effect shows up. */
async function clickUntil(button: Locator, effect: () => Promise<void>) {
  await expect(async () => {
    await button.click();
    await effect();
  }).toPass({ timeout: 20_000 });
}

test.describe('Message Scroller component', () => {
  let demoPage: ComponentDemoPage;

  test.beforeEach(async ({ page }) => {
    demoPage = new ComponentDemoPage(page, 'message-scroller');
    await demoPage.goto();
  });

  test.describe('structure', () => {
    test('exposes a labelled, focusable region that contains a log', async () => {
      const demo = demoPage.getDemoByName('commands');
      await demo.scrollIntoViewIfNeeded();
      const region = demo.getByRole('region', { name: 'Messages' });

      await expect(region).toBeVisible();
      await expect(region).toHaveAttribute('tabindex', '0');
      await expect(region.locator('[role="log"]')).toHaveAttribute('aria-relevant', 'additions');
    });

    test('keeps the keyboard able to scroll the transcript', async ({ page }) => {
      const demo = demoPage.getDemoByName('commands');
      await demo.scrollIntoViewIfNeeded();
      const viewport = viewportOf(demo);
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      await viewport.focus();
      const before = await scrollTopOf(viewport);
      await page.keyboard.press('PageUp');
      await expect.poll(() => scrollTopOf(viewport)).toBeLessThan(before);

      await page.keyboard.press('End');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
    });
  });

  test.describe('preview', () => {
    test('starts empty and anchors the sent message as the reply streams in', async () => {
      const preview = demoPage.firstDemoBox;
      const send = preview.locator('button[type="submit"]');
      await expect(preview.locator('z-empty')).toBeVisible();

      await clickUntil(send, () =>
        expect(preview.locator('z-message-scroller-item')).toHaveCount(1, { timeout: 1_000 }),
      );
      await expect(preview.locator('z-message-scroller-item')).toHaveCount(2, { timeout: 10_000 });
      await expect(preview.getByRole('log')).toHaveAttribute('aria-busy', 'true');
      await expect(send).toBeEnabled({ timeout: 30_000 });
      await expect(preview.getByRole('log')).not.toHaveAttribute('aria-busy');
    });
  });

  test.describe('anchoring', () => {
    test('a new anchored turn settles near the top with a peek of the previous one', async () => {
      const demo = demoPage.getDemoByName('anchoring');
      await demo.scrollIntoViewIfNeeded();
      const send = demo.getByRole('button', { name: 'Send Message' });
      const rows = demo.locator('z-message-scroller-item');

      await clickUntil(send, () => expect(rows).toHaveCount(1, { timeout: 1_000 }));
      await send.click();
      await send.click();
      await expect(rows).toHaveCount(3);

      const viewport = viewportOf(demo);
      const anchor = rows.nth(2);
      await expect(anchor).toHaveAttribute('data-scroll-anchor', 'true');
      // the anchor sits below the top by the previous-row peek (64px by default), not at the very top
      await expect.poll(() => offsetInViewport(viewport, anchor)).toBeGreaterThan(32);
      expect(await offsetInViewport(viewport, anchor)).toBeLessThan(120);
    });

    test('a marker can anchor a turn in a group chat', async () => {
      const demo = demoPage.getDemoByName('group-chat');
      await demo.scrollIntoViewIfNeeded();
      const marker = demo.locator('z-message-scroller-item', { has: demo.page().locator('z-marker') });

      await clickUntil(demo.getByRole('button', { name: 'Add Rocky' }), () =>
        expect(marker).toHaveCount(1, { timeout: 1_000 }),
      );
      await expect(marker).toHaveAttribute('data-scroll-anchor', 'true');
      await expect.poll(() => offsetInViewport(viewportOf(demo), marker)).toBeLessThan(120);
    });
  });

  test.describe('opening position', () => {
    test('opens at the start or at the end as chosen', async () => {
      const demo = demoPage.getDemoByName('opening-position');
      await demo.scrollIntoViewIfNeeded();
      const viewport = () => viewportOf(demo);

      await clickUntil(demo.getByRole('button', { name: 'start', exact: true }), () =>
        expect.poll(() => scrollTopOf(viewport()), { timeout: 1_000 }).toBe(0),
      );
      await demo.getByRole('button', { name: 'end', exact: true }).click();
      await expect.poll(() => distanceToEnd(viewport())).toBeLessThanOrEqual(8);
      await expect(viewport()).not.toHaveAttribute('data-pending-scroll');
    });
  });

  test.describe('jump button', () => {
    test('is inert at the live edge and becomes usable after scrolling away', async ({ page }) => {
      const demo = demoPage.getDemoByName('commands');
      await demo.scrollIntoViewIfNeeded();
      const scroller = demo.locator('z-message-scroller');
      const viewport = viewportOf(demo);
      const button = scroller.locator('[z-message-scroller-button]');

      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
      await expect(button).toHaveAttribute('inert', '');
      await expect(button).toHaveAttribute('tabindex', '-1');

      await wheelUp(page, viewport);
      await expect(button).toHaveAttribute('data-active', 'true');
      await expect(button).not.toHaveAttribute('inert');
      await expect(scroller).toHaveAttribute('data-scrollable', /end/);

      await button.click();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
    });

    test('scrolls instantly under prefers-reduced-motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const demo = demoPage.getDemoByName('commands');
      await demo.scrollIntoViewIfNeeded();
      const viewport = viewportOf(demo);
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await wheelUp(page, viewport);
      const button = demo.locator('[z-message-scroller-button]');
      await expect(button).toHaveAttribute('data-active', 'true');

      await button.click();
      // no animation: the end is reached within two frames instead of over hundreds of milliseconds
      await page.evaluate(
        () => new Promise<void>(done => requestAnimationFrame(() => requestAnimationFrame(() => done()))),
      );
      expect(await distanceToEnd(viewport)).toBeLessThanOrEqual(8);
    });
  });

  test.describe('streaming', () => {
    test('follows the answer while the reader stays at the live edge', async () => {
      const demo = demoPage.getDemoByName('streaming');
      await demo.scrollIntoViewIfNeeded();
      const send = demo.locator('button[type="submit"]');
      const rows = demo.locator('z-message-scroller-item');

      await clickUntil(send, () => expect(rows).toHaveCount(1, { timeout: 1_000 }));
      await expect(rows).toHaveCount(2, { timeout: 10_000 });
      await expect(send).toBeEnabled({ timeout: 30_000 });

      const viewport = viewportOf(demo);
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(viewport).not.toHaveAttribute('data-autoscrolling');
      // the follow never released, so there is nothing to jump back to
      await expect(demo.locator('[z-message-scroller-button]')).toHaveAttribute('data-active', 'false');
    });

    test('lets go as soon as the reader scrolls up, and the button brings it back', async ({ page }) => {
      const demo = demoPage.getDemoByName('streaming');
      await demo.scrollIntoViewIfNeeded();
      const send = demo.locator('button[type="submit"]');
      const rows = demo.locator('z-message-scroller-item');
      const button = demo.locator('[z-message-scroller-button]');

      await clickUntil(send, () => expect(rows).toHaveCount(1, { timeout: 1_000 }));
      await expect(rows).toHaveCount(2, { timeout: 10_000 });
      // let the reply grow past the viewport, then scroll up while it is still streaming
      const viewport = viewportOf(demo);
      await expect.poll(() => scrollTopOf(viewport), { timeout: 15_000 }).toBeGreaterThan(40);
      await wheelUp(page, viewport, 200);
      await expect(button).toHaveAttribute('data-active', 'true');
      const released = await scrollTopOf(viewport);

      await expect(send).toBeEnabled({ timeout: 30_000 });
      expect(Math.abs((await scrollTopOf(viewport)) - released)).toBeLessThanOrEqual(2);

      await button.click();
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);
      await expect(button).toHaveAttribute('data-active', 'false');
    });
  });

  test.describe('loading earlier messages', () => {
    test('keeps the visible row in place when older rows are prepended', async () => {
      const demo = demoPage.getDemoByName('load-history');
      await demo.scrollIntoViewIfNeeded();
      const viewport = viewportOf(demo);
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      // read with the oldest loaded question as the first visible row
      const reference = demo.locator('z-message-scroller-item[data-message-id="user-6"]');
      await viewport.evaluate(el => {
        const row = el.querySelector('[data-message-id="user-6"]') as HTMLElement;
        el.scrollTop += row.getBoundingClientRect().top - el.getBoundingClientRect().top - 12;
      });
      const rows = demo.locator('z-message-scroller-item');
      const rowsBefore = await rows.count();
      const offsetBefore = await offsetInViewport(viewport, reference);

      await clickUntil(demo.getByRole('button', { name: 'Load History' }), () =>
        expect(rows).toHaveCount(rowsBefore + 5, { timeout: 1_000 }),
      );

      // the same row is exactly where the reader left it; the new history is above, out of view
      await expect
        .poll(async () => Math.abs((await offsetInViewport(viewport, reference)) - offsetBefore))
        .toBeLessThanOrEqual(2);
      expect(await scrollTopOf(viewport)).toBeGreaterThan(0);
      await expect(demo.getByRole('button', { name: 'History Loaded' })).toBeDisabled();
    });
  });

  test.describe('commands and state', () => {
    test('jumps to a message from a menu outside the transcript', async ({ page }) => {
      const demo = demoPage.getDemoByName('commands');
      await demo.scrollIntoViewIfNeeded();
      const viewport = viewportOf(demo);
      const target = demo.locator('z-message-scroller-item[data-message-id="command-activation"]');
      await expect.poll(() => distanceToEnd(viewport)).toBeLessThanOrEqual(8);

      await clickUntil(demo.getByRole('button', { name: 'Jump to...' }), () =>
        expect(page.getByRole('menu')).toBeVisible({ timeout: 1_000 }),
      );
      await page.getByRole('menuitem').first().click();

      await expect
        .poll(async () => {
          const [v, t] = await Promise.all([viewport.boundingBox(), target.boundingBox()]);
          return !!v && !!t && t.y >= v.y - 1 && t.y < v.y + v.height;
        })
        .toBe(true);
      // an explicit jump releases the live edge
      await expect(demo.locator('[z-message-scroller-button]')).toHaveAttribute('data-active', 'true');
    });

    test('reports which edges the reader can scroll toward', async () => {
      const demo = demoPage.getDemoByName('scrollable');
      await demo.scrollIntoViewIfNeeded();
      const footer = demo.locator('z-card-footer');
      await expect(footer).toContainText('You are at the top');

      await viewportOf(demo).evaluate(el => {
        el.scrollTop = el.scrollHeight;
      });
      await expect(footer).toContainText('You are at the bottom');
    });

    test('marks the turn being read in the outline', async () => {
      const demo = demoPage.getDemoByName('visibility');
      await demo.scrollIntoViewIfNeeded();
      const marks = demo.getByRole('button', { name: 'Open transcript outline' }).locator('span');
      // the transcript opens at the end, so the last question is the turn being read
      await expect(marks.last()).toHaveAttribute('data-current', 'true');

      // bring the second question to the top: it becomes the turn being read
      await viewportOf(demo).evaluate(el => {
        const row = el.querySelector('[data-message-id="vis-impact"]') as HTMLElement;
        el.scrollTop += row.getBoundingClientRect().top - el.getBoundingClientRect().top;
      });
      await expect(marks.nth(1)).toHaveAttribute('data-current', 'true');
      await expect(marks.last()).toHaveAttribute('data-current', 'false');
    });
  });

  test('passes accessibility checks', async ({ page }) => {
    await checkA11y(page, '#overview');
  });

  test('every example passes accessibility checks', async ({ page }) => {
    // Only the live demos: the code blocks around them are the site's syntax theme, not the component.
    const ids = ['anchoring', 'group-chat', 'previous-context', 'streaming', 'load-history', 'animation', 'scrollable'];
    await checkA11y(page, ids.map(id => `[id="${id}"] [data-slot="preview"]`).join(', '));
  });
});
