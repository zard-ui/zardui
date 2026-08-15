import { type ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { PLATFORM_ID, signal, type WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { fireEvent, render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ZardHoverCardComponent, ZardHoverCardDirective } from './hover-card.component';

const CARD_CONTENT = 'The React Framework - created and maintained by @vercel.';

interface SetupOptions {
  closeDelay?: number;
  contentOnly?: boolean;
  contentClass?: string;
  openDelay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  platformId?: string;
  visible?: WritableSignal<boolean>;
  visibleChange?: jest.Mock<void, [boolean]>;
}

async function setup({
  closeDelay = 300,
  contentClass = '',
  contentOnly = false,
  openDelay = 700,
  placement = 'bottom',
  platformId,
  visible = signal(false),
  visibleChange = jest.fn(),
}: SetupOptions = {}) {
  if (contentOnly) {
    return render(`<z-hover-card [class]="contentClass">${CARD_CONTENT}</z-hover-card>`, {
      imports: [ZardHoverCardComponent],
      componentProperties: { contentClass },
    });
  }

  return render(
    `
      <button
        type="button"
        [zHoverCard]="content"
        [zOpenDelay]="openDelay"
        [zCloseDelay]="closeDelay"
        [zPlacement]="placement"
        [zVisible]="visible()"
        (zVisibleChange)="visibleChange($event)"
      >
        Hover Here
      </button>

      <ng-template #content>
        <z-hover-card [class]="contentClass">
          <a href="#details">${CARD_CONTENT}</a>
        </z-hover-card>
      </ng-template>
    `,
    {
      imports: [OverlayModule, ZardHoverCardDirective, ZardHoverCardComponent],
      componentProperties: { closeDelay, contentClass, openDelay, placement, visible, visibleChange },
      providers: platformId === undefined ? [] : [{ provide: PLATFORM_ID, useValue: platformId }],
    },
  );
}

function trigger(): HTMLButtonElement {
  return screen.getByRole('button', { name: 'Hover Here' });
}

function card(): HTMLElement {
  return screen.getByText(CARD_CONTENT).closest('z-hover-card') as HTMLElement;
}

function overlayPane(): HTMLElement {
  return card().closest('.cdk-overlay-pane') as HTMLElement;
}

async function hoverTrigger(openDelay = 700): Promise<void> {
  fireEvent.mouseEnter(trigger());
  jest.advanceTimersByTime(openDelay);
}

describe('ZardHoverCardComponent', () => {
  it('creates the content component and merges custom classes', async () => {
    await setup({ contentOnly: true, contentClass: 'w-96 custom-class' });

    const content = screen.getByText(CARD_CONTENT);

    expect(content).toBeVisible();
    expect(content).toHaveClass('w-96', 'custom-class');
  });
});

describe('ZardHoverCardDirective', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('does not open before the configured delay', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await setup({ openDelay: 500 });

    await user.hover(trigger());
    jest.advanceTimersByTime(499);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('opens after the configured delay on hover', async () => {
    await setup({ openDelay: 500 });

    await hoverTrigger(500);

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();
  });

  it('cancels a pending open when the pointer leaves early', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await setup({ openDelay: 500 });

    await user.hover(screen.getByRole('button', { name: 'Hover Here' }));
    await user.hover(trigger());
    jest.advanceTimersByTime(499);
    await user.unhover(trigger());
    jest.advanceTimersByTime(1);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('closes only after the configured close delay', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    await hoverTrigger(0);

    fireEvent.mouseLeave(trigger());
    jest.advanceTimersByTime(299);

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();

    jest.advanceTimersByTime(1);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('cancels a pending close when the pointer re-enters the trigger', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await setup({ openDelay: 0, closeDelay: 300 });
    await hoverTrigger(0);

    await user.unhover(trigger());
    jest.advanceTimersByTime(299);
    await user.hover(trigger());
    jest.advanceTimersByTime(1);

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();
  });

  it('keeps the card open when the pointer moves from the trigger into the overlay', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    await hoverTrigger(0);
    const overlay = overlayPane();

    fireEvent.mouseLeave(trigger(), { relatedTarget: overlay });
    fireEvent.mouseEnter(overlay, { relatedTarget: trigger() });
    jest.advanceTimersByTime(300);

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();
  });

  it('closes after the pointer leaves both the trigger and overlay', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    await hoverTrigger(0);
    const overlay = overlayPane();

    fireEvent.mouseLeave(trigger(), { relatedTarget: overlay });
    fireEvent.mouseEnter(overlay, { relatedTarget: trigger() });
    fireEvent.mouseLeave(overlay);
    jest.advanceTimersByTime(300);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('opens on focusin', async () => {
    await setup({ openDelay: 500 });

    fireEvent.focusIn(trigger());
    jest.advanceTimersByTime(500);

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();
  });

  it('stays open while focus is inside the card', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    const hoverCardTrigger = trigger();

    hoverCardTrigger.focus();
    jest.advanceTimersByTime(0);
    const cardLink = screen.getByRole('link', { name: CARD_CONTENT });

    expect(hoverCardTrigger).toHaveFocus();

    cardLink.focus();
    jest.advanceTimersByTime(300);

    expect(hoverCardTrigger).not.toHaveFocus();
    expect(cardLink).toHaveFocus();
    expect(screen.getByText(CARD_CONTENT)).toBeVisible();
  });

  it('closes when focus leaves the trigger and card region', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    fireEvent.focusIn(trigger());
    jest.advanceTimersByTime(0);
    const cardLink = screen.getByRole('link', { name: CARD_CONTENT });

    fireEvent.focusOut(trigger(), { relatedTarget: cardLink });
    fireEvent.focusIn(cardLink, { relatedTarget: trigger() });
    fireEvent.focusOut(cardLink);
    jest.advanceTimersByTime(300);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('closes immediately on Escape', async () => {
    await setup({ openDelay: 0, closeDelay: 300 });
    await hoverTrigger(0);
    expect(screen.getByText(CARD_CONTENT)).toBeVisible();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('responds to programmatic visibility changes', async () => {
    const visible = signal(false);
    const { fixture } = await setup({ visible });

    visible.set(true);
    fixture.detectChanges();

    expect(screen.getByText(CARD_CONTENT)).toBeVisible();

    visible.set(false);
    fixture.detectChanges();

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('emits visibility changes once per actual transition', async () => {
    const visibleChange = jest.fn<void, [boolean]>();
    await setup({ openDelay: 0, closeDelay: 0, visibleChange });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.hover(trigger());
    jest.advanceTimersByTime(0);
    await user.hover(trigger());
    await user.unhover(trigger());
    jest.advanceTimersByTime(0);
    await user.unhover(trigger());

    expect(visibleChange.mock.calls).toEqual([[true], [false]]);
  });

  it('cleans pending timers and trigger listeners on destroy', async () => {
    const visibleChange = jest.fn<void, [boolean]>();
    const { fixture } = await setup({ openDelay: 500, visibleChange });
    const hoverCardTrigger = trigger();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    await user.hover(hoverCardTrigger);

    fixture.destroy();
    jest.advanceTimersByTime(500);
    fireEvent.mouseEnter(hoverCardTrigger);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
    expect(visibleChange).not.toHaveBeenCalled();
  });

  it('disposes attached overlay content on destroy', async () => {
    const { fixture } = await setup({ openDelay: 0 });
    await hoverTrigger(0);
    expect(screen.getByText(CARD_CONTENT)).toBeVisible();

    fixture.destroy();

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it.each([
    {
      placement: 'top',
      primary: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
      fallback: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    },
    {
      placement: 'bottom',
      primary: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
      fallback: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    },
    {
      placement: 'left',
      primary: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
      fallback: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
    },
    {
      placement: 'right',
      primary: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
      fallback: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
    },
  ] as const)('places $placement first and provides a fallback position', async ({ placement, primary, fallback }) => {
    const { fixture } = await setup({ placement });
    const directive = fixture.debugElement
      .query(By.directive(ZardHoverCardDirective))
      .injector.get(ZardHoverCardDirective);
    const positionAwareDirective = directive as unknown as { getPositions(): ConnectedPosition[] };
    const positions = positionAwareDirective.getPositions();

    expect(positions.length).toBeGreaterThan(1);
    expect(positions[0]).toMatchObject(primary);
    expect(positions[1]).toMatchObject(fallback);
  });

  it('does not create browser overlay content during server rendering', async () => {
    await expect(setup({ openDelay: 0, platformId: 'server' })).resolves.toBeDefined();

    fireEvent.mouseEnter(trigger());
    jest.advanceTimersByTime(0);

    expect(screen.queryByText(CARD_CONTENT)).not.toBeInTheDocument();
  });

  it('associates the open trigger with the overlay', async () => {
    await setup({ openDelay: 0 });
    const hoverCardTrigger = trigger();

    expect(hoverCardTrigger).toHaveAttribute('aria-expanded', 'false');
    expect(hoverCardTrigger).not.toHaveAttribute('aria-controls');

    await hoverTrigger(0);

    const controlledId = hoverCardTrigger.getAttribute('aria-controls');

    expect(hoverCardTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(controlledId).toBeTruthy();
    expect(document.getElementById(controlledId!)).toBeInTheDocument();
  });
});
