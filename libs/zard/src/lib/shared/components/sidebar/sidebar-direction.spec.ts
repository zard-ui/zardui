import '@testing-library/jest-dom';
import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BehaviorSubject, Subject } from 'rxjs';

import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';

import {
  sidebarGroupActionVariants,
  sidebarInsetVariants,
  sidebarMenuActionVariants,
  sidebarMenuBadgeVariants,
  sidebarMenuButtonVariants,
  sidebarMenuSubButtonVariants,
  sidebarMenuSubVariants,
} from './sidebar.variants';

const matches = new BehaviorSubject({ matches: false, breakpoints: {} });
const breakpointObserverMock = { observe: () => matches.asObservable(), isMatched: () => matches.value.matches };

@Component({
  selector: 'z-test-sidebar-direction',
  imports: [ZardSidebarImports],
  template: `
    <z-sidebar-provider [zDefaultOpen]="false">
      <z-sidebar [zSide]="side()">
        <z-sidebar-content>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zTooltip="Home">Home</button>
            </li>
          </ul>
        </z-sidebar-content>
      </z-sidebar>
      <main z-sidebar-inset></main>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DirectionHostComponent {
  readonly side = input<'left' | 'right'>('left');
}

async function setup(direction: 'ltr' | 'rtl', side: 'left' | 'right') {
  await render(DirectionHostComponent, {
    inputs: { side },
    providers: [
      { provide: BreakpointObserver, useValue: breakpointObserverMock },
      {
        provide: Directionality,
        useValue: { value: direction, valueSignal: signal(direction), change: new Subject() },
      },
    ],
  });
  const button = screen.getByRole('button', { name: 'Home' });
  await userEvent.hover(button);
  return document.querySelector('[data-slot="tooltip-content"]') as HTMLElement | null;
}

describe('ZardSidebar direction', () => {
  beforeEach(() => {
    matches.next({ matches: false, breakpoints: {} });
    document.cookie = 'sidebar_state=; path=/; max-age=0';
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(node => node.remove());
  });

  it('opens the collapsed-button tooltip towards the content for a left sidebar in LTR', async () => {
    const tooltip = await setup('ltr', 'left');

    expect(tooltip?.getAttribute('data-side')).toBe('right');
  });

  it('opens the tooltip on the physical left of a right sidebar, the natural RTL layout', async () => {
    const tooltip = await setup('rtl', 'right');

    expect(tooltip?.getAttribute('data-side')).toBe('left');
    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).not.toBeNull();
  });

  it('gives the tooltip the direction of the button', async () => {
    await setup('rtl', 'left');

    expect(document.querySelector('.cdk-overlay-container [dir="rtl"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-container [dir="ltr"]')).toBeNull();
  });

  describe('logical classes', () => {
    const physical = /(^|[\s:])-?(ml|mr|pl|pr|left|right)-|text-(left|right)|border-[lr](\s|$)/;

    it('positions the group action, menu action and badge on the inline-end edge', () => {
      expect(sidebarGroupActionVariants()).toContain('end-3');
      expect(sidebarMenuActionVariants()).toContain('end-1');
      expect(sidebarMenuBadgeVariants()).toContain('end-1');
      for (const classes of [sidebarGroupActionVariants(), sidebarMenuActionVariants(), sidebarMenuBadgeVariants()]) {
        expect(classes).not.toMatch(physical);
      }
    });

    it('aligns the menu button text and reserves its action space logically', () => {
      const classes = sidebarMenuButtonVariants();
      expect(classes).toContain('text-start');
      expect(classes).toContain('menu-item:pe-8');
      expect(classes).not.toMatch(physical);
    });

    it('draws the sub menu rule on the inline-start edge and mirrors its optical nudge', () => {
      const sub = sidebarMenuSubVariants();
      expect(sub).toContain('border-s');
      expect(sub).toContain('translate-x-px');
      expect(sub).toContain('rtl:-translate-x-px');
      expect(sub).not.toMatch(physical);
      expect(sidebarMenuSubButtonVariants()).toContain('rtl:translate-x-px');
    });

    it('offsets the inset variant from the inline-start edge', () => {
      const inset = sidebarInsetVariants();
      expect(inset).toContain('ms-0');
      expect(inset).toContain('ms-2');
      expect(inset).not.toMatch(physical);
    });
  });
});
