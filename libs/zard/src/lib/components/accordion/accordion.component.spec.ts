import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { render } from '@testing-library/angular';

import { ZardAccordionItemComponent } from './accordion-item.component';
import { ZardAccordionComponent } from './accordion.component';
import { mergeClasses } from '../../shared/utils/utils';

jest.mock('../../shared/utils/utils', () => ({
  mergeClasses: jest.fn().mockImplementation((variants, cls) => cls || 'default-classes'),
}));

const getHostComponent = (
  defValue: string | string[] = '',
  mode: 'single' | 'multiple' = 'single',
  isCollapsible = true,
) => {
  @Component({
    imports: [ZardAccordionComponent, ZardAccordionItemComponent],
    template: `
      <z-accordion [zType]="type" [zCollapsible]="collapsible" [zDefaultValue]="defaultValue">
        <z-accordion-item zValue="item-1">Text 1</z-accordion-item>
        <z-accordion-item zValue="item-2">Text 2</z-accordion-item>
        <z-accordion-item zValue="item-3">Text 3</z-accordion-item>
      </z-accordion>
    `,
  })
  class TestHostComponent {
    type: 'single' | 'multiple' = mode;
    collapsible = isCollapsible;
    defaultValue: string | string[] = defValue;
  }
  return TestHostComponent;
};

describe('ZardAccordionComponent', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', async () => {
    const { fixture } = await render(getHostComponent());

    const hostComponent = fixture.componentInstance;
    fixture.detectChanges();

    expect(hostComponent).toBeTruthy();
  });

  it('should apply host classes correctly using mocked utils', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.debugElement.query(By.directive(ZardAccordionComponent)).nativeElement;
    expect(hostElement).toHaveClass('default-classes');
    expect(mergeClasses).toHaveBeenCalled();
  });

  it('should open the default single item on init', async () => {
    const { fixture } = await render(getHostComponent('item-2'));
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item2 = itemInstances.find(item => item.zValue() === 'item-2');
    expect(item2?.isOpen()).toBeTruthy();

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');
    expect(item1?.isOpen()).toBeFalsy();
  });

  it('should throw error if wrong type and default value are set', async () => {
    await expect(render(getHostComponent(['item-1', 'item-3']))).rejects.toThrow(
      new Error('Array of default values is supported only for multiple zType'),
    );
  });

  it('should open multiple default items on init when type is multiple', async () => {
    const { fixture } = await render(getHostComponent(['item-1', 'item-3'], 'multiple'));
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');
    const item3 = itemInstances.find(item => item.zValue() === 'item-3');

    expect(item1?.isOpen()).toBeTruthy();
    expect(item3?.isOpen()).toBeTruthy();

    const item2 = itemInstances.find(item => item.zValue() === 'item-2');
    expect(item2?.isOpen()).toBeFalsy();
  });

  it('should open one item and close others when in single mode', async () => {
    const { fixture } = await render(getHostComponent());
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');
    const item2 = itemInstances.find(item => item.zValue() === 'item-2');

    item1.toggle();

    expect(item1.isOpen()).toBeTruthy();

    item2.toggle();

    expect(item1.isOpen()).toBeFalsy();
    expect(item2.isOpen()).toBeTruthy();
  });

  it('should not close an open item in single mode if zCollapsible is false', async () => {
    const { fixture } = await render(getHostComponent(undefined, undefined, false));
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');

    item1.toggle();
    item1.toggle();

    expect(item1.isOpen()).toBeTruthy();
  });

  it('should toggle items open and closed in multiple mode', async () => {
    const { fixture } = await render(getHostComponent([], 'multiple'));
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');
    const item3 = itemInstances.find(item => item.zValue() === 'item-3');

    item1.toggle();
    item3.toggle();

    expect(item1.isOpen()).toBeTruthy();
    expect(item3.isOpen()).toBeTruthy();

    item1.toggle();
    item3.toggle();

    expect(item1.isOpen()).toBeFalsy();
    expect(item3.isOpen()).toBeFalsy();
  });

  it('should prevent closing the last open item in multiple mode if zCollapsible is false', async () => {
    const { fixture } = await render(getHostComponent([], 'multiple', false));
    fixture.detectChanges();

    const itemDebugElements = fixture.debugElement.queryAll(By.directive(ZardAccordionItemComponent));
    const itemInstances = itemDebugElements.map(debugEl => debugEl.componentInstance);

    const item1 = itemInstances.find(item => item.zValue() === 'item-1');
    const item2 = itemInstances.find(item => item.zValue() === 'item-2');
    const item3 = itemInstances.find(item => item.zValue() === 'item-3');

    item1.toggle();
    item2.toggle();
    item3.toggle();

    expect(item1.isOpen()).toBeTruthy();
    expect(item2.isOpen()).toBeTruthy();
    expect(item3.isOpen()).toBeTruthy();

    item1.toggle();
    item3.toggle();
    item2.toggle();

    expect(item1.isOpen()).toBeFalsy();
    expect(item2.isOpen()).toBeTruthy();
    expect(item3.isOpen()).toBeFalsy();
  });
});
