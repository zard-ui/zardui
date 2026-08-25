import { Component, inject, viewChild } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

import type { ZardDropdownMenuContentComponent } from '@/shared/components/dropdown/dropdown-menu-content.component';

import { ZardContextMenuImports } from './context-menu.imports';
import { ZardContextMenuService } from './context-menu.service';

@Component({
  imports: [ZardContextMenuImports],
  template: `
    <button type="button" (contextmenu)="openMenu($event)" data-testid="row">Row</button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent">
      <z-dropdown-menu-item>Rename</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
})
class TestComponent {
  readonly contextMenu = inject(ZardContextMenuService);
  readonly menu = viewChild.required<ZardDropdownMenuContentComponent>('menu');

  openMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenu.create(event, this.menu());
  }
}

describe('ZardContextMenuService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let service: ZardContextMenuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestComponent] }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    service = TestBed.inject(ZardContextMenuService);
  });

  afterEach(() => {
    service.close();
    fixture.destroy();
  });

  function menuSurface() {
    return document.querySelector<HTMLElement>('[data-slot="dropdown-menu-content"]');
  }

  it('opens the menu from a pointer event', () => {
    const row = fixture.nativeElement.querySelector('[data-testid="row"]');
    row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 30, clientY: 40 }));
    fixture.detectChanges();

    expect(menuSurface()).not.toBeNull();
    expect(service.isOpen()).toBe(true);
  });

  it('opens the menu from a bare coordinate', () => {
    service.create({ x: 12, y: 34 }, fixture.componentInstance.menu());
    fixture.detectChanges();

    expect(menuSurface()).not.toBeNull();
  });

  it('closes the open menu', () => {
    service.create({ x: 12, y: 34 }, fixture.componentInstance.menu());
    fixture.detectChanges();

    service.close();
    fixture.detectChanges();

    expect(menuSurface()).toBeNull();
    expect(service.isOpen()).toBe(false);
  });

  it('keeps a single menu open when called twice', () => {
    service.create({ x: 0, y: 0 }, fixture.componentInstance.menu());
    service.create({ x: 100, y: 100 }, fixture.componentInstance.menu());
    fixture.detectChanges();

    expect(document.querySelectorAll('[data-slot="dropdown-menu-content"]').length).toBe(1);
  });

  it('refuses a bare TemplateRef with no view container to render it from', () => {
    const template = fixture.componentInstance.menu().contentTemplate();

    expect(() => service.create({ x: 0, y: 0 }, template)).toThrow(/viewContainerRef/);
  });
});
