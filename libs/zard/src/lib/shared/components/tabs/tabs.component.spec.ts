import { Component, type Type } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { render } from '@testing-library/angular';

import {
  zardChevronDownIcon,
  zardChevronLeftIcon,
  zardChevronRightIcon,
  zardChevronUpIcon,
} from '@/shared/core/icons-registry';
import { noopFn } from '@/shared/utils';

import { ZardTabComponent, ZardTabGroupComponent } from './tabs.component';

const getHostComponent = (position: 'top' | 'bottom' | 'left' | 'right' = 'top'): Type<unknown> => {
  @Component({
    imports: [ZardTabGroupComponent, ZardTabComponent, NgIcon],
    template: `
      <z-tab-group [zTabsPosition]="position">
        <z-tab label="First">First content</z-tab>
        <z-tab label="Second">Second content</z-tab>
        <z-tab label="Third">Third content</z-tab>
      </z-tab-group>
    `,
    viewProviders: [
      provideIcons({
        chevronLeft: zardChevronLeftIcon,
        chevronUp: zardChevronUpIcon,
        chevronRight: zardChevronRightIcon,
        chevronDown: zardChevronDownIcon,
      }),
    ],
  })
  class TestHostComponent {
    position = position;
  }
  return TestHostComponent;
};

describe('ZardTabGroupComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates the component', async () => {
    const { fixture } = await render(getHostComponent());

    const hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    expect(hostComponent).toBeTruthy();
  });

  it('selects first tab by default', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    expect(tabGroup.activeTabIndex()).toBe(0);
  });

  it('changes active tab index when setActiveTab is called', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    const emitSpy = jest.spyOn(tabGroup.zTabChange, 'emit');

    tabGroup.setActiveTab(1);
    fixture.detectChanges();

    expect(tabGroup.activeTabIndex()).toBe(1);
    expect(emitSpy).toHaveBeenCalled();
    const call = emitSpy.mock.calls[0][0] as { index: number; label: string; tab: unknown };
    expect(call.index).toBe(1);
    expect(call.label).toBe('Second');
  });

  it('emits zDeselect when switching from active tab', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;

    tabGroup.setActiveTab(1);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(tabGroup.zDeselect, 'emit');

    tabGroup.setActiveTab(2);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalled();
    const call = emitSpy.mock.calls[0][0] as { index: number; label: string; tab: unknown };
    expect(call.index).toBe(1);
    expect(call.label).toBe('Second');
  });

  it('shows correct tabpanel content when tab is selected', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    const tabPanels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));

    expect(tabPanels[0].nativeElement.hasAttribute('hidden')).toBeFalsy();
    expect(tabPanels[1].nativeElement.hasAttribute('hidden')).toBeTruthy();
    expect(tabPanels[2].nativeElement.hasAttribute('hidden')).toBeTruthy();

    tabGroup.setActiveTab(1);
    fixture.detectChanges();

    const updatedTabPanels = fixture.debugElement.queryAll(By.css('[role="tabpanel"]'));
    expect(updatedTabPanels[0].nativeElement.hasAttribute('hidden')).toBeTruthy();
    expect(updatedTabPanels[1].nativeElement.hasAttribute('hidden')).toBeFalsy();
    expect(updatedTabPanels[2].nativeElement.hasAttribute('hidden')).toBeTruthy();
  });

  it('applies correct classes for different positions', async () => {
    const { fixture } = await render(getHostComponent('left'));
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent));
    expect(tabGroup.nativeElement).toHaveClass('flex-row');
  });

  it('has selectTabByIndex method', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;

    tabGroup.selectTabByIndex(2);
    fixture.detectChanges();

    expect(tabGroup.activeTabIndex()).toBe(2);
  });

  it('warns when selectTabByIndex is called with out of range index', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(noopFn);

    tabGroup.selectTabByIndex(10);
    fixture.detectChanges();

    expect(consoleWarn).toHaveBeenCalledWith('Index 10 outside the range of available tabs.');
    consoleWarn.mockRestore();
  });

  it('calculates isHorizontal correctly', async () => {
    const { fixture } = await render(getHostComponent('left'));
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    expect(tabGroup.isHorizontal()).toBe(false);
  });

  it('calculates navBeforeContent correctly for top position', async () => {
    const { fixture } = await render(getHostComponent('top'));
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    expect(tabGroup.navBeforeContent()).toBe(true);
  });

  it('calculates navBeforeContent correctly for bottom position', async () => {
    const { fixture } = await render(getHostComponent('bottom'));
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    expect(tabGroup.navBeforeContent()).toBe(false);
  });
});

describe('ZardTabComponent', () => {
  it('creates the component', async () => {
    @Component({
      imports: [ZardTabComponent],
      template: `
        <z-tab label="Test">Content</z-tab>
      `,
    })
    class TestHostComponent {}

    const { fixture } = await render(TestHostComponent);
    fixture.detectChanges();

    const tabComponent = fixture.debugElement.query(By.directive(ZardTabComponent)).componentInstance;
    expect(tabComponent).toBeTruthy();
  });

  it('has required label input', async () => {
    @Component({
      imports: [ZardTabComponent],
      template: `
        <z-tab label="My Tab">Content</z-tab>
      `,
    })
    class TestHostComponent {}

    const { fixture } = await render(TestHostComponent);
    fixture.detectChanges();

    const tabComponent = fixture.debugElement.query(By.directive(ZardTabComponent)).componentInstance;
    expect(tabComponent.label()).toBe('My Tab');
  });
});
