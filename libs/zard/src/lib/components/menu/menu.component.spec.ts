import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuComponent } from './menu.component';
import { ZardSubmenuComponent } from './submenu.component';

@Component({
  template: `
    <z-menu [zMode]="mode" [zTheme]="theme" [zSelectable]="selectable">
      <li z-menu-item zKey="1">Item 1</li>
      <li z-menu-item zKey="2" [zDisabled]="true">Item 2</li>
      <z-submenu zKey="sub1" zTitle="Submenu">
        <li z-menu-item zKey="3">Item 3</li>
      </z-submenu>
    </z-menu>
  `,
  standalone: true,
  imports: [ZardMenuComponent, ZardMenuItemDirective, ZardSubmenuComponent],
})
class TestHostComponent {
  mode: 'horizontal' | 'vertical' | 'inline' = 'vertical';
  theme: 'light' | 'dark' = 'light';
  selectable = true;
}

describe('ZardMenuComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let menuElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    menuElement = fixture.debugElement.query(By.directive(ZardMenuComponent));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(menuElement).toBeTruthy();
  });

  it('should render menu items', () => {
    const menuItems = fixture.debugElement.queryAll(By.directive(ZardMenuItemDirective));
    expect(menuItems.length).toBe(3);
  });

  it('should apply correct mode', () => {
    const menu = menuElement.nativeElement.querySelector('ul');
    expect(menu.getAttribute('data-mode')).toBe('vertical');

    component.mode = 'horizontal';
    fixture.detectChanges();
    expect(menu.getAttribute('data-mode')).toBe('horizontal');
  });

  it('should apply correct theme', () => {
    const menu = menuElement.nativeElement.querySelector('ul');
    expect(menu.getAttribute('data-theme')).toBe('light');

    component.theme = 'dark';
    fixture.detectChanges();
    expect(menu.getAttribute('data-theme')).toBe('dark');
  });

  it('should handle disabled menu items', () => {
    const menuItems = fixture.debugElement.queryAll(By.directive(ZardMenuItemDirective));
    const disabledItem = menuItems[1];
    expect(disabledItem.nativeElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should emit item click event', () => {
    const menuComponent = menuElement.componentInstance as ZardMenuComponent;
    const spy = jest.spyOn(menuComponent.zItemClick, 'emit');

    const menuItems = fixture.debugElement.queryAll(By.directive(ZardMenuItemDirective));
    const firstItem = menuItems[0];
    firstItem.nativeElement.click();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        key: '1',
        item: expect.any(HTMLElement),
      }),
    );
  });

  it('should have submenu', () => {
    const submenu = fixture.debugElement.query(By.directive(ZardSubmenuComponent));
    expect(submenu).toBeTruthy();
    expect(submenu.componentInstance.zTitle()).toBe('Submenu');
  });
});

describe('ZardMenuItemDirective', () => {
  @Component({
    template: ` <li z-menu-item [zKey]="key" [zDisabled]="disabled" [zSelected]="selected" [zIcon]="icon">Test Item</li> `,
    standalone: true,
    imports: [ZardMenuItemDirective],
  })
  class TestMenuItemComponent {
    key = 'test-key';
    disabled = false;
    selected = false;
    icon = 'home';
  }

  let component: TestMenuItemComponent;
  let fixture: ComponentFixture<TestMenuItemComponent>;
  let directive: ZardMenuItemDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestMenuItemComponent);
    component = fixture.componentInstance;
    const directiveEl = fixture.debugElement.query(By.directive(ZardMenuItemDirective));
    directive = directiveEl.injector.get(ZardMenuItemDirective);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should apply correct attributes', () => {
    const element = fixture.nativeElement.querySelector('[z-menu-item]');
    expect(element.getAttribute('role')).toBe('menuitem');
    expect(element.getAttribute('data-key')).toBe('test-key');
    expect(element.getAttribute('aria-selected')).toBe('false');
    expect(element.getAttribute('aria-disabled')).toBe('false');
  });

  it('should handle disabled state', () => {
    component.disabled = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('[z-menu-item]');
    expect(element.getAttribute('aria-disabled')).toBe('true');
    expect(element.getAttribute('tabindex')).toBe('-1');
  });

  it('should handle selected state', () => {
    component.selected = true;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('[z-menu-item]');
    expect(element.getAttribute('aria-selected')).toBe('true');
  });

  it('should emit click event', () => {
    const spy = jest.spyOn(directive.itemClick, 'emit');
    const element = fixture.nativeElement.querySelector('[z-menu-item]');

    element.click();

    expect(spy).toHaveBeenCalledWith({
      key: 'test-key',
      item: element,
    });
  });

  it('should not emit click when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();

    const spy = jest.spyOn(directive.itemClick, 'emit');
    const element = fixture.nativeElement.querySelector('[z-menu-item]');

    element.click();

    expect(spy).not.toHaveBeenCalled();
  });
});
