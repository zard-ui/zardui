import '@testing-library/jest-dom';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BehaviorSubject } from 'rxjs';

import { ZARD_SIDEBAR_WIDTH, ZARD_SIDEBAR_WIDTH_ICON } from '@/shared/components/sidebar/sidebar.constants';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

import type { ZardSidebarCollapsibleVariants } from './sidebar.variants';

const matches = new BehaviorSubject({ matches: false, breakpoints: {} });

const breakpointObserverMock = {
  observe: () => matches.asObservable(),
  isMatched: () => matches.value.matches,
};

@Component({
  selector: 'z-test-sidebar',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider [zDefaultOpen]="defaultOpen()" [zOpen]="controlledOpen()" (zOpenChange)="onOpenChange($event)">
      <z-sidebar [zSide]="side()" [zVariant]="variant()" [zCollapsible]="collapsible()">
        <div z-sidebar-header>Header</div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <ul z-sidebar-menu>
              <li z-sidebar-menu-item>
                <button z-sidebar-menu-button [zActive]="active()" zTooltip="Home">Home</button>
              </li>
            </ul>
          </div>
        </z-sidebar-content>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset>
        <button z-sidebar-trigger aria-label="Toggle Sidebar"></button>
      </main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestHostComponent {
  readonly defaultOpen = signal(true);
  readonly controlledOpen = signal<boolean | undefined>(undefined);
  readonly side = signal<'left' | 'right'>('left');
  readonly variant = signal<'sidebar' | 'floating' | 'inset'>('sidebar');
  readonly collapsible = signal<ZardSidebarCollapsibleVariants>('offcanvas');
  readonly active = signal(false);
  readonly changes: boolean[] = [];

  onOpenChange(open: boolean): void {
    this.changes.push(open);
  }
}

@Component({
  selector: 'z-test-sidebar-closed',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider [zDefaultOpen]="false">
      <z-sidebar>
        <z-sidebar-content>Content</z-sidebar-content>
      </z-sidebar>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ClosedByDefaultHostComponent {}

const setup = async () => {
  const view = await render(TestHostComponent, {
    providers: [{ provide: BreakpointObserver, useValue: breakpointObserverMock }],
  });

  const query = (selector: string) => view.container.querySelector<HTMLElement>(selector) as HTMLElement;

  return {
    ...view,
    query,
    wrapper: query('[data-slot="sidebar-wrapper"]'),
    sidebar: query('[data-slot="sidebar"]'),
    // The rail also exposes the "Toggle Sidebar" accessible name, exactly like shadcn.
    trigger: query('[data-slot="sidebar-trigger"]'),
  };
};

describe('ZardSidebarProviderComponent', () => {
  beforeEach(() => {
    matches.next({ matches: false, breakpoints: {} });
    document.cookie = 'sidebar_state=; path=/; max-age=0';
  });

  it('renders the wrapper with the sidebar width variables inline', async () => {
    const { wrapper } = await setup();

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.style.getPropertyValue('--sidebar-width')).toBe(ZARD_SIDEBAR_WIDTH);
    expect(wrapper.style.getPropertyValue('--sidebar-width-icon')).toBe(ZARD_SIDEBAR_WIDTH_ICON);
  });

  it('starts collapsed when zDefaultOpen is false', async () => {
    const view = await render(ClosedByDefaultHostComponent, {
      providers: [{ provide: BreakpointObserver, useValue: breakpointObserverMock }],
    });
    const sidebar = view.container.querySelector('[data-slot="sidebar"]') as HTMLElement;

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });

  it('toggles data-state through the trigger', async () => {
    const { sidebar, trigger } = await setup();

    expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await userEvent.click(trigger);

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(sidebar).toHaveAttribute('data-collapsible', 'offcanvas');
  });

  it('toggles with Ctrl+B', async () => {
    const { sidebar } = await setup();

    await userEvent.keyboard('{Control>}b{/Control}');

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });

  it('emits zOpenChange without touching internal state while controlled', async () => {
    const { fixture, sidebar, trigger } = await setup();

    fixture.componentInstance.controlledOpen.set(true);
    fixture.detectChanges();

    await userEvent.click(trigger);

    expect(fixture.componentInstance.changes).toEqual([false]);
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });
});

describe('ZardSidebarComponent', () => {
  beforeEach(() => {
    matches.next({ matches: false, breakpoints: {} });
    document.cookie = 'sidebar_state=; path=/; max-age=0';
  });

  it('applies data-side, data-variant and data-collapsible', async () => {
    const { fixture, sidebar, trigger } = await setup();

    fixture.componentInstance.side.set('right');
    fixture.componentInstance.variant.set('inset');
    fixture.detectChanges();

    expect(sidebar).toHaveAttribute('data-side', 'right');
    expect(sidebar).toHaveAttribute('data-variant', 'inset');
    // Empty while expanded — every group-data-[collapsible=…] class depends on this.
    expect(sidebar).toHaveAttribute('data-collapsible', '');

    await userEvent.click(trigger);

    expect(sidebar).toHaveAttribute('data-collapsible', 'offcanvas');
  });

  it('renders neither gap nor container when zCollapsible is none', async () => {
    const { fixture, query } = await setup();

    fixture.componentInstance.collapsible.set('none');
    fixture.detectChanges();

    expect(query('[data-slot="sidebar-gap"]')).toBeNull();
    expect(query('[data-slot="sidebar-container"]')).toBeNull();
    expect(screen.getByText('Header')).toBeVisible();
  });

  it('renders the mobile drawer with a focus trap when the viewport is mobile', async () => {
    matches.next({ matches: true, breakpoints: {} });

    const { fixture, query, trigger } = await setup();

    expect(query('[data-mobile="true"]')).toBeNull();

    await userEvent.click(trigger);
    fixture.detectChanges();

    const drawer = query('[data-mobile="true"]');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(query('[data-slot="sidebar-backdrop"]')).toBeInTheDocument();
  });

  it('closes the mobile drawer on Escape', async () => {
    matches.next({ matches: true, breakpoints: {} });

    const { fixture, query, trigger } = await setup();

    await userEvent.click(trigger);
    fixture.detectChanges();
    expect(query('[data-mobile="true"]')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    fixture.detectChanges();

    expect(query('[data-mobile="true"]')).toBeNull();
  });
});

describe('ZardSidebarMenuButtonComponent', () => {
  beforeEach(() => {
    matches.next({ matches: false, breakpoints: {} });
    document.cookie = 'sidebar_state=; path=/; max-age=0';
  });

  it('reflects zActive through data-active', async () => {
    const { fixture, query } = await setup();

    expect(query('[data-slot="sidebar-menu-button"]')).toHaveAttribute('data-active', 'false');

    fixture.componentInstance.active.set(true);
    fixture.detectChanges();

    expect(query('[data-slot="sidebar-menu-button"]')).toHaveAttribute('data-active', 'true');
  });

  it('shows the tooltip only while collapsed on desktop', async () => {
    const { trigger } = await setup();

    const button = screen.getByRole('button', { name: 'Home' });

    await userEvent.hover(button);
    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();

    await userEvent.unhover(button);
    await userEvent.click(trigger);
    await userEvent.hover(button);

    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeInTheDocument();

    await userEvent.unhover(button);

    expect(document.querySelector('[data-slot="tooltip-content"]')).toBeNull();
  });
});
