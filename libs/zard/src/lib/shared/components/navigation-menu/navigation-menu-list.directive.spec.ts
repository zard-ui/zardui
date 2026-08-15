import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ZardNavigationMenuItemDirective } from './navigation-menu-item.directive';
import { ZardNavigationMenuListDirective } from './navigation-menu-list.directive';

@Component({
  imports: [ZardNavigationMenuListDirective, ZardNavigationMenuItemDirective],
  template: `
    <ul z-navigation-menu-list [class]="listClass">
      <li z-navigation-menu-item [class]="itemClass">Item</li>
    </ul>
  `,
})
class TestComponent {
  listClass = '';
  itemClass = '';
}

describe('ZardNavigationMenuListDirective / ZardNavigationMenuItemDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let list: HTMLElement;
  let item: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    list = fixture.debugElement.query(By.directive(ZardNavigationMenuListDirective)).nativeElement;
    item = fixture.debugElement.query(By.directive(ZardNavigationMenuItemDirective)).nativeElement;
  });

  it('should tag both slots', () => {
    expect(list.getAttribute('data-slot')).toBe('navigation-menu-list');
    expect(item.getAttribute('data-slot')).toBe('navigation-menu-item');
  });

  it('should apply the list variant classes', () => {
    expect(list.className).toContain('flex');
    expect(list.className).toContain('list-none');
    expect(list.className).toContain('items-center');
  });

  it('should make the item a positioning context for the indicator', () => {
    expect(item.className).toContain('relative');
  });

  it('should merge custom classes', () => {
    component.listClass = 'custom-list';
    component.itemClass = 'custom-item';
    fixture.detectChanges();

    expect(list.className).toContain('custom-list');
    expect(list.className).toContain('list-none');
    expect(item.className).toContain('custom-item');
    expect(item.className).toContain('relative');
  });
});
