import { Component, type Type } from '@angular/core';
import { By } from '@angular/platform-browser';

import { render } from '@testing-library/angular';

import { noopFn } from '@/shared/utils';

import { ZardTabComponent, ZardTabGroupComponent } from './tabs.component';

const getHostComponent = (orientation: 'horizontal' | 'vertical' = 'horizontal'): Type<unknown> => {
  @Component({
    imports: [ZardTabGroupComponent, ZardTabComponent],
    template: `
      <z-tab-group [zOrientation]="orientation">
        <z-tab label="First">First content</z-tab>
        <z-tab label="Second">Second content</z-tab>
        <z-tab label="Third">Third content</z-tab>
      </z-tab-group>
    `,
  })
  class TestHostComponent {
    orientation = orientation;
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

  it('applies horizontal layout classes by default', async () => {
    const { fixture } = await render(getHostComponent('horizontal'));
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).nativeElement as HTMLElement;
    expect(host.className).toContain('flex-col');
    expect(host.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('applies vertical layout classes when zOrientation is vertical', async () => {
    const { fixture } = await render(getHostComponent('vertical'));
    fixture.detectChanges();

    const host = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).nativeElement as HTMLElement;
    expect(host.className).toContain('flex-row');
    expect(host.getAttribute('data-orientation')).toBe('vertical');
  });

  it('marks the active button with data-active', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const tabGroup = fixture.debugElement.query(By.directive(ZardTabGroupComponent)).componentInstance;
    tabGroup.setActiveTab(1);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
    expect((buttons[0].nativeElement as HTMLElement).hasAttribute('data-active')).toBe(false);
    expect((buttons[1].nativeElement as HTMLElement).hasAttribute('data-active')).toBe(true);
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

  it('applies default variant pill classes on nav element', async () => {
    @Component({
      imports: [ZardTabGroupComponent, ZardTabComponent],
      template: `
        <z-tab-group>
          <z-tab label="First">First</z-tab>
          <z-tab label="Second">Second</z-tab>
        </z-tab-group>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav[role="tablist"]')).nativeElement as HTMLElement;
    expect(nav.className).toContain('bg-muted');
    expect(nav.className).toContain('rounded-lg');
    expect(nav.getAttribute('data-variant')).toBe('default');
  });

  it('applies line variant classes on nav element', async () => {
    @Component({
      imports: [ZardTabGroupComponent, ZardTabComponent],
      template: `
        <z-tab-group zVariant="line">
          <z-tab label="First">First</z-tab>
          <z-tab label="Second">Second</z-tab>
        </z-tab-group>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const nav = fixture.debugElement.query(By.css('nav[role="tablist"]')).nativeElement as HTMLElement;
    expect(nav.className).toContain('bg-transparent');
    expect(nav.className).not.toContain('bg-muted');
    expect(nav.getAttribute('data-variant')).toBe('line');
  });

  it('disables individual tab button when zDisabled is true on z-tab', async () => {
    @Component({
      imports: [ZardTabGroupComponent, ZardTabComponent],
      template: `
        <z-tab-group>
          <z-tab label="Enabled">A</z-tab>
          <z-tab label="Disabled" [zDisabled]="true">B</z-tab>
        </z-tab-group>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
    expect((buttons[0].nativeElement as HTMLButtonElement).disabled).toBe(false);
    expect((buttons[1].nativeElement as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables all tab buttons when zDisabled is true on z-tab-group', async () => {
    @Component({
      imports: [ZardTabGroupComponent, ZardTabComponent],
      template: `
        <z-tab-group [zDisabled]="true">
          <z-tab label="One">A</z-tab>
          <z-tab label="Two">B</z-tab>
        </z-tab-group>
      `,
    })
    class Host {}

    const { fixture } = await render(Host);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button[role="tab"]'));
    buttons.forEach(btn => {
      expect((btn.nativeElement as HTMLButtonElement).disabled).toBe(true);
    });
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
